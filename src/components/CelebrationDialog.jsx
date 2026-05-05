import { useEffect, useState } from 'react'

function CelebrationDialog({ blockCount, onClose }) {
  const [fireworks, setFireworks] = useState([])

  useEffect(() => {
    const createFirework = () => {
      const id = Date.now() + Math.random()
      const x = Math.random() * 100
      const y = Math.random() * 100
      const colors = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#AF52DE', '#FF2D55']
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      setFireworks(prev => [...prev, { id, x, y, color }])
      
      setTimeout(() => {
        setFireworks(prev => prev.filter(f => f.id !== id))
      }, 1000)
    }

    const interval = setInterval(createFirework, 200)
    const initialFireworks = Array(5).fill(null).forEach(() => createFirework())

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose} />
      
      {fireworks.map(firework => (
        <div
          key={firework.id}
          className="absolute w-4 h-4 rounded-full animate-firework"
          style={{
            left: `${firework.x}%`,
            top: `${firework.y}%`,
            backgroundColor: firework.color,
            boxShadow: `0 0 20px ${firework.color}, 0 0 40px ${firework.color}`,
          }}
        />
      ))}
      
      <div className="relative bg-dark-surface rounded-2xl p-8 max-w-md mx-4 apple-shadow-lg animate-scale-in border border-dark-separator">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            超棒宝提醒你：
          </h2>
          <p className="text-lg text-dark-text-secondary mb-2">
            你真棒！
          </p>
          <p className="text-base text-dark-text-tertiary mb-6">
            你尝试了 <span className="text-apple-blue font-semibold">{blockCount}个方块</span> 图形所有可能的组合！
          </p>
          
          <div className="flex justify-center gap-2 mb-6">
            {['🎊', '✨', '🌟', '💫', '⭐'].map((emoji, i) => (
              <span 
                key={i} 
                className="text-3xl animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>
          
          <button
            onClick={onClose}
            className="px-8 py-3 bg-apple-blue text-white rounded-xl font-medium hover:opacity-90 transition-opacity apple-shadow"
          >
            继续探索
          </button>
        </div>
      </div>
    </div>
  )
}

export default CelebrationDialog
