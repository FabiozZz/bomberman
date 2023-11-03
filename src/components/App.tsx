import React, {useEffect, useState} from 'react';
import flag from 'flag-svgrepo-com.svg';
interface Cell {
    row: number;
    col: number;
    point:number|null,
    bomb:boolean,
    isHide: boolean;
    flag:boolean
}

function randomInteger(min:any, max:any) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
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

    function onClick(cell:Omit<Cell,'isHide'|'bomb'|'point'|'flag'>,state:Cell[]) {
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
                    onClick(item,copyState);
                }
                arrChecks.pop()
            }while (arrChecks.length)
        }
    }
    function onContext(cell:Omit<Cell,'isHide'|'bomb'|'point'|'flag'>) {
        const findIndex = state.findIndex(_ => _.row === cell.row && _.col === cell.col);
        const copyState = [...state];
        if (findIndex >= 0) {
            const find = copyState[findIndex]
            find.flag = !find.flag
            copyState.splice(findIndex,1,find)
            setState(copyState)
        }
    }

    const renderCell = (cell:Cell) => {
        if (cell.flag) return <img src={flag} alt="flag"/>
        if (cell.isHide) return null;
        if (!cell.bomb) return cell.point || null
        return "B"
    };

    const getCellStyle = (cell:Cell) => {
        if (cell.isHide || cell.flag) return 'darkgray'
        if (cell.point === 0) return 'gray'
        if (cell.bomb) return 'red'
        return 'darkgray'
    };

    return (
        <>
        <div className={'board'}>
            {state.map((_,index) => {
                return <div key={index}
                            onClick={(e)=> {
                                e.stopPropagation()
                                if (gameOver || _.flag) return
                                const {row,col} = _
                                onClick({row,col},state)
                            }}
                            onContextMenu={(e)=>{
                                e.preventDefault()
                                const {row,col} = _
                                onContext({row,col})
                            }}
                            className={'cell'}
                            style={{
                                background:getCellStyle(_)
                }}>{renderCell(_)}</div>
            })}

        </div>
            <button onClick={()=> {
                const bombs = generateBombs(15);
                setState(generateMap(9,9,bombs))
                setGameOver(false)
            }}>new game</button>
        </>
    );
}
//
export default App;
