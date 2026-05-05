import { useState, useCallback, useMemo, useEffect } from 'react'
import GameCanvas from './components/GameCanvas'
import Toolbar from './components/Toolbar'
import StatusBar from './components/StatusBar'
import CelebrationDialog from './components/CelebrationDialog'
import { COLORS } from './utils/colors'
import { checkAllCombinationsComplete, countUniqueShapes, countAllPieces } from './utils/shapes'

const LG_BREAKPOINT = 1024

function getGridDimensions(isPuzzleMode, isDesktop) {
  if (isPuzzleMode) {
    if (isDesktop) {
      return { width: 40, height: 20 }
    } else {
      return { width: 20, height: 40 }
    }
  } else {
    if (isDesktop) {
      return { width: 50, height: 25 }
    } else {
      return { width: 25, height: 50 }
    }
  }
}

function getShapeBounds(shape) {
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity
  shape.forEach(([x, y]) => {
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)
  })
  return { minX, maxX, minY, maxY, width: maxX - minX + 1, height: maxY - minY + 1 }
}

function isShapeSymmetric(shape) {
  const bounds = getShapeBounds(shape)
  const centerX = (bounds.minX + bounds.maxX) / 2
  const centerY = (bounds.minY + bounds.maxY) / 2
  
  const hasVerticalSymmetry = shape.every(([x, y]) => {
    const mirrorX = 2 * centerX - x
    return shape.some(([sx, sy]) => Math.abs(sx - mirrorX) < 0.01 && sy === y)
  })
  
  const hasHorizontalSymmetry = shape.every(([x, y]) => {
    const mirrorY = 2 * centerY - y
    return shape.some(([sx, sy]) => sx === x && Math.abs(sy - mirrorY) < 0.01)
  })
  
  return hasVerticalSymmetry || hasHorizontalSymmetry
}

