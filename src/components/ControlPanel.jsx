const COLORS = [
  { name: '蓝色 / Blue', value: '#3b82f6' },
  { name: '红色 / Red', value: '#ef4444' },
  { name: '绿色 / Green', value: '#22c55e' },
  { name: '黄色 / Yellow', value: '#eab308' },
  { name: '紫色 / Purple', value: '#a855f7' },
  { name: '粉色 / Pink', value: '#ec4899' },
  { name: '青色 / Cyan', value: '#06b6d4' },
  { name: '橙色 / Orange', value: '#f97316' },
]

function ControlPanel({ currentColor, setCurrentColor, pieceCount, setPieceCount, selectedPiece }) {
  return (
    <div className="p-4 border-b border-dark-400">
      <h2 className="text-lg font-semibold mb-4 text-white">控制面板 / Control Panel</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          方块数量 / Block Count: {pieceCount}
        </label>
        <input
          type="range"
          min="1"
          max="25"
          value={pieceCount}
          onChange={(e) => setPieceCount(parseInt(e.target.value))}
          className="w-full h-2 bg-dark-400 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1</span>
          <span>25</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          颜色选择 / Color Selection
        </label>
        {selectedPiece && (
          <div className="mb-2 px-3 py-2 bg-blue-500 bg-opacity-20 border border-blue-500 rounded text-sm text-blue-300">
            ✓ 已选中图形，点击颜色可修改 / Shape selected, click color to change
          </div>
        )}
        <div className="grid grid-cols-4 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => setCurrentColor(color.value)}
              className={`w-12 h-12 rounded-lg transition-all duration-200 ${
                currentColor === color.value
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-200 scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-dark-300 rounded-lg">
        <h3 className="text-sm font-medium text-gray-300 mb-2">操作说明 / Instructions</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• 在下方网格中点击选择方块</li>
          <li>• Click grid below to select blocks</li>
          <li>• 拖拽图形到主画布</li>
          <li>• Drag shapes to main canvas</li>
          <li>• 右键旋转 / Right-click to rotate</li>
          <li>• 小键盘移动 / Numpad to move</li>
          <li>• Delete键删除 / Delete key to remove</li>
          <li>• 选中图形后点击颜色可修改</li>
          <li>• Click color to change selected shape</li>
        </ul>
      </div>
    </div>
  )
}

export default ControlPanel
