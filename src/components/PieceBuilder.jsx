import { useState, useRef } from 'react'

const GRID_SIZE = 5

function PieceBuilder({ currentPiece, setCurrentPiece, currentColor, pieceCount, onAddPiece }) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartPos, setDragStartPos] = useState(null)
  const [mouseDownTime, setMouseDownTime] = useState(null)
  const [hasMoved, setHasMoved] = useState(false)
  const containerRef = useRef(null)

  const isAdjacent = (x, y, pieces) => {
    if (pieces.length === 0) return true
    
    for (const [px, py] of pieces) {
      if ((Math.abs(px - x) === 1 && py === y) || 
          (Math.abs(py - y) === 1 && px === x)) {
        return true
      }
    }
    return false
  }

  const canSelect = (x, y) => {
    const exists = currentPiece.some(([px, py]) => px === x && py === y)
    if (exists) return true
    
    if (currentPiece.length >= pieceCount) return false
    
    return isAdjacent(x, y, currentPiece)
  }

  const handleCellClick = (x, y) => {
    const exists = currentPiece.some(([px, py]) => px === x && py === y)
    
    if (exists) {
      const newPieces = currentPiece.filter(([px, py]) => !(px === x && py === y))
      if (isConnected(newPieces)) {
        setCurrentPiece(newPieces)
      } else {
        setCurrentPiece([[x, y]])
      }
    } else if (canSelect(x, y)) {
      setCurrentPiece([...currentPiece, [x, y]])
    }
  }

  const isConnected = (pieces) => {
    if (pieces.length <= 1) return true
    
    const visited = new Set()
    const queue = [pieces[0]]
    visited.add(`${pieces[0][0]},${pieces[0][1]}`)
    
    while (queue.length > 0) {
      const [cx, cy] = queue.shift()
      
      for (const [px, py] of pieces) {
        const key = `${px},${py}`
        if (visited.has(key)) continue
        
        if ((Math.abs(px - cx) === 1 && py === cy) || 
            (Math.abs(py - cy) === 1 && px === cx)) {
          visited.add(key)
          queue.push([px, py])
        }
      }
    }
    
    return visited.size === pieces.length
  }

  const handleMouseDown = (e, x, y) => {
    e.preventDefault()
    setMouseDownTime(Date.now())
    setDragStartPos({ x, y, clientX: e.clientX, clientY: e.clientY })
    setHasMoved(false)
  }

  const handleMouseMove = (e, x, y) => {
    if (!dragStartPos || !mouseDownTime) return
    
    const dx = e.clientX - dragStartPos.clientX
    const dy = e.clientY - dragStartPos.clientY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance > 5) {
      setHasMoved(true)
      setIsDragging(true)
      
      if (canSelect(x, y)) {
        const exists = currentPiece.some(([px, py]) => px === x && py === y)
        if (!exists) {
          setCurrentPiece([...currentPiece, [x, y]])
        }
      }
    }
  }

  const handleMouseUp = (x, y) => {
    if (mouseDownTime && !hasMoved) {
      const clickDuration = Date.now() - mouseDownTime
      if (clickDuration < 300) {
        handleCellClick(x, y)
      }
    }
    
    setMouseDownTime(null)
    setDragStartPos(null)
    setHasMoved(false)
    setIsDragging(false)
  }

  const handleDragStart = (e) => {
    if (currentPiece.length === 0) {
      e.preventDefault()
      return
    }

    const piece = {
      shape: currentPiece,
      color: currentColor,
    }
    
    e.dataTransfer.setData('application/json', JSON.stringify(piece))
    e.dataTransfer.effectAllowed = 'move'
  }

  const clearPiece = () => {
    setCurrentPiece([])
  }

  const remainingBlocks = pieceCount - currentPiece.length

  return (
    <div className="flex-1 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">拼图组装 / Piece Builder</h2>
        <button
          onClick={clearPiece}
          className="px-3 py-1 bg-dark-400 hover:bg-dark-500 text-gray-300 rounded text-sm transition-colors"
        >
          清除 / Clear
        </button>
      </div>

      <div className="mb-3 text-sm text-gray-400">
        已选择 / Selected: {currentPiece.length} / {pieceCount}
        {remainingBlocks > 0 && <span className="ml-2 text-yellow-400">(还需选择 {remainingBlocks} 个)</span>}
      </div>

      <div
        ref={containerRef}
        className="relative inline-block cursor-grab active:cursor-grabbing select-none"
        draggable={currentPiece.length > 0 && !isDragging}
        onDragStart={handleDragStart}
      >
        <div className="grid gap-0.5 bg-dark-400 p-1 rounded-lg">
          {Array.from({ length: GRID_SIZE }).map((_, y) => (
            <div key={y} className="flex gap-0.5">
              {Array.from({ length: GRID_SIZE }).map((_, x) => {
                const isSelected = currentPiece.some(([px, py]) => px === x && py === y)
                const canBeSelected = canSelect(x, y)
                const isHoverable = !isSelected && canBeSelected
                
                return (
                  <div
                    key={`${x}-${y}`}
                    className={`w-10 h-10 rounded transition-all duration-150 ${
                      isSelected
                        ? 'ring-2 ring-white ring-opacity-50 transform scale-105 shadow-lg'
                        : canBeSelected
                        ? 'bg-dark-300 hover:bg-dark-400 hover:ring-1 hover:ring-gray-500'
                        : 'bg-dark-300 opacity-50'
                    }`}
                    style={isSelected ? { 
                      backgroundColor: currentColor,
                      boxShadow: `0 4px 6px -1px ${currentColor}40, 0 2px 4px -1px ${currentColor}30`
                    } : {}}
                    onMouseDown={(e) => handleMouseDown(e, x, y)}
                    onMouseMove={(e) => handleMouseMove(e, x, y)}
                    onMouseUp={() => handleMouseUp(x, y)}
                    onMouseLeave={() => {
                      if (isDragging) {
                        setMouseDownTime(null)
                        setDragStartPos(null)
                        setHasMoved(false)
                        setIsDragging(false)
                      }
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {currentPiece.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg animate-pulse">
              ✓
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-dark-300 rounded-lg text-xs text-gray-400">
        <p className="mb-1 font-semibold text-gray-300">💡 选择规则 / Selection Rules:</p>
        <p>• 点击选择/取消方块 / Click to select/deselect</p>
        <p>• 方块必须相邻连接 / Blocks must be adjacent</p>
        <p>• 不允许对角连接 / Diagonal not allowed</p>
        <p>• 拖拽到画布放置 / Drag to canvas to place</p>
      </div>
    </div>
  )
}

export default PieceBuilder
