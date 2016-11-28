import {
  setMap,
  setNetMap,
  setGate
} from './mutateContext.js';

import {
  EMPTY_TILE,
  WIRE_TILE,
  UNDERPASS_TILE
} from './tileConstants.js';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  GROUND
} from '../constants.js';

export default function update(context, change){
  switch(change.after.type){
    case WIRE:
      return updateWireNet(context, change, change.after);
    case GATE:
      return updateGateInput(context, change, change.after);
    case UNDERPASS:
      return updateUnderpassNet(context, change, change.after);
    case BUTTON:
      return updateButtonState(context, change, change.after);
  }
}

export function updateWireNet(context, {top:y, left:x}, wire){
  setMap(context, x, y, WIRE_TILE);
  setNetMap(context, x, y, wire.net);
}

export function updateGateInput(context, {top:y, left:x}, gate){
  setNetMap(context, x, y+0, gate.inputA.net);
  setNetMap(context, x, y+2, gate.inputB.net);
  setGate(context, gate.net, gate.inputA.net, gate.inputB.net);
}

export function updateUnderpassNet(context, {top:y, left:x}, underpass){
  setMap(context, x, y, UNDERPASS_TILE);
  setNetMap(context, x, y, underpass.net);
}

export function updateButtonState(context, {top:y, lfet:x}, button){
  const state = button.state ? 0 : 1;
  setGate(context, button.net, state, state);
}