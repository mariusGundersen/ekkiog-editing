import test from 'ava';

import {
  CompiledComponent
} from './types';

import createForest from './actions/createForest';
import drawGate from './actions/drawGate';

import compile from './compile';

test('compile single gate', t => {
  const forest = drawGate(createForest(), 64, 64);
  const compiled = compile(forest);
  t.deepEqual(compiled, {
    width: 3,
    height: 3,
    inputs: [],
    outputs: [],
    gates: [
      {
        net: 0,
        inputA: {
          type: 'ground'
        },
        inputB: {
          type: 'ground'
        }
      }
    ]
  } as CompiledComponent);
});
