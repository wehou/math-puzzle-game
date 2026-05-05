import { useState, useCallback, useMemo, useEffect } from 'react'
import GameCanvas from './components/GameCanvas'
import Toolbar from './components/Toolbar'
import StatusBar from './components/StatusBar'
import CelebrationDialog from './components/CelebrationDialog'
import { COLORS } from './utils/colors'
import { checkAllCombinationsComplete, countUniqueShapes } from './utils/shapes'

function App() {
  const [pieces, setPieces] = useState([])
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [pieceCount, setPieceCount] = useState(4)
  const [colorIndex, setColorIndex] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [completedBlockCount, setCompletedBlockCount] = useState(null)

  const usedColors = useMemo(() => {
    const colors = new Set()
    pieces.forEach(piece => colors.add(piece.color))
    return colors
  }, [pieces])

  const shapeStats = useMemo(() => {
    return countUniqueShapes(pieces)
  }, [pieces])

  useEffect(() => {
    const counts = new Set(pieces.map(p => p.shape.length))
    
    for (const count of counts) {
      if (checkAllCombinationsComplete(pieces, count)) {
        setCompletedBlockCount(count)
        setShowCelebration(true)
        break
      }
    }
  }, [pieces])

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
    setPieces(prev => prev.map(p => {
      if (p.id === pieceId) {
        const newX = Math.max(0, Math.min(19, p.x + dx))
        const newY = Math.max(0, Math.min(29, p.y + dy))
        return { ...p, x: newX, y: newY }
      }
      return p
    }))
  }, [])

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
          />
        </div>
        <div className="h-32 lg:h-full lg:w-64 border-t lg:border-t-0 lg:border-l border-dark-separator flex-shrink-0 overflow-hidden">
          <StatusBar pieces={pieces} shapeStats={shapeStats} />
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
