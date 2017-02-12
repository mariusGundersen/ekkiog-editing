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
  CompiledComponentGateInputFromGate,
  CompiledComponentGateInputFromInput,
  CompiledComponentGateInputFromGround
} from './types';

import {
 GATE,
 DRAIN,
 SOURCE,
 INPUT
} from './constants';

export default function compile(forest : Forest) : CompiledComponent {
  const enneaTree = forest.enneaTree;
  const forestContet = ennea.getAll(enneaTree, {
    top: 0,
    left: 0,
    width: enneaTree.size,
    height: enneaTree.size
  });

  const forestInputs = forestContet
    .filter((node) : node is ennea.AreaData<Source> => node.data.type === SOURCE)
    .sort((a, b) => a.data.net - b.data.net);

  const forestGates = forestContet
    .filter((node) : node is ennea.AreaData<Gate> => node.data.type === GATE)
    .sort((a, b) => a.data.net - b.data.net);

  const forestOutputs = forestContet
    .filter((node) : node is ennea.AreaData<Drain> => node.data.type === DRAIN)
    .sort((a, b) => a.data.net - b.data.net);

  const inputNets = forestInputs.map(input => input.data.net);

  const inputs = forestInputs
    .map(node => ({
      dx: node.data.dx,
      dy: node.data.dy,
      x: 0,
      y: 0
    }));

  const gates = forestGates
    .map(node => ({
      inputA: makeInput(node.data.inputA, inputNets),
      inputB: makeInput(node.data.inputB, inputNets)
    }));

  const outputs = forestOutputs
    .map(node => ({
      gate: 0,
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

export function makeInput(input : number, inputNets : number[]){
  if(input === 0){
    return makeGroundInput();
  }else{
    const inputIndex = inputNets.indexOf(input);
    if(inputIndex === -1){
      return makeGateInput(input -2);
    }else{
      return makeInputInput(inputIndex);
    }
  }
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