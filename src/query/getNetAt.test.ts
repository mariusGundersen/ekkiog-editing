import test from 'ava';

import getNetAt from './getNetAt';
import createForest from '../actions/createForest';
import drawWire from '../actions/drawWire';
import drawButton from '../actions/drawButton';
import drawGate from '../actions/drawGate';

test('wire - ground', t => {
  let forest = createForest();
  forest = drawWire(forest, 64, 64);
  const net = getNetAt(forest.enneaTree, 64, 64, 0, 0);
  t.is(net, 0);
});

test('wire - ground', t => {
  let forest = createForest();
  forest = drawButton(forest, 63, 64);
  forest = drawWire(forest, 64, 64);
  const net = getNetAt(forest.enneaTree, 64, 64, 0, 0);
  t.is(net, 2);
});

test('button - output', t => {
  let forest = createForest();
  forest = drawButton(forest, 64, 64);
  const net = getNetAt(forest.enneaTree, 64, 64, -1, 0);
  t.is(net, 2);
});

test('button - ground', t => {
  let forest = createForest();
  forest = drawButton(forest, 64, 64);
  const net = getNetAt(forest.enneaTree, 62, 64, 1, 0);
  t.is(net, 0);
});

test('gate - output', t => {
  let forest = createForest();
  forest = drawGate(forest, 64, 64);
  const net = getNetAt(forest.enneaTree, 64, 64, -1, 0);
  t.is(net, 2);
});

test('gate - ground', t => {
  let forest = createForest();
  forest = drawGate(forest, 64, 64);
  const net = getNetAt(forest.enneaTree, 62, 64, 1, 0);
  t.is(net, 0);
});