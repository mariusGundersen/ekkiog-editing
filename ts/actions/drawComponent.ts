import * as ennea from 'ennea-tree';
import * as buddy from 'buddy-tree';

import {
  COMPONENT,
  GROUND
} from '../constants';

import getNetAt from '../query/getNetAt';
import insertItem from './insertItem';

import {
  Forest,
  TreeNode,
  Component,
  CompiledComponent,
  CompiledComponentGate,
  ComponentInputPointer
} from '../types';

export interface MappedCompiledComponentGate extends CompiledComponentGate {
  net : number
}

const COMPONENT_SCHEMA = 1;

export default function drawComponent(forest : Forest, x : number, y : number, packagedComponent : CompiledComponent){
  x -= packagedComponent.width>>1;
  y -= packagedComponent.height>>1;
  const {tree: buddyTree, ...addresses} = buddy.allocate(forest.buddyTree, packagedComponent.gates.length);
  const nets = [...buddy.range(addresses)];

  const gates = packagedComponent.gates.map((gate, index) => ({...gate, net: nets[index]}));

  const inputs = packagedComponent.inputs.map((input, index) => ({
    x: input.x,
    y: input.y,
    dx: input.dx,
    dy: input.dy,
    net: getNetAtPos(forest.enneaTree, x, y, input.x, input.y, input.dx, input.dy),
    pointsTo: [...makePointsTo(gates, index)],
    name: input.name
  }));

  const outputs = packagedComponent.outputs.map(output => ({
    x: output.x,
    y: output.y,
    dx: output.dx,
    dy: output.dy,
    net: nets[output.gate],
    name: output.name
  }));

  const data : Component = {
    type: COMPONENT,
    schema: COMPONENT_SCHEMA,
    nets,
    inputs,
    outputs,
    gates: packagedComponent.gates.map((gate, index) => makeGate(gate, index, nets, inputs.map(i => i.net))),
    repo: packagedComponent.repo,
    hash: packagedComponent.hash,
    name: packagedComponent.name,
    version: packagedComponent.version
  };

  const box = {left:x, top:y, width:packagedComponent.width, height:packagedComponent.height};
  return insertItem(forest, buddyTree, data, box);
}

export function getNetAtPos(tree : TreeNode, sx : number, sy : number, x : number, y : number, dx : number, dy : number){
  return getNetAt(tree, sx+x+dx, sy+y+dy, dx, dy);
}

export function* makePointsTo(gates : MappedCompiledComponentGate[], index : number){
  yield* gates
    .filter(g => g.inputA.type === 'input' && g.inputA.index === index)
    .map(g => ({index: gates.indexOf(g), input: 'A' as 'A'}));
  yield* gates
    .filter(g => g.inputB.type === 'input' && g.inputB.index === index)
    .map(g => ({index: gates.indexOf(g), input: 'B' as 'B'}));
}

export function makeGate(gate : CompiledComponentGate, index : number, gateNets : number[], inputNets : number[]){
  return {
    net: gateNets[index],
    inputA: gate.inputA.type === 'gate'
      ? gateNets[gate.inputA.index]
      : gate.inputA.type === 'input'
      ? inputNets[gate.inputA.index]
      : GROUND,
    inputB: gate.inputB.type === 'gate'
      ? gateNets[gate.inputB.index]
      : gate.inputB.type === 'input'
      ? inputNets[gate.inputB.index]
      : GROUND
  };
}
