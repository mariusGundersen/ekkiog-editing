import * as buddy from 'buddy-tree';

import {
  COMPONENT,
  GROUND
} from '../constants';

import getNetAt from '../query/getNetAt';
import insertItem from './insertItem';

import {
  Forest,
  EnneaTree,
  Component,
  Package,
  ComponentPin,
  ComponentInputPin,
} from '../types';

const COMPONENT_SCHEMA = 3;

export default function drawComponent(forest : Forest, x : number, y : number, pkg : Package){
  x -= pkg.width>>1;
  y -= pkg.height>>1;
  //TODO: figure out how to allocate 0 gates...
  //This will probably cause issues when removing the component again!
  const {tree: buddyTree, address} = pkg.gates.length ? buddy.allocate(forest.buddyTree, pkg.gates.length) : {tree: forest.buddyTree, address: -1};

  const groups = pkg.groups.map((group, index) => ({
    name: group.name,
    index,
    nets: pkg.inputs
      .filter(input => input.group === index)
      .map((input, index) => ({
        input: index,
        net: getNetAtPos(forest.enneaTree, x, y, input.x, input.y, input.dx, input.dy)
      }))
      .filter(pin => pin.net !== GROUND)
  }));

  if(groups.some(group => group.nets.length > 1)){
    return forest;
  }
  const inputs : ComponentInputPin[] = groups.map(group => ({
    net: group.nets.length === 0 ? GROUND : group.nets[0].net,
    name: group.name,
    input: group.nets.length === 0 ? -1 : group.nets[0].input
  }));

  const outputs : ComponentPin[] = pkg.outputs.map(output => ({
    net: address + output.gate,
    name: output.name
  }));

  const data : Component = {
    type: COMPONENT,
    schema: COMPONENT_SCHEMA,
    net: address,
    inputs,
    outputs,
    package: pkg
  };

  const box = {left:x, top:y, width:pkg.width, height:pkg.height};
  return insertItem(forest, buddyTree, data, box);
}

export function getNetAtPos(tree : EnneaTree, sx : number, sy : number, x : number, y : number, dx : number, dy : number){
  return getNetAt(tree, sx+x+dx, sy+y+dy, dx, dy);
}
