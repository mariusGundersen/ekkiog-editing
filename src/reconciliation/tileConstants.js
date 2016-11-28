export const EMPTY_TILE = tile(0, 0);
export const WIRE_TILE = tile(1, 0);
export const UNDERPASS_TILE = tile(2, 0);
export const GATE_TILE = tile(9, 4);
export const BUTTON_TILE = tile(9, 0);

export function gateTile(x, y){
  return tile(x+9, y+4);
}

export function buttonTile(x, y){
  return tile(x+9, y);
}

function tile(x, y){
  return x|(y<<8);
}