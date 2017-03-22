import { ChangeUpdate, Area } from 'ennea-tree';

import {
  setMap,
  setNetMap,
  setGate
} from './mutateContext';

import {
  EMPTY_TILE,
  WIRE_TILE,
  UNDERPASS_TILE
} from './tileConstants';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  COMPONENT,
  LIGHT,
  GROUND
} from '../constants';

import { Item, Wire, Gate, Underpass, Button, Light, Component, Context } from '../types';

export default function update(context : Context, change : ChangeUpdate<Item>){
  switch(change.after.type){
    case WIRE:
      return updateWireNet(context, change, change.after);
    case GATE:
      return updateGateInput(context, change, change.after);
    case UNDERPASS:
      return updateUnderpassNet(context, change, change.after);
    case BUTTON:
      return updateButtonState(context, change, change.after);
    case LIGHT:
      return updateLightNet(context, change, change.after);
    case COMPONENT:
      return updateComponent(context, change, change.before as Component, change.after);
  }
}

export function updateWireNet(context : Context, {top:y, left:x} : Area, wire : Wire){
  setMap(context, x, y, WIRE_TILE);
  setNetMap(context, x, y, wire.net);
}

export function updateGateInput(context : Context, {top:y, left:x} : Area, gate : Gate){
  setNetMap(context, x, y+0, gate.inputA);
  setNetMap(context, x, y+2, gate.inputB);
  setGate(context, gate.net, gate.inputA, gate.inputB);
}

export function updateUnderpassNet(context : Context, {top:y, left:x} : Area, underpass : Underpass){
  setMap(context, x, y, UNDERPASS_TILE);
  setNetMap(context, x, y, underpass.net);
}

export function updateButtonState(context : Context, {top:y, left:x} : Area, button : Button){
  const state = button.state ? 0 : 1;
  setGate(context, button.net, state, state);
}

export function updateLightNet(context : Context, {top:y, left:x, width, height} : Area, light : Light){
  for(let ty=0; ty<height; ty++){
    for(let tx=0; tx<width; tx++){
      setNetMap(context, tx+x, ty+y, light.net);
    }
  }
}

export function updateComponent(context : Context, {top:y, left:x} : Area, oldComponent : Component, newComponent : Component){
  for(const input of newComponent.inputs.filter((newInput, index) => newInput !== oldComponent.inputs[index])){
    setNetMap(context, x+input.x, y+input.y, input.net);
  }

  for(const gate of newComponent.gates.filter((newGate, index) => newGate !== oldComponent.gates[index])){
    setGate(context, gate.net, gate.inputA, gate.inputB);
  }
}