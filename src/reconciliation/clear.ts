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
  GROUND
} from '../constants';

import { Item, Component, MutableContext } from '../types';

export default function clear(context : MutableContext, change : ChangeClear<Item>){
  clearArea(context, change);
  switch(change.before.type){
    case WIRE:
      return;
    case GATE:
      return context.setGate(change.before.net, GROUND, GROUND);
    case UNDERPASS:
      return;
    case BUTTON:
      return context.setGate(change.before.net, GROUND, GROUND);
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
  for(const gate of component.gates){
    context.setGate(gate.net, GROUND, GROUND);
  }
}