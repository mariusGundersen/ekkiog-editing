import { Pos, BoxContext } from 'ennea-tree';

import makePos from './makePos';

import {
  Context
} from './types';

import {
  Component
} from '../types';

import {
  GROUND
} from '../constants';

export default function component(oldComponent : Component, pos : Pos, ctx : Context, queue : BoxContext<Context>[]) : Component{
  const inputIndex = oldComponent.package.inputs.findIndex(pin => pin.x === pos.left && pin.y === pos.top);
  if(inputIndex >= 0){
    const inputs = oldComponent.inputs.map((pin, index) => index === inputIndex
      ? {
        ...pin,
        net: ctx.net
      }
      : pin);

    return {
      ...oldComponent,
      inputs
    };
  }

  const outputIndex = oldComponent.package.outputs.findIndex(pin => pin.x === pos.left && pin.y === pos.top);
  if(outputIndex >= 0 && ctx.net === GROUND){
    const pin = oldComponent.package.outputs[outputIndex];
    const output = oldComponent.outputs[outputIndex];
    queue.push(makePos(ctx.pos, output.net, pin.dx, pin.dy));
  }

  return oldComponent;
}
