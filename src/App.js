import './App.css'
import React, { useState, useEffect } from 'react'
import Block from './Block'
import { io } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'
import { changeBox, drwaCheck, checkGameFinished, cleanUp } from './helper'
const App = () => {
  const [box, setBox] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ])

  const [gameStarted, setGameStarted] = useState(
    JSON.parse(window.localStorage.getItem('gameStarted') || false)
  )
  const [color, setColor] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ])
  const [startMode, setStartMode] = useState('')
  const [roomIdToJoin, setRoomIdToJoin] = useState('')
  const [socket, setSocket] = useState()
  const [myTurn, setMyturn] = useState(true)
  const [myMove, setMyMove] = useState('X')
  const [gameEnded, setGameEnded] = useState(false)
  const [roomId, setRoomId] = useState(() => {
    if (window.localStorage.getItem('roomId')) {
      return JSON.parse(window.localStorage.getItem('roomId'))
    }
    const roomId = uuidv4()
    window.localStorage.setItem('roomId', JSON.stringify(roomId))
    return roomId
  })

  const handleClick = (event) => {
    if (gameEnded) return
    if (!myTurn || !gameStarted) return
    event.preventDefault()
    const [row, col] = event.target.className.split(' ')
    if (box[row][col]) return
    setBox((oldbox) => {
      const newbox = oldbox.slice(0)
      newbox[row][col] = myMove
      return newbox
    })
    setMyturn(false)
    if (socket) {
      socket.emit('move', { row, col })
    }
    const data = checkGameFinished(myMove, box)
    if (drwaCheck(box)) {
      if (socket) socket.emit('game-ended', { type: data, gameStatus: 'draw' })
      cleanUp('draw', setGameEnded, setBox, setColor)
    }
    if (data) {
      changeBox(data, 'green', box, setColor)
      if (socket) socket.emit('game-ended', { type: data, gameStatus: 'lose' })
      cleanUp('win', setGameEnded, setBox, setColor)
    }
  }
  const handleOtherPlayerMove = (row, col) => {
    setBox((oldbox) => {
      const newBox = oldbox.slice(0)
      newBox[row][col] = myMove === 'X' ? 'O' : 'X'
      return newBox
    })
    setMyturn((val) => true)
  }

  const joinRoom = (id) => {
    const api = 'http://localhost:5000'
    const data = io(api, { query: `id=${id}` })
    setSocket(data)
  }
  useEffect(() => {
    if (socket) {
      socket.on('joined', () => {
        alert('Player 2 joined')
        setGameStarted(true)
      })
      socket.on('move', ({ row, col }) => {
        handleOtherPlayerMove(row, col)
      })
      socket.on('game-ended', ({ type, gameStatus }) => {
        changeBox(type, 'red', box, setColor)
        cleanUp(
          gameStatus === 'draw' ? gameStatus : 'lose',
          setGameEnded,
          setBox,
          setColor
        )
      })
    }
  })

  const startGame = () => {
    window.localStorage.setItem('roomId', JSON.stringify(roomIdToJoin))
    setRoomId(roomIdToJoin)
    joinRoom(roomIdToJoin)
    setMyturn(false)
    setMyMove('O')
    setGameStarted(true)
  }
  return (
    <>
      <div className='App' onClick={handleClick}>
        <>
          <Block row={0} col={0} text={box[0][0]} color={color[0][0]} />
          <Block row={0} col={1} text={box[0][1]} color={color[0][1]} />
          <Block row={0} col={2} text={box[0][2]} color={color[0][2]} />
        </>
        <>
          <Block row={1} col={0} text={box[1][0]} color={color[1][0]} />
          <Block row={1} col={1} text={box[1][1]} color={color[1][1]} />
          <Block row={1} col={2} text={box[1][2]} color={color[1][2]} />
        </>
        <>
          <Block row={2} col={0} text={box[2][0]} color={color[2][0]} />
          <Block row={2} col={1} text={box[2][1]} color={color[2][1]} />
          <Block row={2} col={2} text={box[2][2]} color={color[2][2]} />
        </>
      </div>
      {!gameStarted && (
        <>
          <div>
            {!startMode && (
              <button
                onClick={() => {
                  setStartMode('New Game')
                  joinRoom(roomId)
                }}
              >
                Start New Game
              </button>
            )}
          </div>
          {!gameStarted && startMode === 'New Game' && <h2>{roomId}</h2>}
          <div>
            {!startMode && (
              <button onClick={() => setStartMode('By Id')}>
                Join Game By Id
              </button>
            )}
          </div>
          {!gameStarted && startMode === 'By Id' && (
            <>
              <input
                type='text'
                placeholder='Enter Room Id'
                onChange={(event) => setRoomIdToJoin(event.target.value)}
              />
              <button onClick={startGame}>Join Game</button>
            </>
          )}
        </>
      )}
      {gameStarted && !gameEnded && (
        <h1>{myTurn ? 'Your Turn' : 'Other Players Turn'}</h1>
      )}
    </>
  )
}

export default App
