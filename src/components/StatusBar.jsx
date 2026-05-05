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

function StatusBar({ pieces, shapeStats }) {
  const stats = Array.from(shapeStats.entries())

  return (
    <div className="status-bar-container">
      <div className="flex items-center gap-6 max-w-7xl mx-auto flex-wrap">
        <span className="text-sm font-medium text-dark-text-secondary">
          图形统计 / Shape Statistics:
        </span>
        
        {stats.length === 0 ? (
          <span className="text-sm text-dark-text-tertiary">暂无图形 / No shapes</span>
        ) : (
          <div className="flex items-center gap-4 flex-wrap">
            {stats.map(([key, count], index) => {
              const shape = JSON.parse(key)
              const piece = pieces.find(p => {
                const normalizedShape = JSON.stringify(p.shape)
                return normalizedShape === key
              })
              const color = piece?.color || '#007AFF'
              
              return (
                <div key={index} className="flex items-center gap-2 px-2 py-1 bg-dark-elevated rounded-lg">
                  <ShapeIcon shape={shape} color={color} size={20} />
                  <span className="text-sm text-dark-text-primary">
                    {shape.length}方块
                  </span>
                  <span className="text-xs text-dark-text-tertiary">
                    ×{count}
                  </span>
                </div>
              )
            })}
          </div>
        )}
        
        <div className="ml-auto text-sm text-dark-text-tertiary flex items-center gap-2">
          <span className="px-2 py-0.5 bg-dark-elevated rounded">
            总计 / Total: {pieces.length} 个
          </span>
        </div>
      </div>
    </div>
  )
}

export default StatusBar
