import { BoxArea, clear, BoxContext, get } from 'ennea-tree';
import { EnneaTree, Item, Forest } from '../types';
import { makeFloodQueue } from './make';
import { WIRE, UNDERPASS } from '../constants';
import { floodWire } from './wire';
import { floodUnderpass } from './underpass';
import { Context } from './types';

export default function floodClear({ enneaTree, buddyTree }: Forest, x: number, y: number): Forest {
  const item = get(enneaTree, y, x);

  return {
    enneaTree: floodClearInternal(clear(enneaTree, item).tree, [item.data, item]),
    buddyTree
  };
}

function floodClearInternal(enneaTree: EnneaTree, ...floodSources: [Item, BoxArea][]): EnneaTree {
  const queue = [...makeFloodQueue(false, floodSources)];

  for (const item of queue) {
    enneaTree = clearWire(enneaTree, item, queue);
  }

  return enneaTree;
}

function clearWire(oldTree: EnneaTree, item: BoxContext<Context>, queue: BoxContext<Context>[]) {
  const { tree: newTree, cleared: [c] } = clear(oldTree, item.area);

  if (!c) return newTree;

  switch (c.data.type) {
    case WIRE:
      floodWire(item.context, queue);
      return newTree;
    case UNDERPASS:
      floodUnderpass(item.context, queue);
      return newTree;
    default:
      return oldTree;
  }
}

