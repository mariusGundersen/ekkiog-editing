import {createTree as createEnneaTree} from 'ennea-tree';
import {createTree as createBuddyTree, allocate, Node} from 'buddy-tree';

import { Forest, TreeNode } from '../types';
export default function createForest(buddyTree = allocate(createBuddyTree(256*256), 2).tree) : Forest {
  return {
    enneaTree: createEnneaTree(128) as TreeNode,
    buddyTree
  };
}