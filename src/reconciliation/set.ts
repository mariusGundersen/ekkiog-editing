import {
  ChangeSet,
  Area
} from 'ennea-tree';

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
  GROUND,
  COMPONENT,
  LIGHT,
  UPWARDS,
  LEFTWARDS,
  RIGHTWARDS,
  DOWNWARDS
} from '../constants';

import {
  Item,
  Wire,
  Gate,
  Underpass,
  Button,
  Component,
  Light,
  Context,
  Direction
} from '../types';

import {
  directionToDx,
  directionToDy
} from '../utils';

import * as tile from './tile';

export default function set(context : Context, change : ChangeSet<Item>){
  switch(change.after.type){
    case WIRE:
      return wire(context, change, change.after);
    case GATE:
      return gate(context, change, change.after);
    case UNDERPASS:
      return underpass(context, change, change.after);
    case BUTTON:
      return button(context, change, change.after);
    case COMPONENT:
      return component(context, change, change.after);
    case LIGHT:
      return light(context, change, change.after);
  }
}

export function wire(context : Context, {top:y, left:x} : Area, wire : Wire){
  setMap(context, x, y, tile.wire());
  setNetMap(context, x, y, wire.net);
}

export function gate(context : Context, {top:y, left:x, width, height} : Area, gate : Gate){
  for(let ty=0; ty<height; ty++){
    for(let tx=0; tx<width; tx++){
      setMap(context, tx+x, ty+y, tile.gate(tx, ty));
    }
  }
  setNetMap(context, x+3, y+1, gate.net);
  setNetMap(context, x+0, y+0, gate.inputA);
  setNetMap(context, x+0, y+2, gate.inputB);
  setGate(context, gate.net, gate.inputA, gate.inputB);
}

export function underpass(context : Context, {top:y, left:x} : Area, underpass : Underpass){
  setMap(context, x, y, tile.underpass());
  setNetMap(context, x, y, underpass.net);
}

export function button(context : Context, {top:y, left:x, width, height} : Area, button : Button){
  const dx = directionToDx(button.direction);
  const dy = directionToDy(button.direction);
  for(let ty=0; ty<height; ty++){
    for(let tx=0; tx<width; tx++){
      if(tx-1 === dx && ty-1 === dy){
        setMap(context, tx+x, ty+y, tile.buttonOutput(dx, dy));
      }else{
        setMap(context, tx+x, ty+y, tile.button(tx, ty));
      }
      setNetMap(context, tx+x, ty+y, button.net);
    }
  }
  const state = button.state ? 0 : 1;
  setGate(context, button.net, state, state);
}

export function component(context : Context, {top:y, left:x, width, height} : Area, component : Component){
  const ports = [...component.inputs, ...component.outputs];

  for(let ty=0; ty<height; ty++){
    for(let tx=0; tx<width; tx++){
      setMap(context, tx+x, ty+y, tile.component(tx, ty, width-1, height-1, ports));
    }
  }

  for(const port of ports){
    setNetMap(context, x+port.x, y+port.y, port.net);
  }

  for(const gate of component.gates){
    setGate(context, gate.net, gate.inputA, gate.inputB);
  }
}

export function light(context : Context, {top:y, left:x, width, height} : Area, light : Light){
  const dx = directionToDx(light.direction);
  const dy = directionToDy(light.direction);
  for(let ty=0; ty<height; ty++){
    for(let tx=0; tx<width; tx++){
      if(tx-1 === -dx && ty-1 === -dy){
        setMap(context, tx+x, ty+y, tile.lightInput(dx, dy));
      }else{
        setMap(context, tx+x, ty+y, tile.light(tx, ty));
      }
      setNetMap(context, tx+x, ty+y, light.net);
    }
  }
}
