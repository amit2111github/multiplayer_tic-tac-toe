import React from 'react'
const Block = ({ row, col, text, color }) => {
  return (
    <div
      key={row + ' ' + col}
      className={row + ' ' + col}
      style={{
        width: '133px',
        height: '133px',
        left: col * 133 + 'px',
        top: row * 133 + 'px',
        border: '1px solid black',
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        fontSize: '60px',
        alignItems: 'center',
        backgroundColor: color
      }}
    >
      {text}
    </div>
  )
}
export default Block
