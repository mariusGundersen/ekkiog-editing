import * as ennea from 'ennea-tree';
import {deallocate} from 'buddy-tree';

import {
  GATE,
  BUTTON,
  GROUND
} from '../constants.js';

import floodFill from '../flooding/floodFill.js';

export default function clear(forest, x, y){
  let [enneaTree, ...cleared] = ennea.clear(forest.enneaTree, {left:x, top:y});

  enneaTree = floodFill(enneaTree, GROUND, ...cleared);

  const buddyTree = cleared.map(getNetSource)
    .filter(net => net > 1)
    .reduce(deallocate, forest.buddyTree);

  return {
    enneaTree,
    buddyTree
  };
}

function getNetSource(box){
  switch(box.data.type){
    case GATE:
    case BUTTON:
      return box.data.net;
    default:
      return -1;
  }
}