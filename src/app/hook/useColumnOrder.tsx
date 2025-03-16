import { useState, useRef } from "react";

export const useColumnOrder = (columnCount: number) => {
    const [columnOrder, setColumnOrder] = useState<number[]>(Array.from({ length: columnCount }, (_, index) => index));
    const dragStartIndex = useRef<number | null>(null);

    const moveColumn = (fromIndex: number, toIndex: number) => {
        setColumnOrder((prevOrder) => {
            const fromActualIndex = prevOrder.indexOf(fromIndex);
            const toActualIndex = prevOrder.indexOf(toIndex);

            if (fromActualIndex === -1 || toActualIndex === -1) return prevOrder; // 유효하지 않은 경우 무시

            const newOrder = [...prevOrder];
            const [removed] = newOrder.splice(fromActualIndex, 1);
            newOrder.splice(toActualIndex, 0, removed);
            return newOrder;
        });
    };

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
        dragStartIndex.current = index;
        event.dataTransfer.setData("text/plain", String(index));
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // drop 가능하도록 설정
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        event.preventDefault();
        if (dragStartIndex.current === null) return;

        moveColumn(dragStartIndex.current, dropIndex);
        dragStartIndex.current = null;
    };

    return { columnOrder, setColumnOrder, handleDragStart, handleDragOver, handleDrop };
};
