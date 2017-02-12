import { Pos, BoxContext } from 'ennea-tree';

import {
  Context
} from './types';

import {
  Drain
} from '../types';

export default function drain(oldDrain : Drain, pos : Pos, ctx : Context, queue : BoxContext<Context>[]) : Drain{
  if(oldDrain.net === ctx.net){
    return oldDrain;
  }

  if(ctx.pos.left - ctx.prev.left !== oldDrain.dx
  || ctx.pos.top - ctx.prev.top !== oldDrain.dy){
    return oldDrain;
  }

  return {
    ...oldDrain,
    net: ctx.net
  };
}