function App() {
  const [pieces, setPieces] = useState([])
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [pieceCount, setPieceCount] = useState(4)
  const [colorIndex, setColorIndex] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [completedBlockCount, setCompletedBlockCount] = useState(null)
  const [isDesktop, setIsDesktop] = useState(true)
  const [isPuzzleMode, setIsPuzzleMode] = useState(true)

  const isFreeDrawMode = !isPuzzleMode

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= LG_BREAKPOINT)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  const gridDimensions = useMemo(() => getGridDimensions(isPuzzleMode, isDesktop), [isPuzzleMode, isDesktop])

  const usedColors = useMemo(() => {
    const colors = new Set()
    pieces.forEach(piece => colors.add(piece.color))
    return colors
  }, [pieces])

  const shapeStats = useMemo(() => {
    if (isFreeDrawMode) {
      return new Map()
    }
    if (pieceCount >= 7) {
      return countAllPieces(pieces)
    }
    return countUniqueShapes(pieces)
  }, [pieces, pieceCount, isFreeDrawMode])

  useEffect(() => {
    if (isFreeDrawMode) return
    
    const counts = new Set(pieces.map(p => p.shape.length))
    
    for (const count of counts) {
      if (checkAllCombinationsComplete(pieces, count)) {
        setCompletedBlockCount(count)
        setShowCelebration(true)
        break
      }
    }
  }, [pieces, isFreeDrawMode])

  const getNextColor = useCallback(() => {
    for (let i = 0; i < COLORS.length; i++) {
      const idx = (colorIndex + i) % COLORS.length
      if (!usedColors.has(COLORS[idx].value)) {
        return COLORS[idx].value
      }
    }
    return COLORS[colorIndex % COLORS.length].value
  }, [colorIndex, usedColors])

  const addPiece = useCallback((shape, x, y) => {
    const color = getNextColor()
    const newPiece = {
      id: Date.now(),
      shape,
      color,
      x,
      y,
      rotation: 0,
    }
    setPieces(prev => [...prev, newPiece])
    setSelectedPiece(newPiece.id)
    setColorIndex(prev => (prev + 3) % COLORS.length)
  }, [getNextColor])

  const duplicatePiece = useCallback((pieceId, x, y) => {
    const piece = pieces.find(p => p.id === pieceId)
    if (!piece) return

    const color = getNextColor()
    const newPiece = {
      id: Date.now(),
      shape: piece.shape,
      color,
      x,
      y,
      rotation: piece.rotation,
    }
    setPieces(prev => [...prev, newPiece])
    setSelectedPiece(newPiece.id)
    setColorIndex(prev => (prev + 3) % COLORS.length)
  }, [pieces, getNextColor])

  const rotatePiece = useCallback((pieceId) => {
    setPieces(prev => prev.map(p => {
      if (p.id === pieceId) {
        return { ...p, rotation: (p.rotation + 90) % 360 }
      }
      return p
    }))
  }, [])

  const movePiece = useCallback((pieceId, dx, dy) => {
    const { width, height } = gridDimensions
    setPieces(prev => prev.map(p => {
      if (p.id === pieceId) {
        const newX = Math.max(0, Math.min(width - 1, p.x + dx))
        const newY = Math.max(0, Math.min(height - 1, p.y + dy))
        return { ...p, x: newX, y: newY }
      }
      return p
    }))
  }, [gridDimensions])

  const deletePiece = useCallback((pieceId) => {
    setPieces(prev => prev.filter(p => p.id !== pieceId))
    if (selectedPiece === pieceId) {
      setSelectedPiece(null)
    }
  }, [selectedPiece])

  const changePieceColor = useCallback((pieceId, newColor) => {
    setPieces(prev => prev.map(p => {
      if (p.id === pieceId) {
        return { ...p, color: newColor }
      }
      return p
    }))
  }, [])

  const currentColor = getNextColor()

  const closeCelebration = useCallback(() => {
    setShowCelebration(false)
    setCompletedBlockCount(null)
  }, [])

  const clearCanvas = useCallback(() => {
    setPieces([])
    setSelectedPiece(null)
    setColorIndex(0)
  }, [])

  const arrangePieces = useCallback(() => {
    if (pieces.length === 0 || isFreeDrawMode) return
    
    const { width, height } = gridDimensions
    
    const sortedPieces = [...pieces].sort((a, b) => b.shape.length - a.shape.length)
    
    const symmetricPieces = []
    const asymmetricPieces = []
    
    sortedPieces.forEach(piece => {
      if (isShapeSymmetric(piece.shape)) {
        symmetricPieces.push(piece)
      } else {
        asymmetricPieces.push(piece)
      }
    })
    
    const arrangedPieces = []
    let currentX = 0
    let currentY = 0
    let rowHeight = 0
    
    const placePiece = (piece) => {
      const bounds = getShapeBounds(piece.shape)
      const pieceWidth = bounds.width
      const pieceHeight = bounds.height
      
      if (currentX + pieceWidth > width) {
        currentX = 0
        currentY += rowHeight + 1
        rowHeight = 0
      }
      
      if (currentY + pieceHeight > height) {
        return null
      }
      
      const newPiece = {
        ...piece,
        x: currentX,
        y: currentY,
        rotation: 0
      }
      
      currentX += pieceWidth + 1
      rowHeight = Math.max(rowHeight, pieceHeight)
      
      return newPiece
    }
    
    let i = 0
    while (i < symmetricPieces.length) {
      const piece = symmetricPieces[i]
      const placed = placePiece(piece)
      if (placed) arrangedPieces.push(placed)
      i++
      
      if (i < symmetricPieces.length) {
        const nextPiece = symmetricPieces[i]
        const nextPlaced = placePiece(nextPiece)
        if (nextPlaced) arrangedPieces.push(nextPlaced)
        i++
      }
    }
    
    asymmetricPieces.forEach(piece => {
      const placed = placePiece(piece)
      if (placed) arrangedPieces.push(placed)
    })
    
    setPieces(arrangedPieces)
    setSelectedPiece(null)
  }, [pieces, gridDimensions, isFreeDrawMode])

  return (
    <div className="w-full h-screen bg-dark-bg flex flex-col overflow-hidden">
      <Toolbar
        currentColor={currentColor}
        pieceCount={pieceCount}
        setPieceCount={setPieceCount}
        usedColors={usedColors}
        onClear={clearCanvas}
        selectedPiece={selectedPiece}
        onDelete={deletePiece}
        onChangeColor={changePieceColor}
        onArrange={arrangePieces}
        isPuzzleMode={isPuzzleMode}
        setIsPuzzleMode={setIsPuzzleMode}
      />
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <GameCanvas
            pieces={pieces}
            selectedPiece={selectedPiece}
            setSelectedPiece={setSelectedPiece}
            onRotate={rotatePiece}
            onMove={movePiece}
            onDelete={deletePiece}
            onAddPiece={addPiece}
            onDuplicate={duplicatePiece}
            pieceCount={pieceCount}
            currentColor={currentColor}
            gridDimensions={gridDimensions}
            isPuzzleMode={isPuzzleMode}
          />
        </div>
        <div className="h-32 lg:h-full lg:w-64 border-t lg:border-t-0 lg:border-l border-dark-separator flex-shrink-0 overflow-hidden">
          <StatusBar pieces={pieces} shapeStats={shapeStats} pieceCount={pieceCount} isFreeDrawMode={isFreeDrawMode} />
        </div>
      </div>
      
      {showCelebration && (
        <CelebrationDialog 
          blockCount={completedBlockCount}
          onClose={closeCelebration}
        />
      )}
    </div>
  )
}

export default App
