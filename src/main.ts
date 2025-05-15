import { hexToRgba, insidePolygon } from "./util";

(() => {

  type RimgOptions = {
    width : number;
    height: number;
  };

  type DrawOptions = {
    fill?: string;
    position?: [number,number];
    rotation?: number;
    scale?: number;
  }

  class RIMG {
    width : number;
    height: number;
    imageData: Uint8ClampedArray;

    private ctx?: CanvasRenderingContext2D;

    constructor(
      input: HTMLCanvasElement | Uint8ClampedArray | null,
      options: Partial<RimgOptions> = {}
    ) {
      this.width  = options.width || 0;
      this.height = options.height || 0;

      if ('function' === typeof HTMLCanvasElement && input instanceof HTMLCanvasElement) {
        this.ctx    = input.getContext('2d')
        const bound = input.getBoundingClientRect();
        this.width  = options.width || bound.width;
        this.height = options.height || bound.height;
        const idata = this.ctx.getImageData(0,0,this.width,this.height);
        this.imageData = idata.data;
      } else if (input instanceof Uint8ClampedArray) {
        this.imageData = input;
      } else if ('object' === typeof input && !input) {
        if (!this.width ) throw new Error("options.width required when creating a new virtual canvas");
        if (!this.height) throw new Error("options.height required when creating a new virtual canvas");
        this.imageData = new Uint8ClampedArray(this.width * this.height * 4);
      } else {
        throw new Error("Incompatible input given. Expected HTMLCanvasElement|Uint8ClampedArray|null, got ", );
      }
    }

    toImageData() {
      if (!this.ctx) throw new Error('toImageData only supported when created from canvas');
      const idata = this.ctx.createImageData(this.width, this.height);
      idata.data.set(this.imageData,0);
      return idata;
    }

    drawPolygon(polygon: [number,number][][], options: DrawOptions) {
      const fill     = hexToRgba(options && options.fill && options.fill || '#000');
      const position = options.position || [0,0];
      const rotation = options.rotation || 0;
      const scale    = options.scale    || 1;

      let minx = Infinity;
      let miny = Infinity;
      let maxx = -Infinity;
      let maxy = -Infinity;

      // Transform polygon & track bounding box
      const rs = Math.sin(rotation);
      const rc = Math.cos(rotation);
      const translated = [];
      for(const path of polygon) {
        const newPath = [];
        for(const point of path) {
          let x = ((rc*point[0]) - (rs*point[1])) * scale + position[0];
          let y = ((rs*point[0]) + (rc*point[1])) * scale + position[1];
          minx = Math.min(minx,x);
          maxx = Math.max(maxx,x);
          miny = Math.min(miny,y);
          maxy = Math.max(maxy,y);
          newPath.push([x,y]);
        }
        translated.push(newPath);
      }
      minx = Math.max(0,Math.floor(minx));
      miny = Math.max(0,Math.floor(miny));
      maxx = Math.min(maxx,this.width-1);
      maxy = Math.min(maxy,this.height-1);

      // Paint pixels
      for(let y = miny ; y <= maxy ; y++) {
        const _y = y*this.width;
        for(let x = minx ; x <= maxx ; x++) {
          if (!insidePolygon(translated, x, y)) continue;
          const idx = (_y+x)*4;
          this.imageData[idx+0] = fill[0];
          this.imageData[idx+1] = fill[1];
          this.imageData[idx+2] = fill[2];
          this.imageData[idx+3] = fill[3];
        }
      }

    }

  };

  if ('object' === typeof exports) {
    // nodejs mode
    Object.defineProperty(exports, '__esModule', { value: true });
    Object.defineProperty(exports, "default", { value: RIMG });
    Object.defineProperty(exports, "RIMG", { value: RIMG });
  } else if ('object' === typeof window) {
    // browser mode
    Object.defineProperty(window, 'RIMG', { value: RIMG });
  }
})();
