import {
  Light,
  CompiledComponentPin,
  IHavePosition
} from '../types';

export type Pin = {
  x : number,
  y : number,
  dx : number,
  dy : number
};

export type PinLayout = {
  width : number,
  height : number,
  inputs : CompiledComponentPin[],
  outputs : CompiledComponentPin[]
}

export default function layoutPins(
  sources : Pin[],
  drains : Pin[],
  displayCount : number = 0)
  : PinLayout {
  const sourcesUps = sources.filter(toDown);
  const sourcesLefts = sources.filter(toRight);
  const sourcesRights = sources.filter(toLeft);
  const sourcesDowns = sources.filter(toUp);

  const drainsUps = drains.filter(toUp);
  const drainsLefts = drains.filter(toLeft);
  const drainsRights = drains.filter(toRight);
  const drainsDowns = drains.filter(toDown);

  const ups = [...sourcesUps, ...drainsUps].sort(byX);
  const lefts = [...sourcesLefts, ...drainsLefts].sort(byY);
  const rights = [...sourcesRights, ...drainsRights].sort(byY);
  const downs = [...sourcesDowns, ...drainsDowns].sort(byX);

  const width = Math.max(3, ups.length*2 + 1, downs.length*2 + 1, displayCount*3 + 2);
  const height = Math.max(3, lefts.length*2 + 1, rights.length*2 + 1, displayCount > 0 ? 7 : 0);

  const inputs = sources
  .map(pin => ({
    ...getPos(pin),
    dx: pin.dx,
    dy: pin.dy,
  }));

  const outputs = drains
  .map(pin => ({
    ...getPos(pin),
    dx: pin.dx,
    dy: pin.dy,
  }));

  return {
    width,
    height,
    inputs,
    outputs
  };

  function getPos(pin : Pin) : IHavePosition {
    let index = ups.indexOf(pin);
    if(index >= 0){
      return {
        x: ((width-1)>>1) - ups.length + index*2 + 1,
        y: 0
      };
    }
    index = downs.indexOf(pin);
    if(index >= 0){
      return {
        x: ((width-1)>>1) - downs.length + index*2 + 1,
        y: height - 1
      };
    }
    index = lefts.indexOf(pin);
    if(index >= 0){
      return {
        x: 0,
        y: ((height-1)>>1) - lefts.length + index*2 + 1
      };
    }
    index = rights.indexOf(pin);
    if(index >= 0){
      return {
        x: width - 1,
        y: ((height-1)>>1) - rights.length + index*2 + 1
      };
    }

    return {
      x: 0,
      y: 0
    };
  }
}

function toLeft({dx, dy} : Pin){
  return dx === -1 && dy === 0;
}
function toRight({dx, dy} : Pin){
  return dx === 1 && dy === 0;
}
function toUp({dx, dy} : Pin){
  return dx === 0 && dy === -1;
}
function toDown({dx, dy} : Pin){
  return dx === 0 && dy === 1;
}

function byX(a : Pin, b : Pin){
  return a.x - b.x;
}
function byY(a : Pin, b : Pin){
  return a.y - b.y;
}