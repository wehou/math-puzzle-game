import { COLORS } from '../utils/colors'

function Toolbar({ currentColor, pieceCount, setPieceCount, usedColors, onClear }) {
  return (
    <div className="toolbar-container">
      <div className="flex items-center gap-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-2" style={{ width: '70%' }}>
          <span className="text-xs font-medium text-dark-text-tertiary flex-shrink-0">
            颜色:
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
                  title={`${color.name}${isUsed ? ' (已使用)' : ''}`}
                />
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end" style={{ width: '30%' }}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-dark-text-tertiary whitespace-nowrap">
              方块: {pieceCount}
            </span>
            <input
              type="range"
              min="1"
              max="25"
              value={pieceCount}
              onChange={(e) => setPieceCount(parseInt(e.target.value))}
              className="w-20 h-1 bg-dark-elevated rounded-full appearance-none cursor-pointer accent-apple-blue"
            />
          </div>

          <button
            onClick={onClear}
            className="px-3 py-1 text-xs font-medium text-white bg-apple-red rounded-lg hover:opacity-90 transition-opacity flex-shrink-0"
          >
            清空
          </button>

          <div className="text-xs text-dark-text-quaternary flex-shrink-0 hidden xl:block">
            <span className="px-2 py-1 bg-dark-elevated rounded whitespace-nowrap">
              单击选择 | 双击旋转 | 长按删除
            </span>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-dark-text-quaternary text-center mt-1 xl:hidden">
        <span className="px-2 py-1 bg-dark-elevated rounded">
          触摸绘制 | 双击旋转 | 长按删除
        </span>
      </div>
    </div>
  )
}

export default Toolbar
