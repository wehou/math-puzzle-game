import { useRef, useEffect, useState } from 'react'

const GRID_SIZE = 30
const LONG_PRESS_DURATION = 600
const DOUBLE_CLICK_DURATION = 300

function GameCanvas({ 
  pieces, 
  selectedPiece, 
  setSelectedPiece, 
  onRotate, 
  onMove, 
  onDelete, 
  onAddPiece,
  onDuplicate,
  pieceCount,
  currentColor
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [cellSize, setCellSize] = useState(40)
  const [draggedPiece, setDraggedPiece] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [warning, setWarning] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawingCells, setDrawingCells] = useState([])
  const [copiedPiece, setCopiedPiece] = useState(null)
  const [dragTrail, setDragTrail] = useState([])
  
  const longPressTimerRef = useRef(null)
  const lastClickTimeRef = useRef(0)
  const lastClickPosRef = useRef({ x: -1, y: -1 })
  const isLongPressTriggeredRef = useRef(false)
  const touchStartTimeRef = useRef(0)
  const lastTouchTimeRef = useRef(0)
  const lastTouchPosRef = useRef({ x: -1, y: -1 })

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return
      
      const container = containerRef.current
      const maxWidth = container.clientWidth - 16
      const maxHeight = container.clientHeight - 16
      
      const maxCellSizeByWidth = Math.floor(maxWidth / GRID_SIZE)
      const maxCellSizeByHeight = Math.floor(maxHeight / GRID_SIZE)
      
      const newCellSize = Math.min(maxCellSizeByWidth, maxCellSizeByHeight)
      
      setCellSize(Math.max(12, newCellSize))
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    drawCanvas(ctx)
  }, [pieces, selectedPiece, warning, drawingCells, currentColor, cellSize, dragTrail])

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [warning])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedPiece) return

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        onDelete(selectedPiece)
        return
      }

      const piece = pieces.find(p => p.id === selectedPiece)
      if (!piece) return

      switch (e.key) {
        case '8':
          e.preventDefault()
          onMove(selectedPiece, 0, -1)
          break
        case '6':
          e.preventDefault()
          onMove(selectedPiece, 1, 0)
          break
        case '2':
          e.preventDefault()
          onMove(selectedPiece, 0, 1)
          break
        case '4':
          e.preventDefault()
          onMove(selectedPiece, -1, 0)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPiece, pieces, onMove, onDelete])

  const drawCanvas = (ctx) => {
    const canvasSize = GRID_SIZE * cellSize
    
    ctx.fillStyle = '#1C1C1E'
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    ctx.strokeStyle = '#38383A'
    ctx.lineWidth = 1
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cellSize, 0)
      ctx.lineTo(i * cellSize, canvasSize)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, i * cellSize)
      ctx.lineTo(canvasSize, i * cellSize)
      ctx.stroke()
    }

    if (dragTrail.length > 1) {
      ctx.strokeStyle = 'rgba(0, 122, 255, 0.3)'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(dragTrail[0].x, dragTrail[0].y)
      for (let i = 1; i < dragTrail.length; i++) {
        ctx.lineTo(dragTrail[i].x, dragTrail[i].y)
      }
      ctx.stroke()
    }

    pieces.forEach(piece => {
      const isSelected = piece.id === selectedPiece
      drawPiece(ctx, piece, isSelected)
    })

    if (drawingCells.length > 0) {
      drawingCells.forEach(([x, y], index) => {
        const cellX = x * cellSize
        const cellY = y * cellSize
        
        ctx.fillStyle = currentColor + '80'
        ctx.fillRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4)
        
        ctx.strokeStyle = currentColor
        ctx.lineWidth = 2
        ctx.strokeRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4)

        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
        ctx.font = `bold ${Math.floor(cellSize * 0.45)}px -apple-system, BlinkMacSystemFont, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(index + 1, cellX + cellSize / 2, cellY + cellSize / 2)
      })
    }
  }

  const drawPiece = (ctx, piece, isSelected) => {
    const { shape, color, x, y, rotation } = piece
    
    ctx.save()
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    
    shape.forEach(([dx, dy], index) => {
      const [rx, ry] = rotatePoint(dx, dy, rotation)
      const cellX = (x + rx) * cellSize
      const cellY = (y + ry) * cellSize

      ctx.fillStyle = color
      ctx.fillRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4)

      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.fillRect(cellX + 4, cellY + 4, cellSize - 10, 5)
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(cellX + 4, cellY + cellSize - 7, cellSize - 10, 3)

      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
      ctx.font = `bold ${Math.floor(cellSize * 0.45)}px -apple-system, BlinkMacSystemFont, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(index + 1, cellX + cellSize / 2, cellY + cellSize / 2)
    })

    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    shape.forEach(([dx, dy]) => {
      const [rx, ry] = rotatePoint(dx, dy, rotation)
      const cellX = (x + rx) * cellSize
      const cellY = (y + ry) * cellSize

      ctx.strokeStyle = isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = isSelected ? 2.5 : 1.5
      ctx.strokeRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4)
    })

    ctx.restore()
  }

  const rotatePoint = (x, y, rotation) => {
    const radians = (rotation * Math.PI) / 180
    const cos = Math.cos(radians)
    const sin = Math.sin(radians)
    return [
      Math.round(x * cos - y * sin),
      Math.round(x * sin + y * cos)
    ]
  }

  const canRotate = (piece) => {
    const newRotation = (piece.rotation + 90) % 360
    
    for (const [dx, dy] of piece.shape) {
      const [rx, ry] = rotatePoint(dx, dy, newRotation)
      const newX = piece.x + rx
      const newY = piece.y + ry
      
      if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
        return false
      }
    }
    return true
  }

  const isAdjacent = (x, y, cells) => {
    for (const [cx, cy] of cells) {
      if ((Math.abs(cx - x) === 1 && cy === y) || 
          (Math.abs(cy - y) === 1 && cx === x)) {
        return true
      }
    }
    return false
  }

  const getPieceAtPosition = (mouseX, mouseY) => {
    for (let i = pieces.length - 1; i >= 0; i--) {
      const piece = pieces[i]
      const { shape, x, y, rotation } = piece
      
      for (const [dx, dy] of shape) {
        const [rx, ry] = rotatePoint(dx, dy, rotation)
        const cellX = x + rx
        const cellY = y + ry
        
        if (mouseX === cellX && mouseY === cellY) {
          return piece
        }
      }
    }
    return null
  }

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      mouseX: Math.floor((e.clientX - rect.left) / cellSize),
      mouseY: Math.floor((e.clientY - rect.top) / cellSize),
      canvasX: e.clientX - rect.left,
      canvasY: e.clientY - rect.top
    }
  }

  const getTouchPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const touch = e.touches[0] || e.changedTouches[0]
    return {
      mouseX: Math.floor((touch.clientX - rect.left) / cellSize),
      mouseY: Math.floor((touch.clientY - rect.top) / cellSize),
      canvasX: touch.clientX - rect.left,
      canvasY: touch.clientY - rect.top
    }
  }

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  const handleMouseDown = (e) => {
    if (e.button !== 0) return
    
    const pos = getMousePos(e)
    const currentTime = Date.now()
    
    isLongPressTriggeredRef.current = false
    
    const piece = getPieceAtPosition(pos.mouseX, pos.mouseY)
    
    if (piece) {
      const isSamePos = lastClickPosRef.current.x === pos.mouseX && 
                        lastClickPosRef.current.y === pos.mouseY
      const isDoubleClick = isSamePos && 
                           (currentTime - lastClickTimeRef.current) < DOUBLE_CLICK_DURATION
      
      if (isDoubleClick) {
        clearLongPressTimer()
        lastClickTimeRef.current = 0
        lastClickPosRef.current = { x: -1, y: -1 }
        
        if (canRotate(piece)) {
          onRotate(piece.id)
          setWarning('🔄 已旋转 / Rotated')
        } else {
          setWarning('⚠️ 无法旋转：图形将超出边界')
        }
        return
      }
      
      lastClickTimeRef.current = currentTime
      lastClickPosRef.current = { x: pos.mouseX, y: pos.mouseY }
      
      longPressTimerRef.current = setTimeout(() => {
        isLongPressTriggeredRef.current = true
        onDelete(piece.id)
        setWarning('🗑️ 已删除 / Deleted')
      }, LONG_PRESS_DURATION)
      
      setSelectedPiece(piece.id)
      setDraggedPiece(piece.id)
      setDragOffset({ x: pos.mouseX - piece.x, y: pos.mouseY - piece.y })
      setDragTrail([{ x: pos.canvasX, y: pos.canvasY }])
    } else {
      if (e.shiftKey && selectedPiece) {
        const selectedP = pieces.find(p => p.id === selectedPiece)
        if (selectedP) {
          setCopiedPiece({ ...selectedP, x: pos.mouseX, y: pos.mouseY })
          return
        }
      }
      
      setSelectedPiece(null)
      setIsDrawing(true)
      setDrawingCells([[pos.mouseX, pos.mouseY]])
    }
  }

  const handleMouseMove = (e) => {
    const pos = getMousePos(e)

    if (copiedPiece) {
      setCopiedPiece({ ...copiedPiece, x: pos.mouseX, y: pos.mouseY })
      return
    }

    if (draggedPiece) {
      clearLongPressTimer()
      
      const newX = pos.mouseX - dragOffset.x
      const newY = pos.mouseY - dragOffset.y
      onMove(draggedPiece, newX - pieces.find(p => p.id === draggedPiece).x, 
             newY - pieces.find(p => p.id === draggedPiece).y)
      
      setDragTrail(prev => [...prev, { x: pos.canvasX, y: pos.canvasY }].slice(-50))
      return
    }

    if (isDrawing && drawingCells.length < pieceCount) {
      const exists = drawingCells.some(([cx, cy]) => cx === pos.mouseX && cy === pos.mouseY)
      if (!exists && isAdjacent(pos.mouseX, pos.mouseY, drawingCells)) {
        setDrawingCells([...drawingCells, [pos.mouseX, pos.mouseY]])
      }
    }
  }

  const handleMouseUp = (e) => {
    clearLongPressTimer()
    
    if (copiedPiece) {
      onDuplicate(selectedPiece, copiedPiece.x, copiedPiece.y)
      setCopiedPiece(null)
      return
    }

    if (draggedPiece) {
      setDraggedPiece(null)
      setTimeout(() => setDragTrail([]), 500)
      return
    }

    if (isDrawing && drawingCells.length === pieceCount) {
      const minX = Math.min(...drawingCells.map(([x]) => x))
      const minY = Math.min(...drawingCells.map(([, y]) => y))
      const normalizedShape = drawingCells.map(([x, y]) => [x - minX, y - minY])
      
      onAddPiece(normalizedShape, minX, minY)
    }

    setIsDrawing(false)
    setDrawingCells([])
  }

  const handleTouchStart = (e) => {
    e.preventDefault()
    const pos = getTouchPos(e)
    const currentTime = Date.now()
    
    touchStartTimeRef.current = currentTime
    isLongPressTriggeredRef.current = false
    
    const piece = getPieceAtPosition(pos.mouseX, pos.mouseY)
    
    if (piece) {
      const isSamePos = lastTouchPosRef.current.x === pos.mouseX && 
                        lastTouchPosRef.current.y === pos.mouseY
      const isDoubleTap = isSamePos && 
                         (currentTime - lastTouchTimeRef.current) < DOUBLE_CLICK_DURATION
      
      if (isDoubleTap) {
        clearLongPressTimer()
        lastTouchTimeRef.current = 0
        lastTouchPosRef.current = { x: -1, y: -1 }
        
        if (canRotate(piece)) {
          onRotate(piece.id)
          setWarning('🔄 已旋转 / Rotated')
        } else {
          setWarning('⚠️ 无法旋转：图形将超出边界')
        }
        return
      }
      
      lastTouchTimeRef.current = currentTime
      lastTouchPosRef.current = { x: pos.mouseX, y: pos.mouseY }
      
      longPressTimerRef.current = setTimeout(() => {
        isLongPressTriggeredRef.current = true
        onDelete(piece.id)
        setWarning('🗑️ 已删除 / Deleted')
      }, LONG_PRESS_DURATION)
      
      setSelectedPiece(piece.id)
      setDraggedPiece(piece.id)
      setDragOffset({ x: pos.mouseX - piece.x, y: pos.mouseY - piece.y })
      setDragTrail([{ x: pos.canvasX, y: pos.canvasY }])
    } else {
      setSelectedPiece(null)
      setIsDrawing(true)
      setDrawingCells([[pos.mouseX, pos.mouseY]])
    }
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    const pos = getTouchPos(e)

    if (draggedPiece) {
      clearLongPressTimer()
      
      const newX = pos.mouseX - dragOffset.x
      const newY = pos.mouseY - dragOffset.y
      onMove(draggedPiece, newX - pieces.find(p => p.id === draggedPiece).x, 
             newY - pieces.find(p => p.id === draggedPiece).y)
      
      setDragTrail(prev => [...prev, { x: pos.canvasX, y: pos.canvasY }].slice(-50))
      return
    }

    if (isDrawing && drawingCells.length < pieceCount) {
      const exists = drawingCells.some(([cx, cy]) => cx === pos.mouseX && cy === pos.mouseY)
      if (!exists && isAdjacent(pos.mouseX, pos.mouseY, drawingCells)) {
        setDrawingCells([...drawingCells, [pos.mouseX, pos.mouseY]])
      }
    }
  }

  const handleTouchEnd = (e) => {
    e.preventDefault()
    clearLongPressTimer()
    
    if (draggedPiece) {
      setDraggedPiece(null)
      setTimeout(() => setDragTrail([]), 500)
      return
    }

    if (isDrawing && drawingCells.length === pieceCount) {
      const minX = Math.min(...drawingCells.map(([x]) => x))
      const minY = Math.min(...drawingCells.map(([, y]) => y))
      const normalizedShape = drawingCells.map(([x, y]) => [x - minX, y - minY])
      
      onAddPiece(normalizedShape, minX, minY)
    }

    setIsDrawing(false)
    setDrawingCells([])
  }

  const canvasSize = GRID_SIZE * cellSize

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center p-2">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="border border-dark-separator rounded-xl apple-shadow-lg cursor-crosshair touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            clearLongPressTimer()
            if (isDrawing) {
              setIsDrawing(false)
              setDrawingCells([])
            }
            if (copiedPiece) {
              setCopiedPiece(null)
            }
            setDraggedPiece(null)
            setDragTrail([])
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        
        {warning && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-apple-red bg-opacity-90 text-white rounded-xl shadow-lg text-sm font-medium animate-pulse">
            {warning}
          </div>
        )}
        
        {copiedPiece && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-apple-blue bg-opacity-90 text-white rounded-xl shadow-lg text-sm font-medium">
            移动鼠标选择位置，释放鼠标放置 / Move to position, release to place
          </div>
        )}
      </div>
    </div>
  )
}

export default GameCanvas
