import React, { useState } from 'react';

function randomInteger(min:number, max:number):number {
	// получить случайное число от (min-0.5) до (max+0.5)
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

interface Cell {
	row: number;
	column: number;
}

interface Bombs {
	bombs: Cell[];
}




const Cell: React.FC<Bombs & Cell> = ({ bombs }) => {
	const [ state, setState ] = useState<Bombs & Cell>();
	return (
		<div>

		</div>
	);
};

export default Cell;