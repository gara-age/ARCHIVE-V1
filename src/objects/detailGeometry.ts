import { BufferGeometry, Float32BufferAttribute, CubicBezierCurve3, Vector2, Vector3, LatheGeometry } from "three";
export function createLeafGeometry() {
  const positions: number[] = [], colors: number[] = [], indices: number[] = [];
  const rows = 18, columns = 6;
  for (let row = 0; row <= rows; row++) {
    const v = row / rows;
    for (let column = 0; column <= columns; column++) {
      const u = column / columns * 2 - 1;
      positions.push(u * 0.145 * Math.sin(Math.PI * v), v * 0.78, 0.09 * Math.sin(Math.PI * v) - 0.055 * u * u + v * v * 0.045);
      const vein = Math.abs(u) < 0.05 ? 1.12 : 1;
      const shade = (0.72 + 0.18 * Math.abs(u) + 0.06 * Math.sin(v * 28)) * vein;
      colors.push(0.22 * shade, 0.38 * shade, 0.12 * shade);
    }
  }
  for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
    const a = row * (columns + 1) + column, b = a + columns + 1;
    indices.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices); geometry.computeVertexNormals();
  return geometry;
}
export function leafPose(index: number) {
  return { rotation: [0.1, index * 2.4, 0.2 + index % 4 * 0.18] as [number, number, number], scale: 0.7 + index % 5 * 0.09 };
}
export function trophyHandleCurve(side: number) {
  return new CubicBezierCurve3(new Vector3(side * 0.2, 0.64, 0), new Vector3(side * 0.46, 0.7, 0), new Vector3(side * 0.43, 0.31, 0), new Vector3(side * 0.08, 0.4, 0));
}
export function createTrophyBowl() {
  return new LatheGeometry([
    [0, 0.35], [0.048, 0.35], [0.07, 0.38], [0.08, 0.4], [0.12, 0.46], [0.16, 0.55], [0.2, 0.64], [0.224, 0.69],
    [0.222, 0.7], [0.209, 0.7], [0.204, 0.69], [0.183, 0.64], [0.143, 0.55], [0.104, 0.46], [0.064, 0.4], [0.04, 0.382], [0, 0.382],
  ].map(([x, y]) => new Vector2(x, y)), 64);
}
