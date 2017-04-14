import * as ennea from 'ennea-tree';

import {
  Forest,
  Light,
  Direction
} from '../types';

import {
  LIGHT,
  GROUND,
  RIGHTWARDS
} from '../constants';

import { getLightNeighbouringNet } from '../query/getNeighbouringNets';

import {
  directionToDx,
  directionToDy
} from '../utils';

export default function drawLight(forest : Forest, x : number, y : number, direction : Direction = RIGHTWARDS) : Forest {
  const dx = directionToDx(direction);
  const dy = directionToDy(direction);
  const buddyTree = forest.buddyTree;
  const neighbouringNet = getLightNeighbouringNet(forest.enneaTree, x, y, dx, dy);

  const net = neighbouringNet || GROUND;
  const data = {
    type: LIGHT,
    dx,
    dy,
    net,
    name: '',
    direction
  };
  const box = {left: x-1, top: y-1, width: 3, height: 3};
  let enneaTree = ennea.set(forest.enneaTree, data, box);

  if(forest.enneaTree === enneaTree){
    return forest;
  }

  return {
    buddyTree,
    enneaTree
  };
}