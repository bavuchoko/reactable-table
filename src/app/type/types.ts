import React, {ChangeEvent, FC} from "react";

export interface HeaderData {
    id: string;
    title: string;
    renderEditCell?: FC<{
        value: string;
        onChange: (event: ChangeEvent<HTMLInputElement>, rowIndex: number, columnIndex: number) => void;
        rowIndex: number;
        columnIndex: number;
    }>;
}

export interface ContentData {
    [key: string]: string;
}

export interface ReactableTableProps {
    data: {
        header: HeaderData[];
        content: ContentData[];
    };
    customStyle?: {
        headerStyle?: React.CSSProperties;
        contentStyle?: React.CSSProperties;
    };
}