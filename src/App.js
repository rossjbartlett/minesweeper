import React, { useState, useEffect } from 'react'
import './App.css'

const TEXT_COLORS = ['blue', 'green', 'red', 'purple', 'magenta', 'black']

const DIFFICULTIES = {
  easy: { name: 'Easy', size: [10, 10], numBombs: 10 },
  medium: { name: 'Medium', size: [13, 18], numBombs: 40 },
  hard: { name: 'Hard', size: [20, 24], numBombs: 99 }
}

function getAdjCoords (grid, i, j) {
  // get [x,y] coordinates that are adjacent to [i,j] that are valid objs
  const adj = [
    [i - 1, j - 1], [i - 1, j], [i - 1, j + 1],
    [i, j - 1], [i, j + 1],
    [i + 1, j - 1], [i + 1, j], [i + 1, j + 1]
  ]
  return adj.filter(coord => grid[coord[0]] && grid[coord[0]][coord[1]])
}

function createGrid ({ size, numBombs }) {
  const grid = new Array(size[0]).fill()
    .map(() => new Array(size[1]).fill({}))
  let bombs = 0
  while (bombs < numBombs) {
    const randRow = Math.floor(Math.random() * size[0])
    const randCol = Math.floor(Math.random() * size[1])
    if (!grid[randRow][randCol].isBomb) {
      grid[randRow][randCol] = { isBomb: true }
      bombs++
    }
  }
  console.log('grid', grid)
  return grid
}

function Header ({ currentDifficulty, setDifficulty, reset, time }) {
  const onChange = e => setDifficulty(DIFFICULTIES[e.target.value])
  return (
    <div id='header'>
      <select id="difficulty" name="difficulty" onChange={onChange}>
        {Object.keys(DIFFICULTIES).map(d => (
          <option value={d} key={d}>{DIFFICULTIES[d].name}</option>
        ))}
      </select>
      <div id='time'><span id='timeIcon'>⏱</span>{time}</div>
      <div id='resetBtn' onClick={reset}>↺</div>
    </div>
  )
}

function Square ({ colorClass, numAdjBombs, square, uncover, setFlagged, lose, showBombs }) {
  const { isBomb, isUncovered, isFlagged } = square
  const contextMenu = (e) => {
    e.preventDefault()
    if (!isUncovered) setFlagged(!isFlagged)
  }
  const handleClick = (e) => {
    if (isFlagged) return
    if (isBomb) {
      lose()
    } else uncover()
  }
  let content = ''
  if (showBombs && isBomb) content = '💣' // game ended
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
      {content}
    </div>
  )
}

function Grid ({ grid, updateGrid, lost, setLost }) {
  const style = {
    gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
    pointerEvents: lost ? 'none' : ''
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
    uncoverRecurse(i, j)
    updateGrid(grid)
    checkWin(grid)
  }

  function setFlagged (i, j, value) {
    grid[i][j].isFlagged = value
    updateGrid(grid)
  }

  function lose () {
    setLost(true)
  }

  function checkWin (grid) {
    const win = grid.flat().filter(sq => !sq.isBomb).every(sq => sq.isUncovered)
    if (win) {
      console.log('YOU WIN!')
      // TODO
    }
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
            lose={() => lose()}
            showBombs={lost}
          />
        ))
      ))}
    </div>
  )
}

function App () {
  const [difficulty, setDifficulty] = useState(DIFFICULTIES.easy)
  const [grid, updateGrid] = useState([[]])
  const [lost, setLost] = useState(false)

  const [time, setTime] = useState(0)

  useEffect(reset, [difficulty])// executes on mount and when size changes

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time => time + 1)
    }, 1000)
    return () => clearInterval(interval) // clearInterval on unmount
  }, [])
  // TODO pause time when reset, only start counting after first click

  function reset () {
    if (!grid[0].length || grid.flat().every(x => !x.isUncovered) || window.confirm('Are you sure you want to reset the game?')) {
      updateGrid(createGrid(difficulty))
      setLost(false)
      setTime(0)
    }
  }

  // Clear intervals after 6 sec with the timer id
  // setTimeout(() => { clearInterval(timerId); alert('Bye') }, 6000)

  return (
    <div id='app'>
      <div id='game'>
        <Header
          currentDifficulty={difficulty}
          setDifficulty={setDifficulty}
          reset={reset}
          time={time}
        />
        <Grid
        // pass a copy of the grid to avoid unwanted state changes
          grid={JSON.parse(JSON.stringify(grid))}
          updateGrid={updateGrid}
          lost={lost}
          setLost={setLost}
        />
      </div>
    </div>
  )
}

export default App
