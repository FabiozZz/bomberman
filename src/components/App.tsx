import React from 'react';

interface Cell {
    row: number;
    col: number;
}

function randomInteger(min: number, max: number): number {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function generateBombs(count: number) {
    let bombArr: Cell[] = []
    for (let bombs = 1; bombs <= count; bombs++) {
        let row = randomInteger(1, 9)
        let col = randomInteger(1, 9)
        while (row === col) {
            col = randomInteger(1, 9)
        }
        bombArr.push({row, col});
    }
    return bombArr
}

function generateBoardCell(arrBombs?: Cell[]) {
    let arr: Array<Cell & { bomb: boolean, point: number; }> = [];
    for (let row = 1; row < 10; row++) {
        for (let col = 1; col < 10; col++) {
            arr.push({row, col, point: 0, bomb: false})
        }
    }
    arr.map(cell => {
        arrBombs?.forEach(bomb => {
            if (bomb.row === cell.row && bomb.col === cell.col) {
                cell.bomb = true;
            }
        })
        return cell
    }).map(cell => {
        arrBombs?.every(bomb => {
            const prevRow: Cell = {...bomb, row: bomb.row - 1}
            const nextRow: Cell = {...bomb, row: bomb.row + 1}
            const nextCol: Cell = {...bomb, col: bomb.col + 1}
            const prevCol: Cell = {...bomb, col: bomb.col - 1}
            const prevTop: Cell = {row: bomb.row - 1, col: bomb.col - 1}
            const prevBottom: Cell = {row: bomb.row - 1, col: bomb.col + 1}
            const nextTop: Cell = {row: bomb.row + 1, col: bomb.col - 1}
            const nextBottom: Cell = {row: bomb.row + 1, col: bomb.col + 1}
            if (
                (cell.row === prevRow.row && cell.col === prevRow.col) ||
                (cell.row === nextRow.row && cell.col === nextRow.col) ||
                (cell.row === nextCol.row && cell.col === nextCol.col) ||
                (cell.row === prevCol.row && cell.col === prevCol.col) ||
                (cell.row === prevTop.row && cell.col === prevTop.col) ||
                (cell.row === prevBottom.row && cell.col === prevBottom.col) ||
                (cell.row === nextTop.row && cell.col === nextTop.col) ||
                (cell.row === nextBottom.row && cell.col === nextBottom.col)
            ) {
              cell.point = cell.point + 1;
            }
            return true
        });
        return cell
    })
    return arr
}

function App() {
    const bombs = generateBombs(10);
    const generate = generateBoardCell(bombs)

    return (
        <div className={'board'}>
            {generate.map(_ => {
                return <div className={'cell'} style={{background:_.bomb?'red':'gray'}}>{_.bomb?null:_.point?_.point:null}</div>
            })}

        </div>
    );
}

export default App;
