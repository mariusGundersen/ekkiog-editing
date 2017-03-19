import * as ennea from 'ennea-tree';
import {allocate} from 'buddy-tree';

import {
  BUTTON,
  RIGHTWARDS,
  GROUND
} from '../constants';

import {getButtonNeighbouringNets} from '../query/getNeighbouringNets';
import floodFill from '../flooding/floodFill';

import { Forest, Button, Direction } from '../types';

import {
  directionToDx,
  directionToDy
} from '../utils';

export default function drawButton(forest : Forest, x : number, y : number, direction : Direction = RIGHTWARDS){
  const dx = directionToDx(direction);
  const dy = directionToDy(direction);
  const neighbouringNet = getButtonNeighbouringNets(forest.enneaTree, x, y, dx, dy);

  if(neighbouringNet !== GROUND){
    return forest;
  }

  const {tree: buddyTree, address: net} = allocate(forest.buddyTree);
  const data = {
    type: BUTTON,
    net,
    direction,
    name: '',
    state: false
  };
  const box = {left:x-1, top:y-1, width:3, height:3};
  let enneaTree = ennea.set(forest.enneaTree, data, box);

  if(forest.enneaTree === enneaTree){
    return forest;
  }

  enneaTree = floodFill(enneaTree, {
    left: x + dx,
    top: y + dy,
    type: data.type,
    net: data.net,
    dx,
    dy
  });

  return {
    enneaTree,
    buddyTree
  };
}