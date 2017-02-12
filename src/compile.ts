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
    .map(node => ({
      net: 0,
      inputA: node.data.inputA == 0
        ? makeGroundGateInput()
        : makeGateInput(0),
      inputB: node.data.inputB == 0
        ? makeGroundGateInput()
        : makeGateInput(0)
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

export function makeGateInput(index : number) : CompiledComponentGateInputFromGate{
  return {
    type: GATE,
    index
  };
}

export function makeGroundGateInput() : CompiledComponentGateInputFromGround {
  return {
    type: 'ground'
  };
}