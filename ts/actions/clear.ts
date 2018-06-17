import * as ennea from 'ennea-tree';
import { deallocate } from 'buddy-tree';

import {
  GATE,
  BUTTON,
  COMPONENT} from '../constants';

import {floodClear} from '../flooding/floodFill';

import { Forest, Item } from '../types';


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
    case COMPONENT:
      return box.data.net
    default:
      return -1;
  }
}