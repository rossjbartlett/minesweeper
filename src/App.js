import React, { useState, useEffect } from 'react'
import './App.css'

const TEXT_COLORS = ['blue', 'green', 'red', 'purple', 'magenta', 'black']

const DIFFICULTIES = {
  easy: { name: 'Easy', size: [10, 10], numBombs: 10 },
  medium: { name: 'Medium', size: [13, 18], numBombs: 40 },
  hard: { name: 'Hard', size: [20, 24], numBombs: 99 }
}

function createGrid ({ size, numBombs }) {
  const grid = new Array(size[0]).fill(false)
    .map(() => new Array(size[1]).fill(false))
  let bombs = 0
  while (bombs < numBombs) {
    const randRow = Math.floor(Math.random() * size[0])
    const randCol = Math.floor(Math.random() * size[1])
    if (!grid[randRow][randCol]) {
      grid[randRow][randCol] = true // set bomb
      bombs++
    }
  }
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
      {'header'}
    </div> // TODO reset board on difficulty change
  )
}

function Square ({ isBomb, colorClass, text, numAdjacentBombs }) {
  const [isUncovered, setUncovered] = useState(false)
  const [isFlagged, setFlagged] = useState(false)
  const contextMenu = (e) => {
    e.preventDefault()
    if (!isUncovered) setFlagged(!isFlagged)
  }
  const handleClick = (e) => {
    if (isFlagged) return
    if (isBomb) console.log('YOU LOSE') // TODO callback lose()
    setUncovered(true)
  }
  let content = ''
  if (isFlagged) content = '🚩'
  else if (isUncovered) {
    if (isBomb) content = 'b'
    else content = numAdjacentBombs > 0 ? numAdjacentBombs : ''
  }
  content = isBomb ? 'x' : numAdjacentBombs > 0 ? numAdjacentBombs : ''

  const style = { color: TEXT_COLORS[numAdjacentBombs] }

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

function Grid ({ grid }) {
  const style = { gridTemplateColumns: `repeat(${grid[0].length}, 1fr)` }
  const colors = ['c0', 'c1']

  function numAdjacentBombs (grid, i, j) {
    let num = 0
    const adj = [
      [i - 1, j - 1], [i - 1, j], [i - 1, j + 1],
      [i, j - 1], [i, j + 1],
      [i + 1, j - 1], [i + 1, j], [i + 1, j + 1]
    ]
    adj.forEach(adj => {
      if (grid[adj[0]] && grid[adj[0]][adj[1]]) num++
    })
    return num
  }

  return (
    <div id='grid' style={style}>
      {grid.map((row, i) => {
        return row.map((isBomb, j) => {
          return (<Square
            key={'' + i + j}
            colorClass={colors[(i + j) % 2]}
            text={'' + i + ',' + j}
            isBomb={isBomb}
            numAdjacentBombs={numAdjacentBombs(grid, i, j)}
          />)
        })
      }
      )}
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
        grid={grid}
      />
    </div>
  )
}

export default App
