import React, {useEffect, useState, useCallback} from 'react';
import { Cell } from 'types';
import CellComponent from './Cell';

function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateBombs(count:any) {
    let bombArr = []
    for (let bombs = 1; bombs <= count; bombs++) {
        let row = randomInteger(1, 8)
        let col = randomInteger(1, 8)
        while (row === col) {
            col = randomInteger(1, 8)
            // row = randomInteger(1, 8)
        }
        const find = bombArr.find(_ => _.col === col && _.row === row);
        if (find){
            bombs--;
        }else{
            bombArr.push({row, col});
        }
    }
    return bombArr
}


function generateMap(cols:any,rows:any,bombs:any){
    const arr:any = [];
    for (let row=0;row<rows;row++){
        const temp = []
        for (let col=0;col<cols;col++){
            // const arrBombs = bombs.find((bomb) => bomb.row === row && bomb.col === col);
            temp.push({point:0, bomb: false, isHide: true,row,col,flag:false})
        }
        arr.push(temp)
    }

    bombs.forEach((bomb:any)=>{
        const cell = arr[bomb.row][bomb.col];
        cell.bomb = true
        cell.point = null
        const arrChecks = [
            {...bomb, row: bomb.row - 1},
            {...bomb, row: bomb.row + 1},
            {...bomb, col: bomb.col + 1},
            {...bomb, col: bomb.col - 1},
            {row: bomb.row - 1, col: bomb.col - 1},
            {row: bomb.row - 1, col: bomb.col + 1},
            {row: bomb.row + 1, col: bomb.col - 1},
            {row: bomb.row + 1, col: bomb.col + 1}
        ]
        do{
            const item = arrChecks[arrChecks.length - 1];
            if (arr[item.row] && arr[item.row][item.col]) {
                arr[item.row][item.col].point += 1;
            }
            arrChecks.pop()
        } while (arrChecks.length )

    })

    return arr.flat()
}
function App() {
    const [state,setState] = useState<Cell[]>([])
    const [gameOver,setGameOver] = useState(false)

    useEffect(() => {
        const bombs = generateBombs(15);
        setState(generateMap(9,9,bombs))
    }, []);

    const handleClick = useCallback((cell: Omit<Cell, 'isHide' | 'bomb' | 'point' | 'flag'>, state: Cell[]) => {
        const findIndex = state.findIndex(_ => _.row === cell.row && _.col === cell.col);
        const copyState = [...state];
        if (findIndex >= 0) {
            const find = copyState[findIndex]
            if (find.bomb) {
                setGameOver(true)
                setState(prevState => prevState.map(c=>({...c,isHide:false})))
                return;
            }
            if (!find.isHide) return
            find.isHide = false
            copyState.splice(findIndex,1,find)
            if (find.point) {
                setState(copyState)
                return;
            }

            const arrChecks = [
                {...cell, row: cell.row - 1},
                {...cell, row: cell.row + 1},
                {...cell, col: cell.col + 1},
                {...cell, col: cell.col - 1},
                {row: cell.row - 1, col: cell.col - 1},
                {row: cell.row - 1, col: cell.col + 1},
                {row: cell.row + 1, col: cell.col - 1},
                {row: cell.row + 1, col: cell.col + 1}
            ];
            do{
                const item = arrChecks[arrChecks.length - 1];
                if (item) {
                    handleClick(item,copyState);
                }
                arrChecks.pop()
            }while (arrChecks.length)
        }
    }, [setState, setGameOver]);

    const handleContext = useCallback((cell: Omit<Cell,'isHide'|'bomb'|'point'|'flag'>) => {
        const findIndex = state.findIndex(_ => _.row === cell.row && _.col === cell.col);
        const copyState = [...state];
        if (findIndex >= 0) {
            const find = copyState[findIndex]
            find.flag = !find.flag
            copyState.splice(findIndex,1,find)
            setState(copyState)
        }
    }, [state]);


    return (
        <>
        <div className={'board'}>
            {state.map((cell, index) => (
                <CellComponent
                    key={index}
                    data={cell}
                    onClick={() => {
                        if (gameOver || cell.flag) return;
                        const { row, col } = cell;
                        handleClick({ row, col }, state);
                    }}
                    onContext={() => {
                        const { row, col } = cell;
                        handleContext({ row, col });
                    }}
                />
            ))}

        </div>
            <button onClick={() => {
                const bombs = generateBombs(15);
                setState(generateMap(9, 9, bombs));
                setGameOver(false);
            }}>new game</button>
        </>
    );
}
export default App;
