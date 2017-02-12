import * as ennea from 'ennea-tree';

import {
  Forest,
  Gate,
  CompiledComponent,
  CompiledComponentGateInputFromGate,
  CompiledComponentGateInputFromGround
} from './types';

import {
 GATE
} from './constants';

export default function compile(forest : Forest) : CompiledComponent {
  const gates = ennea.getAll(forest.enneaTree, {top: 0, left: 0, width: forest.enneaTree.size, height: forest.enneaTree.size})
    .filter((node) : node is ennea.AreaData<Gate> => node.data.type === GATE)
    .sort((a, b) => a.data.net - b.data.net)
    .map(node => ({
      inputA: makeInput(node.data.inputA),
      inputB: makeInput(node.data.inputB)
    }));

  return {
    width: 3,
    height: 3,
    inputs: [

    ],
    outputs: [

    ],
    gates
  }
}

export function makeInput(input : number){
  if(input === 0){
    return makeGroundInput();
  }else{
    return makeGateInput(input - 2)
  }
}

export function makeGateInput(index : number) : CompiledComponentGateInputFromGate{
  return {
    type: GATE,
    index
  };
}

export function makeGroundInput() : CompiledComponentGateInputFromGround {
  return {
    type: 'ground'
  };
}