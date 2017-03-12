import * as ennea from 'ennea-tree';

import {
  Forest,
  Gate,
  Source,
  Drain,
  IHaveDirection,
  CompiledComponent,
  CompiledComponentInput,
  CompiledComponentOutput,
  CompiledComponentGateInput,
  CompiledComponentGateInputFromGate,
  CompiledComponentGateInputFromInput,
  CompiledComponentGateInputFromGround
} from '../types';

import {
 GATE,
 SOURCE,
 DRAIN,
 INPUT
} from '../constants';

import layoutPins from './layoutPins';

export default function compile(forest : Forest) : CompiledComponent {
  const enneaTree = forest.enneaTree;
  const forestContet = ennea.getAll(enneaTree, {
    top: 0,
    left: 0,
    width: enneaTree.size,
    height: enneaTree.size
  });

  const forestSources = forestContet
    .filter((node) : node is ennea.AreaData<Source> => node.data.type === SOURCE);

  const forestGates = forestContet
    .filter((node) : node is ennea.AreaData<Gate> => node.data.type === GATE);

  const forestDrains = forestContet
    .filter((node) : node is ennea.AreaData<Drain> => node.data.type === DRAIN);

  const inputNets = forestSources.map((input, index) => [input.data.net, makeInputInput(index)] as [number, CompiledComponentGateInputFromInput]);
  const gateNets = forestGates.map((gate, index) => [gate.data.net, makeGateInput(index)] as [number, CompiledComponentGateInputFromGate]);

  const netToIndexMap = new Map<number, CompiledComponentGateInput>([...inputNets, ...gateNets, [0, makeGroundInput()]]);

  const layout = layoutPins(
    forestSources.map(({top: y, left: x, data: {dx, dy}}) => ({x, y, dx, dy})),
    forestDrains.map(({top: y, left: x, data: {dx, dy}}) => ({x, y, dx, dy})));

  const gates = forestGates
    .map(node => ({
      inputA: netToIndexMap.get(node.data.inputA) || makeGroundInput(),
      inputB: netToIndexMap.get(node.data.inputB) || makeGroundInput()
    }));

  const outputs = layout.outputs
    .map((node, index) => ({
      gate: getGateNet(netToIndexMap.get(forestDrains[index].data.net)),
      x: node.x,
      y: node.y,
      dx: node.dx,
      dy: node.dy
    }));

  return {
    width: layout.width,
    height: layout.height,
    inputs: layout.inputs,
    outputs,
    gates
  };
}

export function getGateNet(input? : CompiledComponentGateInput){
  if(input == undefined){
    throw new Error("could not find any net");
  }

  if(input.type === GATE){
    return input.index;
  }

  throw new Error(`something wrong here ${input.type}`);
}

export function makeGateInput(index : number) : CompiledComponentGateInputFromGate{
  return {
    type: GATE,
    index
  };
}

export function makeInputInput(index : number) : CompiledComponentGateInputFromInput{
  return {
    type: INPUT,
    index
  };
}

export function makeGroundInput() : CompiledComponentGateInputFromGround {
  return {
    type: 'ground'
  };
}

export function inDirection(list : IHaveDirection[], dir : keyof IHaveDirection) : number{
  return list.filter(item => item[dir] !== 0).length*2 + 1;
}