import React, { useState, useEffect } from 'react'
import './App.css'

const TEXT_COLORS = ['blue', 'green', 'red', 'purple', 'magenta', 'black']

const DIFFICULTIES = {
  easy: { name: 'Easy', size: [8, 10], numBombs: 10, width: '35vw', fontSize: ['2.9vw', '7vw'] },
  medium: { name: 'Medium', size: [14, 18], numBombs: 40, width: '50vw', fontSize: ['2.3vw', '4vw'] },
  hard: { name: 'Hard', size: [20, 24], numBombs: 99, width: '50vw', fontSize: ['1.7vw', '3vw'] }
}

function getAdjCoords (grid, i, j) {
  // get [x,y] coordinates that are adjacent to [i,j] that are valid objs (not out of bounds)
  const adj = [
    [i - 1, j - 1], [i - 1, j], [i - 1, j + 1],
    [i, j - 1], [i, j + 1],
    [i + 1, j - 1], [i + 1, j], [i + 1, j + 1]
  ]
  return adj.filter(coord => grid[coord[0]] && grid[coord[0]][coord[1]])
}

function createGrid (size) {
  const grid = new Array(size[0]).fill()
    .map(() => new Array(size[1]).fill({}))
  return grid
}

function addBombs (grid, { size, numBombs }, x, y) {
  // x, y are coordinates of first click
  const availableCoords = [] // a list of [i,j] coords
  for (let i = 0; i < size[0]; i++) {
    for (let j = 0; j < size[1]; j++) {
      // add coord if it's not the coord of the first click
      if (i !== x || j !== y) availableCoords.push([i, j])
    }
  }
  let bombs = 0
  while (bombs < numBombs) {
    // add a bomb at a random coord
    // remove that coord from the availableCoords to avoid duplicates
    const randIndex = Math.floor(Math.random() * availableCoords.length)
    const removedCoord = availableCoords.splice(randIndex, 1)[0]
    grid[removedCoord[0]][removedCoord[1]] = { isBomb: true }
    bombs++
  }
}

function Header ({ currentDifficulty, setDifficulty, reset, time, lost, won, numFlags }) {
  const onChange = e => setDifficulty(DIFFICULTIES[e.target.value])
  const timeStyle = { color: lost ? 'red' : won ? 'limegreen' : 'inherit' }
  return (
    <div id='header'>
      <select id="difficulty" name="difficulty" onChange={onChange}>
        {Object.keys(DIFFICULTIES).map(d => (
          <option value={d} key={d}>{DIFFICULTIES[d].name}</option>
        ))}
      </select>
      <div><span id='numFlagsIcon'>🚩</span>{currentDifficulty.numBombs - numFlags}</div>
      <div style={timeStyle}><span id='timeIcon'>⏱</span>{time}</div>
      <div id='resetBtn' onClick={reset}>↺</div>
    </div>
  )
}

function Square ({ colorClass, numAdjBombs, square, uncover, setFlagged, lost }) {
  const { isBomb, isUncovered, isFlagged } = square
  const contextMenu = (e) => {
    e.preventDefault()
    if (!isUncovered) setFlagged(!isFlagged)
  }
  const handleClick = (e) => {
    if (isFlagged) return
    uncover()
  }
  let content = ''
  if (lost && isBomb) content = '💣' // game ended
  else if (isFlagged) content = '🚩'
  else if (isUncovered) {
    if (isBomb) content = '💣'
    else content = numAdjBombs > 0 ? numAdjBombs : ''
  }
  const style = { color: TEXT_COLORS[numAdjBombs] }

  return (
    <div
      className={`square ${colorClass} ${isUncovered ? 'uncovered' : ''}`}
      onClick={handleClick}
      onContextMenu={contextMenu}
      style={style}
    >
      <div className='content'>{content}</div>
    </div>
  )
}

