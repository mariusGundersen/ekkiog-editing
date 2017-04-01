import { ChangeUpdate, Area } from 'ennea-tree';

import {
  setMap,
  setNetMap,
  setGate
} from './mutateContext';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  COMPONENT,
  LIGHT,
  GROUND
} from '../constants';

import {
  Item,
  Wire,
  Gate,
  Underpass,
  Button,
  Light,
  Component,
  Context
} from '../types';

import {
  directionToDx,
  directionToDy
} from '../utils';

import * as tile from './tile';

export default function update(context : Context, change : ChangeUpdate<Item>){
  switch(change.after.type){
    case WIRE:
      return updateWire(context, change, change.after);
    case GATE:
      return updateGate(context, change, change.before as Gate, change.after);
    case UNDERPASS:
      return updateUnderpass(context, change, change.after);
    case BUTTON:
      return updateButton(context, change, change.before as Button, change.after);
    case LIGHT:
      return updateLight(context, change, change.before as Light, change.after);
    case COMPONENT:
      return updateComponent(context, change, change.before as Component, change.after);
  }
}

export function updateWire(context : Context, {top:y, left:x} : Area, wire : Wire){
  setMap(context, x, y, tile.wire());
  setNetMap(context, x, y, wire.net);
}

export function updateGate(context : Context, {top:y, left:x} : Area, oldGate : Gate, newGate : Gate){
  var changed = false;

  if(oldGate.net !== newGate.net){
    setNetMap(context, x+3, y+1, newGate.net);
    changed = true;
  }

  if(oldGate.inputA !== newGate.inputA){
    setNetMap(context, x, y+0, newGate.inputA);
    changed = true;
  }

  if(oldGate.inputB !== newGate.inputB){
    setNetMap(context, x, y+2, newGate.inputB);
    changed = true;
  }

  if(changed){
    setGate(context, newGate.net, newGate.inputA, newGate.inputB);
  }
}

export function updateUnderpass(context : Context, {top:y, left:x} : Area, underpass : Underpass){
  setMap(context, x, y, tile.underpass());
  setNetMap(context, x, y, underpass.net);
}

export function updateButton(context : Context, {top:y, left:x, width, height} : Area, oldButton : Button, newButton : Button){
  if(oldButton.direction !== newButton.direction){
    const oldDx = directionToDx(oldButton.direction);
    const oldDy = directionToDy(oldButton.direction);
    const newDx = directionToDx(newButton.direction);
    const newDy = directionToDy(newButton.direction);

    setMap(context, x + oldDx + 1, y + oldDy + 1, tile.button(oldDx, oldDy));
    setMap(context, x + newDx + 1, y + newDy + 1, tile.buttonOutput(newDx, newDy));
  }

  if(oldButton.net !== newButton.net){
    for(let ty=0; ty<height; ty++){
      for(let tx=0; tx<width; tx++){
        setNetMap(context, tx+x, ty+y, newButton.net);
      }
    }
  }

  const state = newButton.state ? 0 : 1;
  setGate(context, newButton.net, state, state);
}

export function updateLight(context : Context, {top:y, left:x, width, height} : Area, oldLight : Light, newLight : Light){
  if(oldLight.direction !== newLight.direction){
    const oldDx = directionToDx(oldLight.direction);
    const oldDy = directionToDy(oldLight.direction);
    const newDx = directionToDx(newLight.direction);
    const newDy = directionToDy(newLight.direction);

    setMap(context, x - oldDx + 1, y - oldDy + 1, tile.button(oldDx, oldDy));
    setMap(context, x - newDx + 1, y - newDy + 1, tile.buttonOutput(newDx, newDy));
  }

  if(oldLight.net !== newLight.net){
    for(let ty=0; ty<height; ty++){
      for(let tx=0; tx<width; tx++){
        setNetMap(context, tx+x, ty+y, newLight.net);
      }
    }
  }
}

export function updateComponent(context : Context, {top:y, left:x, width, height} : Area, oldComponent : Component, newComponent : Component){
  if(oldComponent.inputs.length !== newComponent.inputs.length
  || oldComponent.outputs.length !== newComponent.outputs.length){
    const ports = [...newComponent.inputs, ...newComponent.outputs];

    for(let ty=0; ty<height; ty++){
      for(let tx=0; tx<width; tx++){
        setMap(context, tx+x, ty+y, tile.component(tx, ty, width-1, height-1, ports));
      }
    }

    for(const port of ports){
      setNetMap(context, x+port.x, y+port.y, port.net);
    }
  }else{
    const oldPorts = [...oldComponent.inputs, ...oldComponent.outputs];
    const newPorts = [...newComponent.inputs, ...newComponent.outputs];

    for(const [oldPort, newPort] of zip(oldPorts, newPorts)){
      if(oldPort.net !== newPort.net){
        setNetMap(context, x+newPort.x, y+newPort.y, newPort.net);
      }
      if(oldPort.x !== newPort.x
      || oldPort.y !== newPort.y){
        setMap(context, x + oldPort.x, y + oldPort.y, tile.component(oldPort.x, oldPort.y, width-1, height-1, newPorts));
        setMap(context, x + newPort.x, y + newPort.y, tile.component(newPort.x, newPort.y, width-1, height-1, [newPort]));
      }
    }
  }

  for(const [oldGate, newGate] of zipOuter(oldComponent.gates, newComponent.gates)){
    if(newGate === undefined){
      break;
    }
    if(oldGate === undefined
    || oldGate.inputA !== newGate.inputA
    || oldGate.inputB !== newGate.inputB
    || oldGate.net !== newGate.net){
      setGate(context, newGate.net, newGate.inputA, newGate.inputB);
    }
  }
}

function* zip<T>(before : T[], after : T[]){
  for(let i=0; i<before.length; i++){
    yield [before[i], after[i]] as [T, T];
  }
}
function* zipOuter<T>(before : T[], after : T[]){
  for(let i=0; i<before.length || i<after.length; i++){
    yield [before[i], after[i]] as [T | undefined, T | undefined];
  }
}