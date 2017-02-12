import * as ennea from 'ennea-tree';
import * as buddy from 'buddy-tree';

import {
  COMPONENT,
  GROUND
} from '../constants';

import getNetAt from '../query/getNetAt';
import floodFill from '../flooding/floodFill';

import {
  Forest,
  TreeNode,
  Component,
  CompiledComponent,
  CompiledComponentGate,
  ComponentInputPointer
} from '../types';

import { FloodSourceComponent } from '../flooding/types';

export interface MappedCompiledComponentGate extends CompiledComponentGate {
  net : number
}

export default function drawComponent(forest : Forest, x : number, y : number, source : CompiledComponent){
  x -= source.width>>1;
  y -= source.height>>1;
  const {tree: buddyTree, ...addresses} = buddy.allocate(forest.buddyTree, source.gates.length);
  const nets = [...buddy.range(addresses)];

  const gates = source.gates.map((gate, index) => ({...gate, net: nets[index]}));

  const inputs = source.inputs.map((input, index) => ({
    x: input.x,
    y: input.y,
    dx: input.dx,
    dy: input.dy,
    net: getNetAtPos(forest.enneaTree, x, y, input.x, input.y, input.dx, input.dy),
    pointsTo: [...makePointsTo(gates, index)]
  }));

  const outputs = source.outputs.map(output => ({
    x: output.x,
    y: output.y,
    dx: output.dx,
    dy: output.dy,
    net: nets[output.gate]
  }));

  const data = {
    type: COMPONENT,
    nets,
    inputs,
    outputs,
    gates: source.gates.map((gate, index) => makeGate(gate, index, nets))
  };
  const box = {left:x, top:y, width:source.width, height:source.height};
  let enneaTree = ennea.set(forest.enneaTree, data, box);

  if(forest.enneaTree === enneaTree){
    return forest;
  }

  enneaTree = floodFill(enneaTree, ...outputs.map(output => ({
    left: box.left + output.x,
    top: box.top + output.y,
    dx: output.dx,
    dy: output.dy,
    type: COMPONENT,
    net: output.net
  })));

  return {
    enneaTree,
    buddyTree
  };
}

export function getNetAtPos(tree : TreeNode, sx : number, sy : number, x : number, y : number, dx : number, dy : number){
  return getNetAt(tree, sx+x+dx, sy+y+dy, dx, dy);
}

export function* makePointsTo(gates : MappedCompiledComponentGate[], index : number){
  yield* gates
    .filter(g => g.inputA.type === 'input' && g.inputA.index === index)
    .map(g => ({net: g.net, input: 'A'} as ComponentInputPointer));
  yield* gates
    .filter(g => g.inputB.type === 'input' && g.inputB.index === index)
    .map(g => ({net: g.net, input: 'B'} as ComponentInputPointer));
}

export function makeGate(gate : CompiledComponentGate, index : number, nets : number[]){
  return {
    net: nets[index],
    inputA: gate.inputA.type === 'gate'
      ? nets[gate.inputA.index]
      : GROUND,
    inputB: gate.inputB.type === 'gate'
      ? nets[gate.inputB.index]
      : GROUND
  };
}