import * as ennea from 'ennea-tree';

import {
  Forest,
  Drain
} from '../types';

import {
  DRAIN,
  GROUND
} from '../constants';

import { getDrainNeighbouringNet } from '../query/getNeighbouringNets';

export default function drawDrain(forest : Forest, x : number, y : number, dx : number, dy : number) : Forest {
  const buddyTree = forest.buddyTree;
  const neighbouringNet = getDrainNeighbouringNet(forest.enneaTree, x, y, -dx, -dy);

  const net = neighbouringNet || GROUND;
  const data = {
    type: DRAIN,
    dx,
    dy,
    net
  };
  const box = {left:x, top:y};
  let enneaTree = ennea.set(forest.enneaTree, data, box);

  if(forest.enneaTree === enneaTree){
    return forest;
  }

  return {
    buddyTree,
    enneaTree
  };
}