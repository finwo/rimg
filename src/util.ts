export function insidePolygon(polygon, x, y) {
  let crossings = 0;

  for(let p=0; p < polygon.length; p++) {
    const path = polygon[p];
    // Iterate over lines in the path
    // const path = polygon[p];
    for(let i=0; i < path.length; i++) {

      // Fetch path's points, relative to our position
      const pointA = path[i],
            pointB = path[(i + 1) % path.length];

      if ((pointA[0] < x) && (pointB[0] < x)) continue; // Both points are to the left
      if ((pointA[1] < y) && (pointB[1] < y)) continue; // Both points are below test
      if ((pointA[1] > y) && (pointB[1] > y)) continue; // Both points are above test

      // Horizontal line = NOT crossing
      if (pointA[1] == pointB[1]) {
        continue;
      }

      // Crosses point A, discard
      // It'll be checked when crossing B
      if (pointA[1] === y) continue;

      // Crosses point B, discard if surrounding points suggest not inside
      if (pointB[1] === y) {
        const pointC = path[(i+2) % path.length];
        if (pointA[1] < pointB[1] && pointC[1] < pointB[1]) continue;
        if (pointA[1] > pointB[1] && pointC[1] > pointB[1]) continue;
      }

      // Crosses somewhere, don't care where
      if ((pointA[0] >= x) && (pointB[0] >= x)) {
        crossings++;
        continue;
      }

      // Vertical line, save some computation
      if (pointA[0] == pointB[0]) {
        crossings++;
        continue;
      }

      // y     = ax + c
      // y - c = ax
      //   - c = ax - y
      const a = (pointB[1] - pointA[1]) / (pointB[0] - pointA[0]); // Slope
      const c = -((a * pointA[0]) - pointA[1]);                  // Constant

      // Plug in y to get where it'll cross the X axis
      // x = (y - c) / a
      const T = (y-c) / a;

      // Count as crossing if at x or to it's right
      if (T >= x) {
        crossings++;
        continue;
      }

      // No further operations
    }
  }

  // true  = inside
  // false = inside
  return !!(crossings % 2);
}


// Origin: https://stackoverflow.com/a/5624139
export function hexToRgba(hex: string) {
  while (hex.slice(0,1) === '#') hex = hex.slice(1);

  // Append alpha
  if (hex.length === 3) hex = hex + 'F';
  if (hex.length === 6) hex = hex + 'FF';

  // Expand shorthand form (e.g. "03FF") to full form (e.g. "0033FFFF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b, a) {
    return r + r + g + g + b + b + a + a;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
    parseInt(result[4], 16),
  ] : null;
}
