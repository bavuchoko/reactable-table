import React, { useState, useRef, useEffect } from "react";
//@ts-ignore
import { VariableSizeGrid as Grid } from "react-window";
//@ts-ignore
import { useColumnWidths } from "./hook/useColumnWidths";
//@ts-ignore
import { useColumnOrder } from "./hook/useColumnOrder";

const defaultColumnWidth = 100;
const rowHeight = 26;

interface HeaderData {
    id: string;  // Unique key for each column
    title: string; // Displayed column title
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

    const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);
    const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);



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
    const getColumnWidth = (index: number) => columnWidths[index];

    return (
        <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
            {/* 헤더와 데이터 영역을 하나로 통합 */}
            <Grid
                ref={gridRef}
                columnCount={data.header.length}
                columnWidth={getColumnWidth}
                height={viewportHeight}
                rowCount={data.content.length + 1}
                rowHeight={() => rowHeight}
                width={viewportWidth}
                overscanCount={20}
                itemData={columnWidths}
            >
                {({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
                    const actualColumnIndex = columnOrder[columnIndex];
                    const left = columnOrder
                        .slice(0, columnIndex)
                        .reduce((acc, cur) => acc + columnWidths[cur], 0);

                    if (rowIndex === 0) {
                        // 첫 번째 줄 (헤더 영역)
                        return (
                            <div
                                style={{
                                    left,
                                    width: columnWidths[actualColumnIndex],
                                    border: "1px solid black",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background:"white",
                                    position: "absolute",
                                    top: 0,
                                    ...customStyle?.headerStyle, // customStyle.headerStyle applied last to override other styles
                                }}
                            >
                                <div
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, columnIndex)}
                                    onDragOver={(e) => handleDragOver(e)}
                                    onDrop={(e) => handleDrop(e, columnIndex)}
                                    style={{padding: "4px"}}
                                >
                                    {header[actualColumnIndex].title}
                                </div>
                                <div
                                    onMouseDown={(e) => handleMouseDown(e,  columnIndex)}
                                    style={{
                                        width: "7px",
                                        height: "100%",
                                        cursor: "col-resize",
                                        position: "absolute",
                                        right: 0,
                                        top: 0,
                                        bottom: 0,
                                        // backgroundColor: "gray"
                                    }}
                                >
                                    <div style={{
                                        borderLeft: "1px solid black",
                                        marginLeft: "auto",
                                        width: "3px",
                                        height: "100%",
                                        // background:"red"
                                    }}/>
                                </div>
                            </div>
                        );
                    }

                    // 데이터 영역
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
                                background: rowIndex % 2 === 0 ? "#f9f9f9" : "#fff"
                            }}
                        >
                            {content[rowIndex - 1][header[actualColumnIndex].id]}
                        </div>
                    );
                }}
            </Grid>
        </div>
    );
};

export default ReactableTable;
