import { Pos, BoxContext } from 'ennea-tree';

import makePos from './makePos';
import { GROUND } from '../constants';

import {
  Context
} from './types';

import {
  Source
} from '../types';

export default function source(oldSource : Source, pos : Pos, ctx : Context, queue : BoxContext<Context>[]) : Source{
  if(ctx.pos.left - ctx.prev.left === -oldSource.dx
  && ctx.pos.top - ctx.prev.top === -oldSource.dy){
    queue.push(makePos(ctx.pos, oldSource.net, oldSource.dx, oldSource.dy));
  }

  return oldSource;
}
