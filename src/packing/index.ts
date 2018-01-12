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
  ComponentGate,
  Direction,
  IDirection
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
  directionToDy,
  flatten
} from '../utils';

import layoutPins from './layoutPins';
import { AreaData } from 'ennea-tree';
import { IHaveDirection, CompiledComponentDisplay } from '../main';

type NetAndInput = [number, CompiledComponentGateInput];

export default function compile(forest : Forest, repo : string, name : string, version : string, hash : string) : CompiledComponent {
  const enneaTree = forest.enneaTree;
  const forestContet = ennea.getAll(enneaTree, {
    top: 0,
    left: 0,
    width: enneaTree.size,
    height: enneaTree.size
  });

  const forestButtons = forestContet
    .filter(node => node.data.type === BUTTON) as ennea.AreaData<Button>[];

  const forestGates = forestContet
    .filter(node => node.data.type === GATE) as ennea.AreaData<Gate>[];

  const forestComponents = forestContet
    .filter(node => node.data.type === COMPONENT) as ennea.AreaData<Component>[];

  const forestLights = forestContet
    .filter(node => node.data.type === LIGHT && node.data.net !== GROUND) as ennea.AreaData<Light>[];

  const forestDisplays = forestComponents
    .sort((a, b) => a.left - b.left)
    .map(component => component.data.displays)
    .reduce(flatten);

  const gatesInputs = forestGates
    .map(node => ({
      inputA: node.data.inputA,
      inputB: node.data.inputB
    }));

  const componentsInputs = forestComponents
    .map(c => c.data.gates)
    .reduce(flatten);

  const groundNet = makeGroundInputPair();
  const inputNets = forestButtons
    .map(makeInputInputPair);
  const gateNets = forestGates
    .map(makeGateInputPair);
  const gateAndComponentNets = forestComponents
    .reduce((gates, component) => gates.concat(component.data.gates.map(makeMakeGateInputPair(gates.length))), gateNets);

  const netToIndexMap = new Map([groundNet, ...inputNets, ...gateAndComponentNets]);

  const layout = layoutPins(
    forestButtons.map(getDirections),
    forestLights.map(getDirections),
    forestDisplays.length
  );

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

  const displays = forestDisplays.map((display, i) => ({
    x: (layout.width - forestDisplays.length*3)>>1,
    y: (layout.height>>1) - 2,
    segments: display.segments.map(s => netToIndexMap.get(s) || makeGroundInput())
  } as CompiledComponentDisplay))

  return {
    name,
    width: layout.width,
    height: layout.height,
    inputs: inputs,
    outputs,
    gates,
    displays,
    hash,
    repo,
    version
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

function makeMakeGateInputPair(size : number){
  return (gate : ComponentGate, index : number) => [gate.net, makeGateInput(index + size)] as NetAndInput;
}

function makeGateInputPair(input : AreaData<Gate>, index : number) : NetAndInput {
  return [input.data.net, makeGateInput(index)];
}

export function makeGateInput(index : number) : CompiledComponentGateInputFromGate{
  return {
    type: GATE,
    index
  };
}

function makeInputInputPair(input : AreaData<Button>, index : number) : NetAndInput {
  return [input.data.net, makeInputInput(index)];
}

export function makeInputInput(index : number) : CompiledComponentGateInputFromInput{
  return {
    type: INPUT,
    index
  };
}

function makeGroundInputPair() : NetAndInput {
  return [0, makeGroundInput()];
}

export function makeGroundInput() : CompiledComponentGateInputFromGround {
  return {
    type: 'ground'
  };
}

export function getDirections({top: y, left: x, data} : AreaData<IDirection>) {
  return {
    x,
    y,
    dx: directionToDx(data.direction),
    dy: directionToDy(data.direction)
  };
}