import React from 'react';
import './App.css';
import ReactableTable from "./app/ReactableTable";

function App() {

    const columnCount = 100;
    const rowCount = 2000;

    const headerData = Array.from({ length: columnCount }, (_, index) => ({
        id: `column_${index}`,
        title: `Column ${index + 1}`
    }));

// 2000개의 행 생성
    const contentData = Array.from({ length: rowCount }, (_, rowIndex) => {
        const row: { [key: string]: string } = {};
        headerData.forEach((col, colIndex) => {
            row[col.id] = ` ${rowIndex + 1} 행 ${colIndex + 1} 열`;
        });
        return row;
    });
    const data = { header: headerData, content: contentData };

    const customTableStyle = {
        headerStyle: {
            background: "green",
            color: "white",
        },
    };

    let vh = window.innerHeight * 0.01

    document.documentElement.style.setProperty('--vh', `${vh}px`)

    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
    })


    return (
    <div className="App">
        <div
            style={{
                width: "100%",
                height: "calc(100 * var(--vh))",
                overflow: "auto", // Ensure this allows scrolling
            }}
        >
            <ReactableTable data={data} customStyle={customTableStyle}/>
            {/*<ReactableTable />*/}
        </div>
    </div>
    );
}

export default App;