function Grid ({ grid, updateGrid, lost, won, gameStarted, setGameStarted, setWon, setLost, currentDifficulty, isMobile }) {
  const style = {
    gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
    pointerEvents: lost || won ? 'none' : '',
    width: isMobile ? '100vw' : currentDifficulty.width,
    fontSize: currentDifficulty.fontSize[isMobile ? 1 : 0],
    lineHeight: isMobile ? '1.5em' : '1.2em'
  }
  const colors = ['c0', 'c1']

  function numAdjBombs (i, j) {
    const adjSquares = getAdjCoords(grid, i, j).map(coord => grid[coord[0]][coord[1]])
    return adjSquares.filter(sq => sq.isBomb).length
  }

  function uncoverRecurse (i, j) {
    if (grid[i][j].isFlagged) return
    if (grid[i][j].isUncovered) return
    grid[i][j].isUncovered = true
    if (grid[i][j].isBomb || numAdjBombs(i, j) > 0) return
    getAdjCoords(grid, i, j).forEach(coord => {
      uncoverRecurse(coord[0], coord[1])
    })
  }

  function uncoverClick (i, j) {
    if (!gameStarted) {
      setGameStarted(true)
      addBombs(grid, currentDifficulty, i, j)
    }
    if (grid[i][j].isBomb) {
      setLost(true)
      return
    }
    uncoverRecurse(i, j)
    updateGrid(grid)
    if (grid.flat().filter(x => !x.isBomb).every(x => x.isUncovered)) setWon(true)
  }

  function setFlagged (i, j, value) {
    grid[i][j].isFlagged = value
    updateGrid(grid)
  }

  return (
    <div id='grid' style={style}>
      {grid.map((row, i) => (
        row.map((square, j) => (
          <Square
            square={square}
            key={'' + i + j}
            colorClass={colors[(i + j) % 2]}
            numAdjBombs={numAdjBombs(i, j)}
            uncover={() => uncoverClick(i, j)}
            setFlagged={value => setFlagged(i, j, value)}
            lost={lost}
          />
        ))
      ))}
    </div>
  )
}

function App () {
  const [difficulty, setDifficulty] = useState(DIFFICULTIES.easy)
  const [grid, updateGrid] = useState([[]])
  const [time, setTime] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [lost, setLost] = useState(false)
  const [won, setWon] = useState(false)
  const [timerId, setTimerId] = useState()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700)

  useEffect(() => {
    window.addEventListener('resize', () => setIsMobile(window.innerWidth <= 700))
  }, [])

  useEffect(reset, [difficulty])

  useEffect(() => {
    if (gameStarted) {
      setTimerId(setInterval(() => {
        setTime(time => time + 1)
      }, 1000))
    }
  }, [gameStarted])

  useEffect(() => {
    if (lost || won) clearInterval(timerId)
  }, [lost, won, timerId])

  function reset () {
    // if the game is over or hasn't started, don't ask for confirmation before resetting
    if (!grid[0].length || lost || won || grid.flat().every(x => !x.isUncovered) || window.confirm('Are you sure you want to reset the game?')) {
      updateGrid(createGrid(difficulty.size))
      setTime(0)
      clearInterval(timerId)
      setGameStarted(false)
      setLost(false)
      setWon(false)
    }
  }

  const numFlags = grid.flat().filter(x => x.isFlagged).length

  return (
    <div id='app'>
      <div id='game' className={won ? 'won' : lost ? 'lost' : ''}>
        <Header
          currentDifficulty={difficulty}
          setDifficulty={setDifficulty}
          reset={reset}
          time={time}
          lost={lost}
          won={won}
          numFlags={numFlags}
        />
        <Grid
          // pass a copy of the grid to avoid unwanted state changes
          grid={JSON.parse(JSON.stringify(grid))}
          updateGrid={updateGrid}
          lost={lost}
          won={won}
          gameStarted={gameStarted}
          setGameStarted={setGameStarted}
          setLost={setLost}
          setWon={setWon}
          currentDifficulty={difficulty}
          isMobile={isMobile}
        />
      </div>
    </div>
  )
}

export default App
