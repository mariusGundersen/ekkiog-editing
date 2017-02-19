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

export default function compile(forest : Forest) : CompiledComponent {
  const enneaTree = forest.enneaTree;
  const forestContet = ennea.getAll(enneaTree, {
    top: 0,
    left: 0,
    width: enneaTree.size,
    height: enneaTree.size
  });

  const forestInputs = forestContet
    .filter((node) : node is ennea.AreaData<Source> => node.data.type === SOURCE);

  const forestGates = forestContet
    .filter((node) : node is ennea.AreaData<Gate> => node.data.type === GATE);

  const forestOutputs = forestContet
    .filter((node) : node is ennea.AreaData<Drain> => node.data.type === DRAIN);

  const inputNets = forestInputs.map((input, index) => [input.data.net, makeInputInput(index)] as [number, CompiledComponentGateInputFromInput]);
  const gateNets = forestGates.map((gate, index) => [gate.data.net, makeGateInput(index)] as [number, CompiledComponentGateInputFromGate]);

  const netToIndexMap = new Map<number, CompiledComponentGateInput>([...inputNets, ...gateNets, [0, makeGroundInput()]]);

  const inputs = forestInputs
    .map(node => ({
      dx: node.data.dx,
      dy: node.data.dy,
      x: 0,
      y: 0
    }));

  const gates = forestGates
    .map(node => ({
      inputA: netToIndexMap.get(node.data.inputA) || makeGroundInput(),
      inputB: netToIndexMap.get(node.data.inputB) || makeGroundInput()
    }));

  const outputs = forestOutputs
    .map(node => ({
      gate: getGateNet(netToIndexMap.get(node.data.net)),
      dx: node.data.dx,
      dy: node.data.dy,
      x: 0,
      y: 0
    }));


  return {
    width: Math.max(3, inDirection(inputs, 'dx'), inDirection(outputs, 'dx')),
    height: Math.max(3, inDirection(inputs, 'dy'), inDirection(outputs, 'dy')),
    inputs,
    outputs,
    gates
  }
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