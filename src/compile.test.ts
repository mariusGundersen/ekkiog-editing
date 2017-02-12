import test from 'ava';

import {
  CompiledComponent
} from './types';

import createForest from './actions/createForest';
import drawGate from './actions/drawGate';
import drawWire from './actions/drawWire';

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


test('compile two gates', t => {
  let forest = createForest();
  forest = drawGate(forest, 64, 64);
  forest = drawGate(forest, 60, 65);
  const compiled = compile(forest);
  t.deepEqual(compiled.gates, [
    {
      inputA: {
        type: 'ground'
      },
      inputB: {
        type: 'gate',
        index: 1
      }
    },
    {
      inputA: {
        type: 'ground'
      },
      inputB: {
        type: 'ground'
      }
    }
  ]);
});

test('compile three gates', t => {
  let forest = createForest();
  forest = drawGate(forest, 64, 64);
  forest = drawGate(forest, 59, 62);
  forest = drawGate(forest, 59, 66);
  forest = drawWire(forest, 60, 62);
  forest = drawWire(forest, 60, 63);
  forest = drawWire(forest, 60, 65);
  forest = drawWire(forest, 60, 66);
  const compiled = compile(forest);
  t.deepEqual(compiled.gates, [
      {
        inputA: {
          type: 'gate',
          index: 1
        },
        inputB: {
          type: 'gate',
          index: 2
        }
      },
      {
        inputA: {
          type: 'ground'
        },
        inputB: {
          type: 'ground'
        }
      },
      {
        inputA: {
          type: 'ground'
        },
        inputB: {
          type: 'ground'
        }
      }
    ]
  );
});
