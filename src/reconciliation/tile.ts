
import {
  EMPTY_TILE,
  WIRE_TILE,
  UNDERPASS_TILE,
  GATE_TILE,
  BUTTON_TILE,
  BUTTON_OUTPUT_TILE,
  COMPONENT_TILE,
  LIGHT_TILE,
  LIGHT_INPUT_TILE,
  SEGMENT_TILE,
  tile
} from './tileConstants';

export function wire(){
  return WIRE_TILE;
}

export function underpass(){
  return UNDERPASS_TILE;
}

export function gate(x : number, y : number){
  return GATE_TILE + tile(x, y);
}

export function button(x : number, y : number){
  return BUTTON_TILE + tile(x, y);
}

export function light(x : number, y : number){
  return LIGHT_TILE + tile(x, y);
}

export function component(x : number, y : number, w : number, h : number, ports : {x : number, y : number}[]){
  if(x === 0){
    if(y === 0){
      return COMPONENT_TILE + tile(0, 0);
    }else if(y === h){
      return COMPONENT_TILE + tile(0, 3);
    }else if(ports.some(p => p.x === x && p.y === y)){
      return COMPONENT_TILE + tile(0, 1);
    }else {
      return COMPONENT_TILE + tile(0, 2);
    }
  }else if(x === w){
    if(y === 0){
      return COMPONENT_TILE + tile(3, 0);
    }else if(y === h){
      return COMPONENT_TILE + tile(3, 3);
    }else if(ports.some(p => p.x === x && p.y === y)){
      return COMPONENT_TILE + tile(3, 2);
    }else{
      return COMPONENT_TILE + tile(3, 1);
    }
  }else{
    if(y === 0){
      if(ports.some(p => p.x === x && p.y === y)){
        return COMPONENT_TILE + tile(2, 0);
      }else{
        return COMPONENT_TILE + tile(1, 0);
      }
    }else if(y === h){
      if(ports.some(p => p.x === x && p.y === y)){
        return COMPONENT_TILE + tile(1, 3);
      }else{
        return COMPONENT_TILE + tile(2, 3);
      }
    }else{
      return COMPONENT_TILE + tile(1, 1);
    }
  }
}

export function buttonOutput(dx : number, dy : number){
  if(dx === 0){
    if(dy === 1){
      return BUTTON_OUTPUT_TILE + tile(1, 0);
    }else{
      return BUTTON_OUTPUT_TILE + tile(3, 0);
    }
  }else{
    if(dx === 1){
      return BUTTON_OUTPUT_TILE + tile(0, 0);
    }else{
      return BUTTON_OUTPUT_TILE + tile(2, 0);
    }
  }
}

export function lightInput(dx : number, dy : number){
  if(dx === 0){
    if(dy === 1){
      return LIGHT_INPUT_TILE + tile(3, 0);
    }else{
      return LIGHT_INPUT_TILE + tile(1, 0);
    }
  }else{
    if(dx === 1){
      return LIGHT_INPUT_TILE + tile(2, 0);
    }else{
      return LIGHT_INPUT_TILE + tile(0, 0);
    }
  }
}

export function segments(x : number, y : number){
  return SEGMENT_TILE + tile(x, y);
}

export function segmentPos(x : number, y : number, index : number){
  switch(index){
    case 0 : return [x+1, y+0];
    case 1 : return [x+0, y+1];
    case 2 : return [x+2, y+1];
    case 3 : return [x+1, y+2];
    case 4 : return [x+0, y+3];
    case 5 : return [x+2, y+3];
    case 6 : return [x+1, y+4];
    case 7 : return [x+2, y+4];
    default: return [x+1, y+1];
  }
}