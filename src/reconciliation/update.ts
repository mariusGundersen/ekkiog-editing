import { ChangeUpdate, Area, SET, CLEAR } from 'ennea-tree';

import set from './set';
import clear from './clear';

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
  MutableContext
} from '../types';

import {
  directionToDx,
  directionToDy
} from '../utils';

import * as tile from './tile';

export default function update(context : MutableContext, change : ChangeUpdate<Item>){
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
      if((change.before as Component).hash === change.after.hash){
        return updateComponent(context, change, change.before as Component, change.after);
      }else{
        const {top, left, width, height} = change;
        clear(context, {before: change.before, top, left, width, height, type: CLEAR});
        set(context, {after: change.after, top, left, width, height, type: SET});
      }
  }
}

export function updateWire(context : MutableContext, {top:y, left:x} : Area, wire : Wire){
  context.setMap(x, y, tile.wire());
  context.setNet(x, y, wire.net);
}

export function updateGate(context : MutableContext, {top:y, left:x} : Area, oldGate : Gate, newGate : Gate){
  var changed = false;

  if(oldGate.net !== newGate.net){
    context.setNet(x+3, y+1, newGate.net);
    changed = true;
  }

  if(oldGate.inputA !== newGate.inputA){
    context.setNet(x, y+0, newGate.inputA);
    changed = true;
  }

  if(oldGate.inputB !== newGate.inputB){
    context.setNet(x, y+2, newGate.inputB);
    changed = true;
  }

  if(changed){
    context.setGate(newGate.net, newGate.inputA, newGate.inputB);
  }
}

export function updateUnderpass(context : MutableContext, {top:y, left:x} : Area, underpass : Underpass){
  context.setMap(x, y, tile.underpass());
  context.setNet(x, y, underpass.net);
}

export function updateButton(context : MutableContext, {top:y, left:x, width, height} : Area, oldButton : Button, newButton : Button){
  if(oldButton.direction !== newButton.direction){
    const oldDx = directionToDx(oldButton.direction);
    const oldDy = directionToDy(oldButton.direction);
    const newDx = directionToDx(newButton.direction);
    const newDy = directionToDy(newButton.direction);

    context.setMap(x + oldDx + 1, y + oldDy + 1, tile.button(oldDx + 1, oldDy + 1));
    context.setMap(x + newDx + 1, y + newDy + 1, tile.buttonOutput(newDx, newDy));
  }

  if(oldButton.net !== newButton.net){
    for(let ty=0; ty<height; ty++){
      for(let tx=0; tx<width; tx++){
        context.setNet(tx+x, ty+y, newButton.net);
      }
    }
  }

  if(oldButton.name !== newButton.name){
    if(oldButton.name){
      context.updateText(oldButton, newButton);
    }else{
      context.insertText(newButton, {top:y, left:x, width, height});
    }
  }

  context.setGate(newButton.net, 1, 1);
}

export function updateLight(context : MutableContext, {top:y, left:x, width, height} : Area, oldLight : Light, newLight : Light){
  if(oldLight.direction !== newLight.direction){
    const oldDx = directionToDx(oldLight.direction);
    const oldDy = directionToDy(oldLight.direction);
    const newDx = directionToDx(newLight.direction);
    const newDy = directionToDy(newLight.direction);

    context.setMap(x - oldDx + 1, y - oldDy + 1, tile.button(oldDx, oldDy));
    context.setMap(x - newDx + 1, y - newDy + 1, tile.buttonOutput(newDx, newDy));
  }

  if(oldLight.net !== newLight.net){
    for(let ty=0; ty<height; ty++){
      for(let tx=0; tx<width; tx++){
        context.setNet(tx+x, ty+y, newLight.net);
      }
    }
  }

  if(oldLight.name !== newLight.name){
    if(oldLight.name){
      context.updateText(oldLight, newLight);
    }else{
      context.insertText(newLight, {top:y, left:x, width, height});
    }
  }
}

export function updateComponent(context : MutableContext, {top:y, left:x, width, height} : Area, oldComponent : Component, newComponent : Component){
  const oldInputs = oldComponent.inputs;
  const newInputs = newComponent.inputs;

  for(const [oldInput, newInput] of zip(oldInputs, newInputs)){
    if(oldInput.net !== newInput.net){
      context.setNet(x+newInput.x, y+newInput.y, newInput.net);
    }
  }

  for(const [oldGate, newGate] of zip(oldComponent.gates, newComponent.gates)){
    if(oldGate.inputA !== newGate.inputA
    || oldGate.inputB !== newGate.inputB
    || oldGate.net !== newGate.net){
      context.setGate(newGate.net, newGate.inputA, newGate.inputB);
    }
  }

  context.updateText(oldComponent, newComponent);
}

function* zip<T>(before : T[], after : T[]){
  for(let i=0; i<before.length; i++){
    yield [before[i], after[i]] as [T, T];
  }
}