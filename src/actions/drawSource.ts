import * as ennea from 'ennea-tree';
import { allocate } from 'buddy-tree';

import {
  Forest,
  Source
} from '../types';

import {
  SOURCE,
  GROUND
} from '../constants';

import { getSourceNeighbouringNet } from '../query/getNeighbouringNets';
import floodFill from '../flooding/floodFill';

export default function drawSource(forest : Forest, x : number, y : number, dx : number, dy : number) : Forest{
  const neighbouringNet = getSourceNeighbouringNet(forest.enneaTree, x, y, dx, dy);

  if(neighbouringNet !== GROUND){
    return forest;
  }

  const {tree : buddyTree, address : net} = allocate(forest.buddyTree);
  const data = {
    type: SOURCE,
    dx,
    dy,
    net
  };
  const box = {left:x, top:y};
  let enneaTree = ennea.set(forest.enneaTree, data, box);

  if(forest.enneaTree === enneaTree){
    return forest;
  }

  enneaTree = floodFill(enneaTree, {
    left: box.left,
    top: box.top,
    type: data.type,
    net: data.net,
    dx,
    dy
  });

  return {
    buddyTree,
    enneaTree
  };
}