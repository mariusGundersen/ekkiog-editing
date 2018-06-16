import {
  update,
  BoxContext,
  BoxArea
} from 'ennea-tree';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  COMPONENT,
  LIGHT,
  GROUND
} from '../constants';

import makePos from './makePos';

import wire from './wire';
import gate from './gate';
import underpass from './underpass';
import button from './button';
import component from './component';
import light from './light';
import unchanged from './unchanged';

import {
  EnneaTree,
  Item
} from '../types';

import {
  Context
} from './types';

import {
  directionToDx,
  directionToDy,
  zip
} from '../utils';

export default function floodFill(enneaTree : EnneaTree, item : Item, pos : BoxArea) : EnneaTree {
  return floodFillInternal(enneaTree, false, [item, pos]);
}

export function floodClear(enenaTree : EnneaTree, floodSources : [Item, BoxArea][]){
  return floodFillInternal(enenaTree, true, ...floodSources);
}

function floodFillInternal(enneaTree : EnneaTree, isGround = false, ...floodSources : [Item, BoxArea][]) : EnneaTree {
  const queue = [...make(isGround, floodSources)];
  const updater = update(enneaTree, (old : Item, ctx : Context, pos) => {
    switch(old.type){
      case WIRE:
        return wire(old, pos, ctx, queue);
      case GATE:
        return gate(old, pos, ctx, queue);
      case UNDERPASS:
        return underpass(old, pos, ctx, queue);
      case BUTTON:
        return button(old, pos, ctx, queue);
      case COMPONENT:
        return component(old, pos, ctx, queue);
      case LIGHT:
        return light(old, pos, ctx, queue);
      default:
        return old;
    }
  }, unchanged);
  return updater.result(queue);
}

export function* make(isGround : boolean, sources: [Item, BoxArea][]) : IterableIterator<BoxContext<Context>>{
  for(const [item, pos] of sources){
    switch(item.type){
      case WIRE:
        yield makePos({top: pos.top, left: pos.left}, isGround ? GROUND : item.net, 0, 1);
        yield makePos({top: pos.top, left: pos.left}, isGround ? GROUND : item.net, 1, 0);
        yield makePos({top: pos.top, left: pos.left}, isGround ? GROUND : item.net, 0, -1);
        yield makePos({top: pos.top, left: pos.left}, isGround ? GROUND : item.net, -1, 0);
        break;
      case GATE:
        yield makePos({top: pos.top+1, left: pos.left+3}, isGround ? GROUND : item.net, 1, 0);
        break;
      case UNDERPASS:
        yield makePos({top: pos.top, left: pos.left}, isGround ? GROUND : item.net, 1, 0);
        yield makePos({top: pos.top, left: pos.left}, isGround ? GROUND : item.net, -1, 0);
        yield makePos({top: pos.top, left: pos.left}, GROUND, 0, 1);
        yield makePos({top: pos.top, left: pos.left}, GROUND, 0, -1);
        break;
      case BUTTON:
        const dx = directionToDx(item.direction);
        const dy = directionToDy(item.direction);
        yield makePos({top: pos.top + 1 + dy, left: pos.left + 1 + dx}, isGround ? GROUND : item.net, dx, dy);
        break;
      case COMPONENT:
        for(const [output, pin] of zip(item.outputs, item.package.outputs)){
          yield makePos({top: pos.top + pin.y, left: pos.left + pin.x}, isGround ? GROUND : output.net, pin.dx, pin.dy);
        }
        break;
    }
  }
}
