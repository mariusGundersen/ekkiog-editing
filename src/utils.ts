import {
  Direction
} from './types';

import {
  LEFTWARDS,
  RIGHTWARDS,
  UPWARDS,
  DOWNWARDS
} from './constants';

export function directionToDx(direction : Direction){
  switch(direction){
    case LEFTWARDS:
      return -1;
    case RIGHTWARDS:
      return 1;
    case DOWNWARDS:
    case UPWARDS:
    default:
      return 0;
  }
}

export function directionToDy(direction : Direction){
  switch(direction){
    case DOWNWARDS:
      return 1;
    case UPWARDS:
      return -1;
    case LEFTWARDS:
    case RIGHTWARDS:
    default:
      return 0;
  }
}

export function flatten<T>(list : T[] = [], items : T[]){
  list.push(...items);
  return list;
}