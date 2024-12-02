/**
 * Best ever chalgorithm
 */
export function getEdgeCoordinates(matrixSize: number) {
  const a = matrixSize

  const coordinates = []

  for (let col = 0; col < a; col++) {
    coordinates.push([0, col])
  }

  for (let row = 1; row < a; row++) {
    coordinates.push([row, a - 1])
  }

  for (let col = a - 2; col >= 0; col--) {
    coordinates.push([a - 1, col])
  }

  for (let row = a - 2; row > 0; row--) {
    coordinates.push([row, 0])
  }

  return coordinates
}
