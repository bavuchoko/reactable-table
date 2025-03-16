import React, { useState, useRef, useEffect } from "react";
//@ts-ignore
import { VariableSizeGrid as Grid } from "react-window";
//@ts-ignore
import { useColumnWidths } from "./hook/useColumnWidths";
//@ts-ignore
import { useColumnOrder } from "./hook/useColumnOrder";


const defaultColumnWidth = 100;
const rowHeight = 35;
interface HeaderData {
    id: string;  // Unique key for each column
    title: string; // Displayed column title
}

interface ContentData {
    [key: string]: string; // Key-value pairs where the key matches header id
}

interface ReactableTableProps {
    data: {
        header: HeaderData[]; // Array of header objects
        content: ContentData[]; // Array of content objects
    };
    customStyle?: React.CSSProperties; // Optional custom styles
}
const ReactableTable: React.FC<ReactableTableProps> = ({ data, customStyle }) => {
    const { header, content } = data; // Extract header and content data from props
    const gridRef = useRef<Grid>(null);
    const { columnWidths, handleMouseDown } = useColumnWidths(data.header.length, defaultColumnWidth, gridRef);
    const { columnOrder, handleDragStart, handleDragOver, handleDrop } = useColumnOrder(data.header.length);

    const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);
    const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);


    // 화면 크기 변경을 감지하여 업데이트
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

    // 열 너비를 가져오는 함수
    const getColumnWidth = (index: number) => columnWidths[index];



    return (
        <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
            {/* 헤더 영역 */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: columnOrder.map((index) => `${columnWidths[index]}px`).join(" "),
                    // position: "sticky",
                    top: 0,
                    background: "#fff",
                    zIndex: 10
                }}
            >
                {columnOrder.map((index) => (

                    <div
                        key={index}
                        style={{ width: columnWidths[index], border: "1px solid black", position: "relative", padding: "2px 0" }}
                    >
                        <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e)}
                            onDrop={(e) => handleDrop(e, index)}
                        >
                            {header[index].title}
                            {/*{`Column ${index + 1}`}*/}
                        </div>

                        <div
                            onMouseDown={(e) => handleMouseDown(e, index)}
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
                                borderLeft:"1px solid black",
                                marginLeft:"auto",
                                width:"3px",
                                height:"100%",
                                // background:"red"
                            }}/>
                        </div>
                    </div>
                ))}
            </div>

            {/* 데이터 영역 */}
            <Grid
                ref={gridRef}
                columnCount={data.header.length}
                columnWidth={getColumnWidth}
                height={viewportHeight - rowHeight}
                rowCount={data.content.length}
                rowHeight={() => rowHeight}
                width={viewportWidth}
                itemData={columnWidths}
            >
                {({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
                    const actualColumnIndex = columnOrder[columnIndex];
                    const left = columnOrder
                        .slice(0, columnIndex)
                        .reduce((acc, cur) => acc + columnWidths[cur], 0);

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
                            {data.content[actualColumnIndex][header[actualColumnIndex].id]}
                            {/*{`R${rowIndex}, C${actualColumnIndex}`}*/}
                        </div>
                    );
                }}

            </Grid>
        </div>
    );
};

export default ReactableTable;
