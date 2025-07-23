import React from 'react';
import { Cell as CellType } from 'types';
import flag from 'flag-svgrepo-com.svg';

interface Props {
  data: CellType;
  onClick: () => void;
  onContext: () => void;
}

const getCellStyle = (cell: CellType): string => {
  if (cell.isHide || cell.flag) return 'darkgray';
  if (cell.point === 0) return 'gray';
  if (cell.bomb) return 'red';
  return 'darkgray';
};

const renderContent = (cell: CellType) => {
  if (cell.flag) return <img src={flag} alt="flag" />;
  if (cell.isHide) return null;
  if (!cell.bomb) return cell.point || null;
  return 'B';
};

const Cell: React.FC<Props> = ({ data, onClick, onContext }) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClick();
  };

  const handleContext = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onContext();
  };

  return (
    <div
      onClick={handleClick}
      onContextMenu={handleContext}
      className={'cell'}
      style={{ background: getCellStyle(data) }}
    >
      {renderContent(data)}
    </div>
  );
};

export default React.memo(Cell);
