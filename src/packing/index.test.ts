import test from 'ava';

import {
  CompiledComponent,
  CompiledComponentInput,
  CompiledComponentOutput
} from '../types';

import {
  GATE,
  INPUT
 } from '../constants';

import createForest from '../actions/createForest';
import drawGate from '../actions/drawGate';
import drawWire from '../actions/drawWire';
import drawUnderpass from '../actions/drawUnderpass';
import drawSource from '../actions/drawSource';
import drawDrain from '../actions/drawDrain';
import drawComponent from '../actions/drawComponent';

import compile from './index';

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
        type: 'ground'
      }
    },
    {
      inputA: {
        type: 'ground'
      },
      inputB: {
        type: GATE,
        index: 0
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
    },
    {
      inputA: {
        type: GATE,
        index: 0
      },
      inputB: {
        type: GATE,
        index: 1
      }
    }
  ]);
});


test('compile NOT gate', t => {
  let forest = createForest();
  forest = drawSource(forest, 59, 64, 1, 0);
  forest = drawGate(forest, 64, 64);
  forest = drawWire(forest, 60, 63);
  forest = drawWire(forest, 60, 64);
  forest = drawWire(forest, 60, 65);
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
        y: 1
      }
    ],
    outputs: [
      {
        dx: 1,
        dy: 0,
        x: 2,
        y: 1,
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

test('compile AND gate', t => {
  const forest = andForest();
  const compiled = compile(forest);
  t.deepEqual(compiled, {
    width: 3,
    height: 5,
    inputs: [
      {
        dx: 1,
        dy: 0,
        x: 0,
        y: 1
      },
      {
        dx: 1,
        dy: 0,
        x: 0,
        y: 3
      }
    ],
    outputs: [
      {
        dx: 1,
        dy: 0,
        x: 2,
        y: 1,
        gate: 1
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
          index: 1
        }
      },
      {
        inputA: {
          type: GATE,
          index: 0
        },
        inputB: {
          type: GATE,
          index: 0
        }
      }
    ]
  });
});

test('compile XOR gate', t => {
  const forest = xorForest();
  const compiled = compile(forest);
  t.deepEqual(compiled, {
    width: 3,
    height: 5,
    inputs: [
      {
        dx: 1,
        dy: 0,
        x: 0,
        y: 1
      },
      {
        dx: 1,
        dy: 0,
        x: 0,
        y: 3
      }
    ],
    outputs: [
      {
        dx: 1,
        dy: 0,
        x: 2,
        y: 1,
        gate: 3
      }
    ],
    gates: [
      {
        inputA: {
          type: INPUT,
          index: 0
        },
        inputB: {
          type: GATE,
          index: 2
        }
      },
      {
        inputA: {
          type: GATE,
          index: 2
        },
        inputB: {
          type: INPUT,
          index: 1
        }
      },
      {
        inputA: {
          type: INPUT,
          index: 0
        },
        inputB: {
          type: INPUT,
          index: 1
        }
      },
      {
        inputA: {
          type: GATE,
          index: 0
        },
        inputB: {
          type: GATE,
          index: 1
        }
      }
    ]
  });
});

test('half adder', t => {
  const andComponent = compile(andForest());
  const xorComponent = compile(xorForest());
  let forest = createForest();
  forest = drawSource(forest, 59, 60, 1, 0);
  forest = drawWire(forest, 60, 60);
  forest = drawWire(forest, 61, 60);
  forest = drawWire(forest, 62, 60);
  forest = drawWire(forest, 62, 61);
  forest = drawUnderpass(forest, 62, 62);
  forest = drawWire(forest, 62, 63);
  forest = drawWire(forest, 62, 64);
  forest = drawWire(forest, 62, 65);

  forest = drawSource(forest, 59, 62, 1, 0);
  forest = drawWire(forest, 60, 62);
  forest = drawWire(forest, 61, 62);
  forest = drawWire(forest, 60, 63);
  forest = drawWire(forest, 60, 64);
  forest = drawWire(forest, 60, 65);
  forest = drawWire(forest, 60, 66);
  forest = drawWire(forest, 60, 67);
  forest = drawWire(forest, 61, 67);
  forest = drawWire(forest, 62, 67);

  forest = drawComponent(forest, 64, 60, andComponent);
  forest = drawComponent(forest, 64, 66, xorComponent);
  forest = drawDrain(forest, 66, 60, 1, 0);
  forest = drawDrain(forest, 66, 66, 1, 0);
  const compiled = compile(forest);
  console.log(compiled);
})

function andForest(forest = createForest()){
  forest = drawSource(forest, 60, 63, 1, 0);
  forest = drawSource(forest, 60, 65, 1, 0);
  forest = drawGate(forest, 64, 64);
  forest = drawWire(forest, 65, 63);
  forest = drawWire(forest, 65, 64);
  forest = drawWire(forest, 65, 65);
  forest = drawGate(forest, 69, 64);
  forest = drawDrain(forest, 70, 64, 1, 0);
  return forest;
}

function xorForest(forest = createForest()){
  forest = drawSource(forest, 59, 62, 1, 0);
  forest = drawSource(forest, 59, 67, 1, 0);
  forest = drawWire(forest, 60, 63);
  forest = drawWire(forest, 60, 62);
  forest = drawWire(forest, 60, 61);
  forest = drawWire(forest, 61, 61);
  forest = drawWire(forest, 62, 61);
  forest = drawWire(forest, 63, 61);
  forest = drawWire(forest, 64, 61);
  forest = drawWire(forest, 65, 61);

  forest = drawWire(forest, 60, 65);
  forest = drawWire(forest, 60, 66);
  forest = drawWire(forest, 60, 67);
  forest = drawWire(forest, 61, 67);
  forest = drawWire(forest, 62, 67);
  forest = drawWire(forest, 63, 67);
  forest = drawWire(forest, 64, 67);
  forest = drawWire(forest, 65, 67);

  forest = drawGate(forest, 64, 64);
  forest = drawWire(forest, 65, 63);
  forest = drawWire(forest, 65, 64);
  forest = drawWire(forest, 65, 65);

  forest = drawGate(forest, 69, 62);
  forest = drawGate(forest, 69, 66);

  forest = drawWire(forest, 70, 62);
  forest = drawWire(forest ,70, 63);

  forest = drawWire(forest, 70, 65);
  forest = drawWire(forest ,70, 66);

  forest = drawGate(forest, 74, 64);
  forest = drawDrain(forest, 75, 64, 1, 0);

  return forest;
}