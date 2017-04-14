import * as ennea from 'ennea-tree';

import {
  Forest,
  Gate,
  Component,
  Button,
  Light,
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
 BUTTON,
 LIGHT,
 INPUT,
 GROUND
} from '../constants';

import {
  directionToDx,
  directionToDy
} from '../utils';

import layoutPins from './layoutPins';

type NetAndInput = [number, CompiledComponentGateInput];

export default function compile(forest : Forest, name : string) : CompiledComponent {
  const enneaTree = forest.enneaTree;
  const forestContet = ennea.getAll(enneaTree, {
    top: 0,
    left: 0,
    width: enneaTree.size,
    height: enneaTree.size
  });

  const forestButtons = forestContet
    .filter((node) : node is ennea.AreaData<Button> => node.data.type === BUTTON);

  const forestGates = forestContet
    .filter((node) : node is ennea.AreaData<Gate> => node.data.type === GATE);

  const forestComponents = forestContet
    .filter((node) : node is ennea.AreaData<Component> => node.data.type === COMPONENT);

  const forestLights = forestContet
    .filter((node) : node is ennea.AreaData<Light> => node.data.type === LIGHT && node.data.net !== GROUND);

  const gatesInputs = forestGates
    .map(node => ({
      inputA: node.data.inputA,
      inputB: node.data.inputB
    }));

  const componentsInputs = forestComponents.reduce((inputs, component) => inputs.concat(component.data.gates), [] as ComponentGate[]);

  const groundNet = [0, makeGroundInput()] as NetAndInput;
  const inputNets = forestButtons.map((input, index) => [input.data.net, makeInputInput(index)] as NetAndInput);
  const gateNets = forestGates.map((gate, index) => [gate.data.net, makeGateInput(index)] as NetAndInput);
  const gateAndComponentNets = forestComponents.reduce((gates, component) => gates.concat(component.data.gates.map((gate, index) => [gate.net, makeGateInput(index + gates.length)] as NetAndInput)), gateNets);

  const netToIndexMap = new Map([groundNet, ...inputNets, ...gateAndComponentNets]);

  const layout = layoutPins(
    forestButtons.map(({top: y, left: x, data: {direction}}) => ({x, y, dx: directionToDx(direction), dy: directionToDy(direction)})),
    forestLights.map(({top: y, left: x, data: {direction}}) => ({x, y, dx: directionToDx(direction), dy: directionToDy(direction)})));

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
      gate: getGateNet(netToIndexMap.get(forestLights[index].data.net), index),
      x: node.x,
      y: node.y,
      dx: node.dx,
      dy: node.dy
    }));

  return {
    name,
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