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

export default function component(oldComponent : Component, pos : Pos, ctx : Context, queue : BoxContext<Context>[]){
  const hitsInput = oldComponent.inputs.some(input => input.x === pos.left && input.y === pos.top);
  if(hitsInput){
    const targetInput = oldComponent.inputs.filter(input => input.x === pos.left && input.y === pos.top)[0];
    const inputs = oldComponent.inputs.map(input => input === targetInput
      ? {
        ...input,
        net: ctx.net
      }
      : input);
    const gates = oldComponent.gates.map((gate, index) => {
      const points = targetInput.pointsTo.filter(p => p.index === index);
      if(points.length === 0){
        return gate;
      }

      const pointA = points.filter(p => p.input === 'A')[0];
      const pointB = points.filter(p => p.input === 'B')[0];

      return {
        ...gate,
        inputA: pointA ? ctx.net : gate.inputA,
        inputB: pointB ? ctx.net : gate.inputB,
      }
    })

    return {
      ...oldComponent,
      inputs,
      gates
    };
  }

  const output = oldComponent.outputs.filter(output => output.x === pos.left && output.y === pos.top)[0];
  if(output && ctx.net === GROUND){
    queue.push(makePos(ctx.pos, output.net, output.dx, output.dy));
  }

  return oldComponent;
}
