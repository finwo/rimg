Raw image editor
================

Basic library to draw on a canvas represented by a Uint8ClampedArray.

For those wondering, you pronounce the name like "rim itch". Nothing was
originally implied, but make of the name what you will.

Usage
-----

```ts
import { RIMG } from '@finwo/rimg';

// Build a new RIMG
const myImage = new RIMG(null, { width: 400, height: 240 });

// Or in the browser, you can copy a canvas' data
const myImage = new RIMG(HTMLCanvasElement);

// You can then draw multipath polygons on the virtual buffer
// Each path will toggle the "inside" of the polygon

// To draw a hollow square in the center of the canvas:
myImage.drawPolygon([
    [ [-3,-3],
      [ 3,-3],
      [ 3, 3],
      [-3, 3],
    ],
    [ [-2,-2],
      [ 2,-2],
      [ 2, 2],
      [-2, 2],
    ],
], {
  fill: '#000000',
  scale: 25,
  rotation: Math.PI / 4, // 45 degree offset
  position: [200,120],
});

// Or, to manipulate pixels yourself, you can access them on the imageData property

const x     = 200;
const y     = 120;
const index = ((myImage.width * y) + x) * 4;

myImage.imageData[index + 0] = 255; // red
myImage.imageData[index + 1] = 255; // green
myImage.imageData[index + 2] = 255; // blue
myImage.imageData[index + 3] = 255; // alpha
```

TODO
----

- Alpha blending during drawing of polygons
- Alternate channel support (not just rgba)
