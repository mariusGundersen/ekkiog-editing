import test from 'ava';
import createForest from '../actions/createForest';
import drawComponent, { getNetAtPos } from '../actions/drawComponent';
import { straightThroughPackage } from '../packing/index.test';
import drawLight from '../actions/drawLight';
import drawButton from '../actions/drawButton';
import getTileAt from '../query/getTileAt';
import { Button } from '../types';

test('floodFill straight through component', t => {
  let forest = createForest();
  forest = drawComponent(forest, 64, 64, straightThroughPackage);
  forest = drawLight(forest, 67, 64);
  forest = drawButton(forest, 61, 64);
  const result = getTileAt(forest, 67, 64).data as Button;
  t.is(result.net, 2);
});