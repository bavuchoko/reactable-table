import React, { useState, useRef, useEffect, useCallback, memo } from "react";
//@ts-ignore
import { VariableSizeGrid as Grid } from "react-window";
//@ts-ignore
import { useColumnWidths } from "./hook/useColumnWidths";
//@ts-ignore
import { useColumnOrder } from "./hook/useColumnOrder";

const defaultColumnWidth = 100;
const rowHeight = 26;

interface HeaderData {
    id: string;
    title: string;
}

interface ContentData {
    [key: string]: string;
}

interface ReactableTableProps {
    data: {
        header: HeaderData[];
        content: ContentData[];
    };
    customStyle?: {
        headerStyle?: React.CSSProperties;
        contentStyle?: React.CSSProperties;
    };
}

const ReactableTable: React.FC<ReactableTableProps> = ({ data, customStyle }) => {
    const { header, content } = data;
    const gridRef = useRef<Grid>(null);
    const { columnWidths, handleMouseDown } = useColumnWidths(data.header.length, defaultColumnWidth, gridRef);
    const { columnOrder, handleDragStart, handleDragOver, handleDrop } = useColumnOrder(data.header.length);

    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const contentDataRef = useRef<ContentData[]>(content);

    const editingCell = useRef<{ row: number; col: number } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(window.innerWidth);
            setViewportHeight(window.innerHeight);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const getColumnWidth = useCallback((index: number) => columnWidths[index], [columnWidths]);

    const handleCellClick = useCallback((rowIndex: number, columnIndex: number) => {
        if (rowIndex === 0) return;
        editingCell.current = { row: rowIndex - 1, col: columnIndex };
        gridRef.current?.resetAfterIndices({ rowIndex, columnIndex });
    }, []);

    const handleBlur = useCallback(() => {
        editingCell.current = null;
        gridRef.current?.resetAfterIndices({ rowIndex: 0, columnIndex: 0 });
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, columnIndex: number) => {
        contentDataRef.current[rowIndex][header[columnOrder[columnIndex]].id] = e.target.value;
        gridRef.current?.resetAfterIndices({ rowIndex: rowIndex + 1, columnIndex });
    }, [columnOrder, header]);


    const Cell = memo(({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
        const actualColumnIndex = columnOrder[columnIndex];
        const left = columnOrder.slice(0, columnIndex).reduce((acc, cur) => acc + columnWidths[cur], 0);

        if (rowIndex === 0) {
            return (
                <div
                    style={{
                        left,
                        width: columnWidths[actualColumnIndex],
                        border: "1px solid black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "white",
                        position: "absolute",
                        top: 0,
                        ...customStyle?.headerStyle,
                    }}
                >
                    <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, columnIndex)}
                        onDragOver={(e) => handleDragOver(e)}
                        onDrop={(e) => handleDrop(e, columnIndex)}
                        style={{ padding: "4px" }}
                    >
                        {header[actualColumnIndex].title}
                    </div>
                    <div
                        onMouseDown={(e) => handleMouseDown(e, columnIndex)}
                        style={{
                            width: "7px",
                            height: "100%",
                            cursor: "col-resize",
                            position: "absolute",
                            right: 0,
                            top: 0,
                            bottom: 0,
                        }}
                    >
                        <div
                            style={{
                                borderLeft: "1px solid black",
                                marginLeft: "auto",
                                width: "3px",
                                height: "100%",
                            }}
                        />
                    </div>
                </div>
            );
        }

        return (
            <div
                style={{
                    ...style,
                    left,
                    width: columnWidths[actualColumnIndex],
                    border: "1px solid black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: rowIndex % 2 === 0 ? "#f9f9f9" : "#fff",
                    cursor: "pointer",
                }}
                onClick={() => handleCellClick(rowIndex, columnIndex)}
            >
                {editingCell.current?.row === rowIndex - 1 && editingCell.current?.col === columnIndex ? (
                    <input
                        ref={inputRef}
                        autoFocus
                        defaultValue={contentDataRef.current[rowIndex - 1][header[actualColumnIndex].id] || ""}
                        onChange={(e) => handleInputChange(e, rowIndex - 1, columnIndex)}
                        onBlur={handleBlur}
                        onKeyDown={(e) => e.key === "Enter" && handleBlur()}
                        style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            textAlign: "center",
                            background: "white",
                        }}
                    />
                ) : (
                    contentDataRef.current[rowIndex - 1][header[actualColumnIndex].id]
                )}
            </div>
        );
    });

    return (
        <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
            <Grid
                ref={gridRef}
                columnCount={data.header.length}
                columnWidth={getColumnWidth}
                height={viewportHeight}
                rowCount={contentDataRef.current.length + 1}
                rowHeight={() => rowHeight}
                width={viewportWidth}
                overscanCount={2}
                itemData={columnWidths}
            >
                {Cell}
            </Grid>
        </div>
    );
};

export default ReactableTable;
