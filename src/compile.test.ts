import test from 'ava';

import {
  CompiledComponent,
  CompiledComponentInput,
  CompiledComponentOutput
} from './types';

import {
  GATE,
  INPUT
 } from './constants';

import createForest from './actions/createForest';
import drawGate from './actions/drawGate';
import drawWire from './actions/drawWire';
import drawSource from './actions/drawSource';
import drawDrain from './actions/drawDrain';

import compile from './compile';

test('compile single gate', t => {
  const forest = drawGate(createForest(), 64, 64);
  const compiled = compile(forest);
  t.deepEqual(compiled, {
    width: 3,
    height: 3,
    inputs: [] as CompiledComponentInput[],
    outputs: [] as CompiledComponentOutput[],
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
  });
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
        type: GATE,
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
          type: GATE,
          index: 1
        },
        inputB: {
          type: GATE,
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


test.only('compile NOT gate', t => {
  let forest = createForest();
  forest = drawGate(forest, 64, 64);
  forest = drawWire(forest, 60, 63);
  forest = drawWire(forest, 60, 64);
  forest = drawWire(forest, 60, 65);
  forest = drawSource(forest, 59, 64, 1, 0);
  forest = drawDrain(forest, 65, 64, 1, 0);
  const compiled = compile(forest);
  t.deepEqual(compiled, {
    width: 3,
    height: 3,
    inputs: [
      {
        dx: 1,
        dy: 0,
        x: 0,
        y: 0
      }
    ],
    outputs: [
      {
        dx: 1,
        dy: 0,
        x: 0,
        y: 0,
        gate: 0
      }
    ],
    gates: [
      {
        inputA: {
          type: INPUT,
          index: 0
        },
        inputB: {
          type: INPUT,
          index: 0
        }
      }
    ]
  });
});