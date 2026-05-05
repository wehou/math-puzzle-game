import { useState, useEffect } from 'react'
import { COLORS } from '../utils/colors'

const MAX_PIECE_COUNT = 200

function Toolbar({ currentColor, pieceCount, setPieceCount, usedColors, onClear, selectedPiece, onDelete, onChangeColor, onArrange }) {
  const [inputValue, setInputValue] = useState(pieceCount.toString())
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    setInputValue(pieceCount.toString())
  }, [pieceCount])

  const handleColorClick = (colorValue) => {
    if (selectedPiece) {
      onChangeColor(selectedPiece, colorValue)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    
    const numValue = parseInt(value)
    if (!isNaN(numValue)) {
      if (numValue > MAX_PIECE_COUNT) {
        setPieceCount(MAX_PIECE_COUNT)
        setInputValue(MAX_PIECE_COUNT.toString())
        setShowWarning(true)
        setTimeout(() => setShowWarning(false), 2000)
      } else if (numValue >= 1) {
        setPieceCount(numValue)
        setShowWarning(false)
      }
    }
  }

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value)
    setPieceCount(value)
    setInputValue(value.toString())
    if (value < MAX_PIECE_COUNT) {
      setShowWarning(false)
    }
  }

  const isAtMax = pieceCount === MAX_PIECE_COUNT

  return (
    <div className="toolbar-container">
      <div className="flex items-center gap-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-2" style={{ width: '70%' }}>
          <span className="text-xs font-medium text-dark-text-tertiary flex-shrink-0">
            {selectedPiece ? '改色:' : '颜色:'}
          </span>
          <div className="flex gap-0.5 overflow-x-auto flex-1">
            {COLORS.map((color) => {
              const isUsed = usedColors.has(color.value)
              const isCurrent = currentColor === color.value
              return (
                <button
                  key={color.value}
                  className={`w-5 h-5 rounded transition-all duration-200 flex-shrink-0 ${
                    isCurrent ? 'ring-1 ring-white scale-110' : 'hover:scale-105'
                  } ${isUsed && !isCurrent ? 'opacity-40' : ''}`}
                  style={{ backgroundColor: color.value }}
                  title={`${color.name}${isUsed ? ' (已使用)' : ''}${selectedPiece ? ' - 点击更改颜色' : ''}`}
                  onClick={() => handleColorClick(color.value)}
                />
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3 justify-end" style={{ width: '30%' }}>
          <div className="flex items-center gap-1.5 lg:gap-2">
            <span className="text-xs font-medium text-dark-text-tertiary whitespace-nowrap">
              方块:
            </span>
            <input
              type="number"
              min="1"
              max={MAX_PIECE_COUNT}
              value={inputValue}
              onChange={handleInputChange}
              className={`w-10 lg:w-12 h-6 text-xs text-center bg-dark-elevated rounded border transition-all duration-200 ${
                isAtMax 
                  ? 'border-apple-orange text-apple-orange font-medium' 
                  : 'border-dark-separator text-dark-text-primary focus:border-apple-blue focus:outline-none'
              } ${showWarning ? 'animate-pulse' : ''}`}
            />
            <input
              type="range"
              min="1"
              max={MAX_PIECE_COUNT}
              value={pieceCount}
              onChange={handleSliderChange}
              className={`w-12 lg:w-16 h-1 rounded-full appearance-none cursor-pointer ${
                isAtMax ? 'accent-apple-orange' : 'accent-apple-blue bg-dark-elevated'
              }`}
            />
            {isAtMax && (
              <span className="text-xs text-apple-orange font-medium hidden lg:inline">
                MAX
              </span>
            )}
          </div>

          <button
            onClick={onArrange}
            className="px-2 lg:px-3 py-1 text-xs font-medium text-white bg-apple-green rounded-lg hover:opacity-90 transition-opacity flex-shrink-0"
            title="自动整理画布上的图形"
          >
            整理
          </button>

          <button
            onClick={() => selectedPiece && onDelete(selectedPiece)}
            disabled={!selectedPiece}
            className={`px-2 lg:px-3 py-1 text-xs font-medium rounded-lg transition-opacity flex-shrink-0 ${
              selectedPiece 
                ? 'text-white bg-apple-orange hover:opacity-90' 
                : 'text-dark-text-quaternary bg-dark-elevated cursor-not-allowed'
            }`}
            title={selectedPiece ? '删除选中的图形' : '请先选中图形'}
          >
            删除
          </button>

          <button
            onClick={onClear}
            className="px-2 lg:px-3 py-1 text-xs font-medium text-white bg-apple-red rounded-lg hover:opacity-90 transition-opacity flex-shrink-0"
          >
            清空
          </button>

          <div className="text-xs text-dark-text-quaternary flex-shrink-0 hidden xl:block">
            <span className="px-2 py-1 bg-dark-elevated rounded whitespace-nowrap">
              单击选择 | 双击旋转
            </span>
          </div>
        </div>
      </div>
      
      {showWarning && (
        <div className="text-xs text-apple-orange text-center mt-1 animate-pulse">
          方块数量已达到最大值 {MAX_PIECE_COUNT}
        </div>
      )}
      
      <div className={`text-xs text-dark-text-quaternary text-center mt-1 xl:hidden ${showWarning ? 'hidden' : ''}`}>
        <span className="px-2 py-1 bg-dark-elevated rounded">
          触摸绘制 | 双击旋转 | 点击颜色改色
        </span>
      </div>
    </div>
  )
}

export default Toolbar
