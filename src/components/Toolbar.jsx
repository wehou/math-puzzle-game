import { useState, useEffect } from 'react'
import { COLORS } from '../utils/colors'

const MAX_PIECE_COUNT_PUZZLE = 7

function Toolbar({ 
  currentColor, 
  pieceCount, 
  setPieceCount, 
  usedColors, 
  onClear, 
  selectedPiece, 
  onDelete, 
  onChangeColor, 
  onArrange, 
  isPuzzleMode, 
  setIsPuzzleMode 
}) {
  const [inputValue, setInputValue] = useState(pieceCount.toString())

  useEffect(() => {
    setInputValue(pieceCount.toString())
  }, [pieceCount])

  const handleColorClick = (colorValue) => {
    if (selectedPiece) {
      onChangeColor(selectedPiece, colorValue)
    }
  }

  const handleInputChange = (e) => {
    if (!isPuzzleMode) return
    
    const value = e.target.value
    setInputValue(value)
    
    const numValue = parseInt(value)
    if (!isNaN(numValue)) {
      if (numValue > MAX_PIECE_COUNT_PUZZLE) {
        setPieceCount(MAX_PIECE_COUNT_PUZZLE)
        setInputValue(MAX_PIECE_COUNT_PUZZLE.toString())
      } else if (numValue >= 1) {
        setPieceCount(numValue)
      }
    }
  }

  const handleSliderChange = (e) => {
    if (!isPuzzleMode) return
    const value = parseInt(e.target.value)
    setPieceCount(value)
    setInputValue(value.toString())
  }

  return (
    <div className="toolbar-container">
      <div className="flex items-center gap-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-2" style={{ width: '65%' }}>
          <div className="flex items-center bg-dark-elevated rounded-lg p-0.5 flex-shrink-0">
            <button
              onClick={() => setIsPuzzleMode(true)}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                isPuzzleMode 
                  ? 'bg-apple-blue text-white shadow-sm' 
                  : 'text-dark-text-tertiary hover:text-dark-text-secondary'
              }`}
            >
              🧩 拼图
            </button>
            <button
              onClick={() => setIsPuzzleMode(false)}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                !isPuzzleMode 
                  ? 'bg-apple-purple text-white shadow-sm' 
                  : 'text-dark-text-tertiary hover:text-dark-text-secondary'
              }`}
            >
              🎨 自由
            </button>
          </div>

          <div className={`flex items-center gap-1.5 lg:gap-2 ${!isPuzzleMode ? 'opacity-50' : ''}`}>
            <span className="text-xs font-medium text-dark-text-tertiary whitespace-nowrap">
              方块:
            </span>
            <input
              type="number"
              min="1"
              max={MAX_PIECE_COUNT_PUZZLE}
              value={inputValue}
              onChange={handleInputChange}
              disabled={!isPuzzleMode}
              className={`w-10 lg:w-12 h-6 text-xs text-center bg-dark-surface rounded border transition-all duration-200 ${
                isPuzzleMode 
                  ? 'border-dark-separator text-dark-text-primary focus:border-apple-blue focus:outline-none' 
                  : 'border-dark-elevated text-dark-text-quaternary cursor-not-allowed'
              }`}
            />
            <input
              type="range"
              min="1"
              max={MAX_PIECE_COUNT_PUZZLE}
              value={pieceCount}
              onChange={handleSliderChange}
              disabled={!isPuzzleMode}
              className={`w-12 lg:w-16 h-1 rounded-full appearance-none ${
                isPuzzleMode 
                  ? 'accent-apple-blue bg-dark-elevated cursor-pointer' 
                  : 'accent-dark-text-quaternary bg-dark-elevated cursor-not-allowed opacity-50'
              }`}
            />
          </div>
          
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

        <div className="flex items-center gap-2 lg:gap-3 justify-end" style={{ width: '35%' }}>
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

          <button
            onClick={onArrange}
            disabled={!isPuzzleMode}
            className={`px-2 lg:px-3 py-1 text-xs font-medium rounded-lg transition-opacity flex-shrink-0 ${
              isPuzzleMode 
                ? 'text-white bg-apple-green hover:opacity-90' 
                : 'text-dark-text-quaternary bg-dark-elevated cursor-not-allowed'
            }`}
            title={isPuzzleMode ? '自动整理画布上的图形' : '自由绘图模式下不可用'}
          >
            整理
          </button>

          <div className="text-xs text-dark-text-quaternary flex-shrink-0 hidden xl:block">
            <span className="px-2 py-1 bg-dark-elevated rounded whitespace-nowrap">
              单击选择 | 双击旋转
            </span>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-dark-text-quaternary text-center mt-1 xl:hidden">
        <span className="px-2 py-1 bg-dark-elevated rounded">
          {isPuzzleMode 
            ? '触摸绘制 | 双击旋转 | 点击颜色改色' 
            : '自由绘图 | 松开完成绘制'}
        </span>
      </div>
    </div>
  )
}

export default Toolbar
