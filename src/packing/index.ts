import * as ennea from 'ennea-tree';

import {
  Forest,
  Gate,
  Component,
  Source,
  Drain,
  CompiledComponent,
  CompiledComponentGateInput,
  CompiledComponentGateInputFromGate,
  CompiledComponentGateInputFromInput,
  CompiledComponentGateInputFromGround,
  ComponentGate
} from '../types';

import {
 GATE,
 COMPONENT,
 SOURCE,
 DRAIN,
 INPUT
} from '../constants';

import layoutPins from './layoutPins';

export default function compile(forest : Forest) : CompiledComponent {
  const enneaTree = forest.enneaTree;
  const forestContet = ennea.getAll(enneaTree, {
    top: 0,
    left: 0,
    width: enneaTree.size,
    height: enneaTree.size
  });

  const forestSources = forestContet
    .filter((node) : node is ennea.AreaData<Source> => node.data.type === SOURCE);

  const forestGates = forestContet
    .filter((node) : node is ennea.AreaData<Gate> => node.data.type === GATE);

  const forestComponents = forestContet
    .filter((node) : node is ennea.AreaData<Component> => node.data.type === COMPONENT);

  const forestDrains = forestContet
    .filter((node) : node is ennea.AreaData<Drain> => node.data.type === DRAIN);

  const gatesInputs = forestGates
    .map(node => ({
      inputA: node.data.inputA,
      inputB: node.data.inputB
    }));

  const componentsInputs = forestComponents.reduce((inputs, component) => inputs.concat(component.data.gates), [] as ComponentGate[]);

  const inputNets = forestSources.map((input, index) => [input.data.net, makeInputInput(index)] as [number, CompiledComponentGateInputFromInput]);
  const gateNets = forestGates.map((gate, index) => [gate.data.net, makeGateInput(index)] as [number, CompiledComponentGateInputFromGate]);
  const allNets = forestComponents.reduce((gates, component) => gates.concat(component.data.gates.map((gate, index) => [gate.net, makeGateInput(index + gates.length)] as [number, CompiledComponentGateInputFromGate])), gateNets);

  const netToIndexMap = new Map<number, CompiledComponentGateInput>([...inputNets, ...allNets, [0, makeGroundInput()]]);

  const layout = layoutPins(
    forestSources.map(({top: y, left: x, data: {dx, dy}}) => ({x, y, dx, dy})),
    forestDrains.map(({top: y, left: x, data: {dx, dy}}) => ({x, y, dx, dy})));

  const inputs = layout.inputs
    .map(input => ({
      x: input.x,
      y: input.y,
      dx: -input.dx,
      dy: -input.dy
    }))

  const gates = [...gatesInputs, ...componentsInputs]
    .map(gate => ({
      inputA: netToIndexMap.get(gate.inputA) || makeGroundInput(),
      inputB: netToIndexMap.get(gate.inputB) || makeGroundInput()
    }));

  const outputs = layout.outputs
    .map((node, index) => ({
      gate: getGateNet(netToIndexMap.get(forestDrains[index].data.net), index),
      x: node.x,
      y: node.y,
      dx: node.dx,
      dy: node.dy
    }));

  return {
    width: layout.width,
    height: layout.height,
    inputs: inputs,
    outputs,
    gates
  };
}

export function getGateNet(input : CompiledComponentGateInput | undefined, index : number){
  if(input == undefined){
    throw new Error("could not find any net");
  }

  if(input.type === GATE){
    return input.index;
  }

  throw new Error(`output ${index} is of type ${input.type}`);
}

export function makeGateInput(index : number) : CompiledComponentGateInputFromGate{
  return {
    type: GATE,
    index
  };
}

export function makeInputInput(index : number) : CompiledComponentGateInputFromInput{
  return {
    type: INPUT,
    index
  };
}

export function makeGroundInput() : CompiledComponentGateInputFromGround {
  return {
    type: 'ground'
  };
}