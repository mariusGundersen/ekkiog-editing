import test from 'ava';

import {
  CompiledComponent,
  CompiledComponentGate,
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
import drawButton from '../actions/drawButton';
import drawLight from '../actions/drawLight';
import drawComponent from '../actions/drawComponent';

import compile from './index';

test('compile single gate', t => {
  const forest = drawGate(createForest(), 64, 64);
  const compiled = compile(forest, 'x');
  t.deepEqual(compiled, {
    name: 'x',
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

test('compile lightbulb with ground net', t => {
  const forest = drawLight(createForest(), 64, 64);
  const compiled = compile(forest, 'x');
  t.deepEqual(compiled, {
    name: 'x',
    width: 3,
    height: 3,
    inputs: [] as CompiledComponentInput[],
    outputs: [] as CompiledComponentOutput[],
    gates: [] as CompiledComponentGate[]
  });
});

test('compile two gates', t => {
  let forest = createForest();
  forest = drawGate(forest, 64, 64);
  forest = drawGate(forest, 60, 65);
  const compiled = compile(forest, 'x');
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
  const compiled = compile(forest, 'a');
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
  forest = drawButton(forest, 58, 64);
  forest = drawGate(forest, 64, 64);
  forest = drawWire(forest, 60, 63);
  forest = drawWire(forest, 60, 64);
  forest = drawWire(forest, 60, 65);
  forest = drawLight(forest, 66, 64);
  const compiled = compile(forest, 'not');
  t.deepEqual(compiled, {
    name: 'not',
    width: 3,
    height: 3,
    inputs: [
      {
        dx: -1,
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
  const compiled = compile(forest, 'and');
  t.deepEqual(compiled, {
    name: 'and',
    width: 3,
    height: 5,
    inputs: [
      {
        dx: -1,
        dy: 0,
        x: 0,
        y: 1
      },
      {
        dx: -1,
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
        y: 2,
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
  const compiled = compile(forest, 'xor');
  t.deepEqual(compiled, {
    name : 'xor',
    width: 3,
    height: 5,
    inputs: [
      {
        dx: -1,
        dy: 0,
        x: 0,
        y: 1
      },
      {
        dx: -1,
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
        y: 2,
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
  const andComponent = compile(andForest(), 'and');
  const xorComponent = compile(xorForest(), 'xor');
  let forest = createForest();
  forest = drawButton(forest, 58, 60);
  forest = drawWire(forest, 60, 60);
  forest = drawWire(forest, 61, 60);
  forest = drawWire(forest, 62, 60);//and inputA
  forest = drawWire(forest, 62, 61);
  forest = drawUnderpass(forest, 62, 62);
  forest = drawWire(forest, 62, 63);
  forest = drawWire(forest, 62, 64);
  forest = drawWire(forest, 62, 65);//xor inputA

  forest = drawButton(forest, 58, 63);
  forest = drawWire(forest, 60, 62);
  forest = drawWire(forest, 61, 62);
  //forest = drawWire(forest, 62, 62);//and inputB
  forest = drawWire(forest, 60, 63);
  forest = drawWire(forest, 60, 64);
  forest = drawWire(forest, 60, 65);
  forest = drawWire(forest, 60, 66);
  forest = drawWire(forest, 60, 67);
  forest = drawWire(forest, 61, 67);
  forest = drawWire(forest, 62, 67);//xor inputB

  forest = drawComponent(forest, 64, 61, andComponent);
  forest = drawComponent(forest, 64, 66, xorComponent);
  forest = drawLight(forest, 67, 61);
  forest = drawLight(forest, 67, 66);
  const compiled = compile(forest, 'half-adder');
  t.deepEqual(compiled, {
    name: 'half-adder',
    width: 3,
    height: 5,
    inputs: [
      { x: 0, y: 1, dx: -1, dy: 0 },
      { x: 0, y: 3, dx: -1, dy: 0 }
    ],
    outputs: [
      { gate: 1, x: 2, y: 1, dx: 1, dy: 0 },
      { gate: 5, x: 2, y: 3, dx: 1, dy: 0 }
    ],
    gates: [
      {
        inputA: { type: INPUT, index: 0 },
        inputB: { type: INPUT, index: 1 }
      },
      {
        inputA: { type: GATE, index: 0 },
        inputB: { type: GATE, index: 0 }
      },
      {
        inputA: { type: INPUT, index: 0 },
        inputB: { type: GATE, index: 4 }
      },
      {
        inputA: { type: GATE, index: 4 },
        inputB: { type: INPUT, index: 1 }
      },
      {
        inputA: { type: INPUT, index: 0 },
        inputB: { type: INPUT, index: 1 }
      },
      {
        inputA: { type: GATE, index: 2 },
        inputB: { type: GATE, index: 3 }
      }
    ]
  });
});


test('xor inside xor', t => {
  let forest = xorForest();
  const xorComponent = compile(forest, 'xor');
  forest = drawButton(forest, 58, 40);
  forest = drawWire(forest, 60, 40);
  forest = drawWire(forest, 60, 41);

  forest = drawButton(forest, 58, 44);
  forest = drawWire(forest, 60, 44);
  forest = drawWire(forest, 60, 43);

  forest = drawComponent(forest, 64, 42, xorComponent);
  forest = drawLight(forest, 67, 42);

  const compiled = compile(forest, 'xor');

  t.is(compiled.gates.length, 8);
  t.is(compiled.inputs.length, 4);
  t.is(compiled.outputs.length, 2);
});



test('tripple xor', t => {
  const xorComponent = compile(xorForest(), 'xor');
  let forest = createForest();

  forest = drawComponent(forest, 66, 64, xorComponent);
  forest = drawComponent(forest, 62, 62, xorComponent);

  forest = drawButton(forest, 58, 60);
  forest = drawWire(forest, 60, 60);
  forest = drawWire(forest, 60, 61);

  forest = drawButton(forest, 58, 64);
  forest = drawWire(forest, 60, 64);
  forest = drawWire(forest, 60, 63);
  forest = drawWire(forest, 64, 62);
  forest = drawWire(forest, 64, 63);

  forest = drawButton(forest, 62, 66);
  forest = drawWire(forest, 64, 66);
  forest = drawWire(forest, 64, 65);


  forest = drawLight(forest, 69, 64);

  const compiled = compile(forest, 'xor');

  t.deepEqual(compiled.gates, [
    {
      inputA: { type: INPUT, index: 0 },
      inputB: { type: GATE, index: 2 }
    },
    {
      inputA: { type: GATE, index: 2 },
      inputB: { type: INPUT, index: 2 }
    },
    {
      inputA: { type: INPUT, index: 0 },
      inputB: { type: INPUT, index: 2 }
    },
    {
      inputA: { type: GATE, index: 0 },
      inputB: { type: GATE, index: 1 }
    },
    {
      inputA: { type: GATE, index: 3 },
      inputB: { type: GATE, index: 6 }
    },
    {
      inputA: { type: GATE, index: 6 },
      inputB: { type: INPUT, index: 1 }
    },
    {
      inputA: { type: GATE, index: 3 },
      inputB: { type: INPUT, index: 1 }
    },
    {
      inputA: { type: GATE, index: 4 },
      inputB: { type: GATE, index: 5 }
    }
  ]);
});


function andForest(forest = createForest()){
  forest = drawButton(forest, 58, 62);
  forest = drawWire(forest, 60, 62);
  forest = drawWire(forest, 60, 63);

  forest = drawButton(forest, 58, 66);
  forest = drawWire(forest, 60, 66);
  forest = drawWire(forest, 60, 65);

  forest = drawGate(forest, 64, 64);

  forest = drawWire(forest, 65, 63);
  forest = drawWire(forest, 65, 64);
  forest = drawWire(forest, 65, 65);

  forest = drawGate(forest, 69, 64);

  forest = drawLight(forest, 71, 64);
  return forest;
}

function xorForest(forest = createForest()){
  forest = drawButton(forest, 58, 62);
  forest = drawButton(forest, 58, 66);
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
  forest = drawLight(forest, 76, 64);

  return forest;
}