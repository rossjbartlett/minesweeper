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

function Header ({ currentDifficulty, setDifficulty }) {
  const onChange = e => setDifficulty(DIFFICULTIES[e.target.value])
  return (
    <div id='header'>
      <select id="difficulty" name="difficulty" onChange={onChange}>
        {Object.keys(DIFFICULTIES).map(d => (
          <option value={d} key={d}>{DIFFICULTIES[d].name}</option>
        ))}
      </select>
      {/* TODO show clock here */}
    </div>
    // TODO reset board on difficulty change - flags are staying up
  )
}

function Square ({ colorClass, numAdjBombs, square, uncover }) {
  const { isBomb, isUncovered } = square
  const [isFlagged, setFlagged] = useState(false)
  const [showBomb, setShowBomb] = useState(false)
  const contextMenu = (e) => {
    e.preventDefault()
    if (!isUncovered) setFlagged(!isFlagged)
  }
  const handleClick = (e) => {
    if (isFlagged) return
    if (isBomb) {
      console.log('YOU LOSE') // TODO callback lose()
      setShowBomb(true)
    } else uncover()
  }
  let content = ''
  if (showBomb) content = '💣'
  else if (isFlagged) content = '🚩'
  else if (isUncovered) {
    if (isBomb) content = 'b'
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

function Grid ({ grid, updateGrid }) {
  const style = { gridTemplateColumns: `repeat(${grid[0].length}, 1fr)` }
  const colors = ['c0', 'c1']

  function numAdjBombs (i, j) {
    const adjSquares = getAdjCoords(grid, i, j).map(coord => grid[coord[0]][coord[1]])
    return adjSquares.filter(sq => sq.isBomb).length
  }

  function uncoverRecurse (i, j) {
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
          />
        ))
      ))}
    </div>
  )
}

function App () {
  const [difficulty, setDifficulty] = useState(DIFFICULTIES.easy)
  const [grid, updateGrid] = useState([[]])

  useEffect(() => { // executes on mount and when size changes
    updateGrid(createGrid(difficulty))
  }, [difficulty])

  return (
    <div id='app'>
      <Header
        currentDifficulty={difficulty}
        setDifficulty={setDifficulty}
      />
      <Grid
        // pass a copy of the grid to avoid unwanted state changes
        grid={JSON.parse(JSON.stringify(grid))}
        updateGrid={updateGrid}
      />
    </div>
  )
}

export default App
