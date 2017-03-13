import test from 'ava';

import layoutPins from './layoutPins';

test('no inputs or outputs', t => {
  const layout = layoutPins([], []);

  t.is(layout.width, 3);
  t.is(layout.height, 3);
  t.deepEqual(layout.inputs, []);
  t.deepEqual(layout.outputs, []);
});

test('one input left, one output right', t => {
  const layout = layoutPins([
    {
      x: 64,
      y: 64,
      dx: 1,
      dy: 0,
    }
  ], [
    {
      x: 70,
      y: 64,
      dx: 1,
      dy: 0,
    }]);

  t.is(layout.width, 3);
  t.is(layout.height, 3);
  t.deepEqual(layout.inputs, [
    {
      x: 0,
      y: 1,
      dx: 1,
      dy: 0
    }
  ]);
  t.deepEqual(layout.outputs, [
    {
      x: 2,
      y: 1,
      dx: 1,
      dy: 0
    }
  ]);
});

test('two input left, one output right', t => {
  const layout = layoutPins([
    {
      x: 64,
      y: 65,
      dx: 1,
      dy: 0,
    },
    {
      x: 64,
      y: 63,
      dx: 1,
      dy: 0,
    }
  ], [
    {
      x: 70,
      y: 64,
      dx: 1,
      dy: 0,
    }
  ]);

  t.is(layout.width, 3);
  t.is(layout.height, 5);
  t.deepEqual(layout.inputs, [
    {
      x: 0,
      y: 3,
      dx: 1,
      dy: 0
    },
    {
      x: 0,
      y: 1,
      dx: 1,
      dy: 0
    }
  ]);
  t.deepEqual(layout.outputs, [
    {
      x: 2,
      y: 2,
      dx: 1,
      dy: 0
    }
  ]);
});

test('full adder', t => {
  const layout = layoutPins([
    {
      x: 64,
      y: 63,
      dx: 1,
      dy: 0,
    },
    {
      x: 64,
      y: 65,
      dx: 1,
      dy: 0,
    },
    {
      x: 64,
      y: 67,
      dx: 0,
      dy: -1,
    }
  ], [
    {
      x: 70,
      y: 64,
      dx: 1,
      dy: 0,
    },
    {
      x: 70,
      y: 62,
      dx: 0,
      dy: -1,
    }
  ]);

  t.is(layout.width, 3);
  t.is(layout.height, 5);
  t.deepEqual(layout.inputs, [
    {
      x: 0,
      y: 1,
      dx: 1,
      dy: 0
    },
    {
      x: 0,
      y: 3,
      dx: 1,
      dy: 0
    },
    {
      x: 1,
      y: 4,
      dx: 0,
      dy: -1
    }
  ]);
  t.deepEqual(layout.outputs, [
    {
      x: 2,
      y: 2,
      dx: 1,
      dy: 0
    },
    {
      x: 1,
      y: 0,
      dx: 0,
      dy: -1
    }
  ]);
});

test('input and output on all sides', t => {

  const inputs = [
    {
      x: 0,
      y: 1,
      dx: 1,
      dy: 0,
    },
    {
      x: 4,
      y: 3,
      dx: -1,
      dy: 0,
    },
    {
      x: 1,
      y: 0,
      dx: 0,
      dy: 1,
    },
    {
      x: 3,
      y: 4,
      dx: 0,
      dy: -1,
    }
  ];

  const outputs = [
    {
      x: 0,
      y: 3,
      dx: -1,
      dy: 0,
    },
    {
      x: 4,
      y: 1,
      dx: 1,
      dy: 0,
    },
    {
      x: 3,
      y: 0,
      dx: 0,
      dy: -1,
    },
    {
      x: 1,
      y: 4,
      dx: 0,
      dy: 1,
    }
  ];

  const layout = layoutPins(inputs, outputs);

  t.is(layout.width, 5);
  t.is(layout.height, 5);
  t.deepEqual(layout.inputs, inputs);
  t.deepEqual(layout.outputs, outputs);
});