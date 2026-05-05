import { getShapeIcon } from '../utils/shapes'

function ShapeIcon({ shape, color, size = 16 }) {
  const { shape: normalized, width, height } = getShapeIcon(shape)
  const cellSize = size / Math.max(width, height)

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {normalized.map(([x, y], index) => (
        <rect
          key={index}
          x={x * cellSize + 0.5}
          y={y * cellSize + 0.5}
          width={cellSize - 1}
          height={cellSize - 1}
          fill={color}
          rx={1}
        />
      ))}
    </svg>
  )
}

function StatusBar({ pieces, shapeStats, isFreeDrawMode }) {
  const stats = Array.from(shapeStats.entries())

  return (
    <div className="h-full flex flex-col lg:flex-col">
      <div className="hidden lg:block p-3 border-b border-dark-separator">
        <h3 className={`text-sm font-medium ${isFreeDrawMode ? 'text-dark-text-quaternary' : 'text-dark-text-secondary'}`}>
          {isFreeDrawMode ? '图形统计 (已禁用)' : '图形统计 / Statistics'}
        </h3>
      </div>
      
      {isFreeDrawMode ? (
        <div className="flex-1 flex items-center justify-center p-3">
          <div className="text-center">
            <div className="text-2xl mb-2">🎨</div>
            <div className="text-xs text-dark-text-quaternary">
              自由绘图模式
            </div>
            <div className="text-xs text-dark-text-quaternary mt-1">
              图形统计已禁用
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 lg:p-3">
          {stats.length === 0 ? (
            <span className="text-xs lg:text-sm text-dark-text-tertiary">暂无图形 / No shapes</span>
          ) : (
            <div className="flex flex-row lg:flex-col gap-1 lg:gap-2 overflow-x-auto lg:overflow-x-visible">
              {stats.map(([key, count], index) => {
                const shape = JSON.parse(key)
                const piece = pieces.find(p => {
                  const normalizedShape = JSON.stringify(p.shape)
                  return normalizedShape === key
                })
                const color = piece?.color || '#007AFF'
                
                return (
                  <div key={index} className="flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1 lg:py-2 bg-dark-elevated rounded-lg flex-shrink-0">
                    <ShapeIcon shape={shape} color={color} size={20} />
                    <span className="text-xs lg:text-sm text-dark-text-primary hidden lg:inline flex-1">
                      {shape.length}方块
                    </span>
                    <span className="text-xs text-dark-text-tertiary bg-dark-surface px-1.5 lg:px-2 py-0.5 rounded">
                      ×{count}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
      
      <div className="hidden lg:block p-3 border-t border-dark-separator">
        <div className="text-sm text-dark-text-tertiary flex items-center justify-between">
          <span>总计 / Total</span>
          <span className="px-2 py-0.5 bg-dark-elevated rounded font-medium text-dark-text-primary">
            {pieces.length} 个
          </span>
        </div>
      </div>
      
      <div className="lg:hidden px-2 py-1 border-t border-dark-separator flex items-center justify-between">
        <span className={`text-xs ${isFreeDrawMode ? 'text-dark-text-quaternary' : 'text-dark-text-tertiary'}`}>
          {isFreeDrawMode ? '自由绘图模式' : `总计: ${pieces.length} 个`}
        </span>
      </div>
    </div>
  )
}

export default StatusBar
