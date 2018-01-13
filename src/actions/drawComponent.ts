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
  ComponentInputPointer,
  CompiledComponentDisplay,
  CompiledComponentGateInput,
  ComponentDisplay
} from '../types';
import { ComponentInput } from '../main';
import { flatten } from '../utils';

const COMPONENT_SCHEMA = 2;

export default function drawComponent(forest : Forest, x : number, y : number, packagedComponent : CompiledComponent){
  x -= packagedComponent.width>>1;
  y -= packagedComponent.height>>1;
  const {tree: buddyTree, ...addresses} = buddy.allocate(forest.buddyTree, packagedComponent.gates.length);
  const nets = [...buddy.range(addresses)];

  const inputs = packagedComponent.inputs.map((input, index) => ({
    x: input.x,
    y: input.y,
    dx: input.dx,
    dy: input.dy,
    net: getNetAtPos(forest.enneaTree, x, y, input.x, input.y, input.dx, input.dy),
    pointsTo: [...makePointsTo(packagedComponent.gates, packagedComponent.displays, index)],
    name: input.name
  }));

  const inputNets = inputs.map(i => i.net);

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
    gates: packagedComponent.gates.map((gate, index) => makeGate(gate, index, nets, inputNets)),
    displays: packagedComponent.displays.map((display, index) => makeDisplay(display, index, nets, inputNets)),
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

export function* makePointsTo(gates : CompiledComponentGate[], displays : CompiledComponentDisplay[], index : number) : IterableIterator<ComponentInputPointer> {
  yield* gates
    .filter(g => g.inputA.type === 'input' && g.inputA.index === index)
    .map(g => ({index: gates.indexOf(g), input: 'A' as 'A'}));
  yield* gates
    .filter(g => g.inputB.type === 'input' && g.inputB.index === index)
    .map(g => ({index: gates.indexOf(g), input: 'B' as 'B'}));
  yield* displays
    .map((d, i) => d.segments
      .filter(s => s.type === 'input' && s.index === index)
      .map(s => ({input: 'S' as 'S', display: i, segment: d.segments.indexOf(s) })))
    .reduce(flatten, [])
}

export function makeGate(gate : CompiledComponentGate, index : number, gateNets : number[], inputNets : number[]){
  return {
    net: gateNets[index],
    inputA: getNet(gate.inputA, gateNets, inputNets),
    inputB: getNet(gate.inputB, gateNets, inputNets)
  };
}

export function makeDisplay(display : CompiledComponentDisplay, index : number, gateNets : number[], inputNets : number[]){
  return {
    x : display.x,
    y : display.y,
    segments: display.segments.map(s => getNet(s, gateNets, inputNets))
  } as ComponentDisplay;
}

function getNet(input : CompiledComponentGateInput, gateNets : number[], inputNets : number[]){
  return input.type === 'gate'
  ? gateNets[input.index]
  : input.type === 'input'
  ? inputNets[input.index]
  : GROUND
}