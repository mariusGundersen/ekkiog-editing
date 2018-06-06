import * as ennea from 'ennea-tree';
import { deallocate } from 'buddy-tree';

import {
  GATE,
  BUTTON,
  COMPONENT,
  LIGHT,
  GROUND
} from '../constants';

import {floodClear} from '../flooding/floodFill';

import { Forest, Item } from '../types';

import {
  directionToDx,
  directionToDy
} from '../utils';

export default function clear(forest : Forest, x : number, y : number) : Forest {
  let {tree : enneaTree, cleared} = ennea.clear(forest.enneaTree, {left:x, top:y});

  enneaTree = floodClear(enneaTree, cleared.map(c => [c.data, c] as [Item, ennea.BoxArea]));

  const buddyTree = cleared.map(getNetSource)
    .filter(net => net > 1)
    .reduce(deallocate, forest.buddyTree);

  return {
    enneaTree,
    buddyTree
  };
}

function getNetSource(box : ennea.AreaData<Item>){
  if(box.data == null){
    return -1;
  }

  switch(box.data.type){
    case GATE:
    case BUTTON:
      return box.data.net;
    case COMPONENT:
      return box.data.nets[0]
    default:
      return -1;
  }
}