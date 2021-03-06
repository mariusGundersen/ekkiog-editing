import { Pos, BoxContext } from 'ennea-tree';

import makePos from './makePos';

import {
  Context
} from './types';

import {
  Wire
} from '../types';

export default function wire(oldWire: Wire, pos: Pos, ctx: Context, queue: BoxContext<Context>[]) {
  if (oldWire.net === ctx.net) {
    return oldWire;
  }

  floodWire(ctx, queue);

  return {
    ...oldWire,
    net: ctx.net
  };
}

export function floodWire(ctx: Context, queue: BoxContext<Context>[]) {
  pushPosToChanges(queue, ctx, -1, 0);
  pushPosToChanges(queue, ctx, +1, 0);
  pushPosToChanges(queue, ctx, 0, -1);
  pushPosToChanges(queue, ctx, 0, +1);
}

function pushPosToChanges(queue: BoxContext<Context>[], ctx: Context, dx: number, dy: number) {
  if (ctx.pos.left + dx != ctx.prev.left || ctx.pos.top + dy != ctx.prev.top) {
    queue.push(makePos(ctx.pos, ctx.net, dx, dy));
  }
}
