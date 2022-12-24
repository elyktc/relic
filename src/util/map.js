import * as util from "../util/util";

let matrix;
let posX;
let posY;
let originX;
let originY;
let initializing = true;
let startingSize = 7;
let miniMapSize = 9;
let los = 2;
let lastCityElapsed = 0;

const UNDISCOVERED = "u";
const YOU = "p";
const PLAIN = "f";
const FOREST = "t";
const WATER = "w";
const CITY = "c";
const CITYFREQ = 200;
const PLAINWEIGHT = 2;
const TERRAIN = [PLAIN, FOREST];

function generateMatrix(size, x, y) {
  size = Math.max(size, 1);
  matrix = initializing ? [] : matrix ?? [];
  let x2 = x ?? Math.floor(size / 2);
  let y2 = y ?? Math.floor(size / 2);
  posX = x2;
  posY = y2;
  if (initializing) {
    originX = posX;
    originY = posY;
  }
  setCellTerrain(x2, y2);
  for (let i = 1; i < size; i++) {
    let j = i % 2 == 0 ? i : -i;
    x2 += j;
    y2 += j;
    setCellTerrain(x2, y2);
  }
  matrix = setEmptyMatrixCells(true, size, x, y);
}

function trimMatrix(m, x, y, size) {
  if (!m) return m;

  size ??= miniMapSize;
  let radius = Math.floor(size / 2);
  x ??= radius;
  y ??= radius;

  let miniMatrix = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      let x2 = x - radius + r;
      let y2 = y - radius + c;
      let v = (m[x2] && m[x2][y2]) ?? UNDISCOVERED;
      miniMatrix[r] ??= [];
      miniMatrix[r][c] = v;
    }
  }
  miniMatrix[radius][radius] = YOU;
  return miniMatrix;
}

function resizeMatrix() {
  let tlos = getLOS();
  if (posX < tlos) {
    matrix.splice(0, 0, []);
    originX++;
    posX = tlos;
  }
  if (posY < tlos) {
    let height = matrixHeight();
    for (let r = 0; r < height; r++) {
      matrix[r].splice(0, 0, undefined);
    }
    originY++;
    posY = tlos;
  }
}

function cloneMatrix(m) {
  return [...m.map((r) => [...r])];
}

function setEmptyMatrixCells(setTerrain, size, x, y) {
  if (!matrix) return matrix;

  size = size ?? miniMapSize;
  x = x ?? posX;
  y = y ?? posY;
  let m = cloneMatrix(matrix);
  let maxheight = matrixHeight();
  let maxwidth = matrixWidth();
  let h = Math.min(size ?? maxheight, maxheight);
  let w = Math.min(size ?? maxwidth, maxwidth);
  let r = Math.max((x ?? 0) - Math.floor(h / 2), 0);
  let c = Math.max((y ?? 0) - Math.floor(w / 2), 0);
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      let x2 = r + i;
      let y2 = c + j;
      m[x2] ??= [];
      let terrain = setTerrain ? getCellTerrain(x2, y2) : UNDISCOVERED;
      m[x2][y2] ??= terrain;
    }
  }
  return m;
}

function setCellTerrain(x, y, terrain) {
  x ??= posX;
  y ??= posY;
  matrix ??= [];
  matrix[x] ??= [];
  matrix[x][y] ??= terrain ?? getCellTerrain(x, y);
  return terrain;
}

function getCellTerrain(x, y) {
  x ??= posX;
  y ??= posY;
  if (matrix && matrix[x] && matrix[x][y]) return matrix[x][y];

  let terrain;
  if (util.rand(CITYFREQ) == 1 && util.rand(CITYFREQ) < lastCityElapsed++) {
    terrain = CITY;
    lastCityElapsed = 0;
  } else {
    let surroundingTerrain = getSurroundingTerrain(x, y);
    let r = util.rand(surroundingTerrain.length + 1);
    if (r >= surroundingTerrain.length) {
      r = util.rand(TERRAIN.length + PLAINWEIGHT);
      terrain = r >= TERRAIN.length ? PLAIN : TERRAIN[r];
    } else {
      terrain = surroundingTerrain[r];
    }
  }

  if (initializing && (terrain == CITY || terrain == WATER)) {
    terrain = PLAIN;
  }

  return terrain;
}

function getSurroundingTerrain(x, y) {
  let surroundingTerrain = [];
  for (let x2 = x - 1; x2 <= x + 1; x2++) {
    for (let y2 = y - 1; y2 <= y + 1; y2++) {
      if (matrix[x2] && matrix[x2][y2] && matrix[x2][y2] != CITY) {
        surroundingTerrain.push(matrix[x2][y2]);
      }
    }
  }
  return surroundingTerrain;
}

function getLOS() {
  return getCellTerrain() == FOREST ? Math.floor(los / 2) : los;
}

function matrixHeight(m) {
  m ??= matrix ?? [];
  return m.length;
}

function matrixWidth(m) {
  m ??= matrix ?? [];
  let widths = m.map((r) => r.length).sort((a, b) => parseInt(a) < parseInt(b));
  return widths[0];
}

function move(p) {
  posX += p.x;
  posY += p.y;
  resizeMatrix();
  let terrain = setCellTerrain();
  if (terrain == WATER) {
    posX -= p.x;
    posY -= p.y;
    return false;
  } else {
    let tlos = getLOS();
    if (tlos > 0) {
      generateMatrix(tlos * 2 + 1, posX, posY);
    }
  }
  return true;
}

function newMap() {
  initializing = true;
  generateMatrix(startingSize);
  initializing = false;
  return miniMap();
}

function miniMap() {
  let m = setEmptyMatrixCells(false);
  return trimMatrix(m, posX, posY, miniMapSize);
}

function location() {
  return { X: posX, Y: posY, terrain: getCellTerrain() };
}

export {
  newMap,
  miniMap,
  location,
  move,
  UNDISCOVERED,
  PLAIN,
  FOREST,
  WATER,
  CITY,
};
