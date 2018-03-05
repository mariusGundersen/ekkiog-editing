import { ChangeClear, Area } from 'ennea-tree';

import {
  EMPTY_TILE
} from './tileConstants';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  COMPONENT,
  GROUND,
  LIGHT
} from '../constants';

import { Item, Component, MutableContext, Button, Light } from '../types';

export default function clear(context : MutableContext, change : ChangeClear<Item>){
  clearArea(context, change);
  switch(change.before.type){
    case WIRE:
    case GATE:
    case UNDERPASS:
      return;
    case BUTTON:
    case LIGHT:
      return clearNamedItem(context, change.before);;
    case COMPONENT:
      return clearComponent(context, change.before);
  }
}

export function clearArea(context : MutableContext, {top, left, width, height} : Area){
  for(let y=top; y<top+height; y++){
    for(let x=left; x<left+width; x++){
      context.setMap(x, y, EMPTY_TILE);
      context.setNet(x, y, GROUND);
    }
  }
}

export function clearComponent(context : MutableContext, component : Component){
  context.removeText(component);
}

export function clearNamedItem(context : MutableContext, item : Button | Light){
  if(item.name){
    context.removeText(item);
  }
}