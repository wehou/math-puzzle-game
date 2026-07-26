export const getAllPossibleShapes = (blockCount) => {
  const shapes = new Set()
  
  const generateShapes = (current, remaining) => {
    if (remaining === 0) {
      const normalized = normalizeShape(current)
      shapes.add(JSON.stringify(normalized))
      return
    }
    
    const candidates = new Set()
    
    for (const [x, y] of current) {
      const neighbors = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ]
      
      for (const [nx, ny] of neighbors) {
        const key = `${nx},${ny}`
        if (!current.some(([cx, cy]) => cx === nx && cy === ny)) {
          candidates.add(key)
        }
      }
    }
    
    for (const candidate of candidates) {
      const [nx, ny] = candidate.split(',').map(Number)
      generateShapes([...current, [nx, ny]], remaining - 1)
    }
  }
  
  generateShapes([[0, 0]], blockCount - 1)
  
  return Array.from(shapes).map(s => JSON.parse(s))
}

const normalizeShape = (shape) => {
  const minX = Math.min(...shape.map(([x]) => x))
  const minY = Math.min(...shape.map(([, y]) => y))
  
  const normalized = shape.map(([x, y]) => [x - minX, y - minY])
  
  normalized.sort((a, b) => {
    if (a[1] !== b[1]) return a[1] - b[1]
    return a[0] - b[0]
  })
  
  return normalized
}

export const getShapeKey = (shape) => {
  const normalized = normalizeShape(shape)
  return JSON.stringify(normalized)
}

export const countUniqueShapes = (pieces) => {
  const shapeMap = new Map()
  
  for (const piece of pieces) {
    const rotatedShapes = getAllRotations(piece.shape)
    const key = rotatedShapes[0]
    
    if (shapeMap.has(key)) {
      shapeMap.set(key, shapeMap.get(key) + 1)
    } else {
      shapeMap.set(key, 1)
    }
  }
  
  return shapeMap
}

export const countAllPieces = (pieces) => {
  const shapeMap = new Map()
  
  for (const piece of pieces) {
    const key = JSON.stringify(piece.shape)
    
    if (shapeMap.has(key)) {
      shapeMap.set(key, shapeMap.get(key) + 1)
    } else {
      shapeMap.set(key, 1)
    }
  }
  
  return shapeMap
}

const getAllRotations = (shape) => {
  const rotations = []
  let current = normalizeShape(shape)
  
  for (let i = 0; i < 4; i++) {
    rotations.push(JSON.stringify(current))
    current = normalizeShape(rotateShape(current))
  }
  
  return rotations.sort()
}

const rotateShape = (shape) => {
  return shape.map(([x, y]) => [-y, x])
}

export const checkAllCombinationsComplete = (pieces, blockCount) => {
  if (pieces.length === 0) return false
  
  const allPossible = getAllPossibleShapes(blockCount)
  const foundShapes = new Set()
  
  for (const piece of pieces) {
    if (piece.shape.length === blockCount) {
      const rotations = getAllRotations(piece.shape)
      foundShapes.add(rotations[0])
    }
  }
  
  return allPossible.every(shape => {
    const rotations = getAllRotations(shape)
    return rotations.some(r => foundShapes.has(r))
  })
}

export const getShapeIcon = (shape) => {
  const normalized = normalizeShape(shape)
  const width = Math.max(...normalized.map(([x]) => x)) + 1
  const height = Math.max(...normalized.map(([, y]) => y)) + 1
  
  return { shape: normalized, width, height }
}
