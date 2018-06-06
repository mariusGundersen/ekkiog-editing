import * as ennea from 'ennea-tree';
import * as buddy from 'buddy-tree';

import floodFill from '../flooding/floodFill';
import { Forest, Item, BoxArea } from '../types';

export default function insertItem(forest : Forest, buddyTree : buddy.Node, data : Item, box : BoxArea){
  let enneaTree = ennea.set(forest.enneaTree, data, box);

  if(forest.enneaTree === enneaTree){
    return forest;
  }

  enneaTree = floodFill(enneaTree, data, box);

  return {
    enneaTree,
    buddyTree
  };
}