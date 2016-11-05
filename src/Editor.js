import ndarray from 'ndarray';
import * as ennea from 'ennea-tree';

import ContextQuery from './ContextQuery.js';
import Validator from './Validator.js';
import FloodFiller from './FloodFiller.js';
import {
  EMPTY,
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON
} from './tileConstants.js';

import {
  getWireNeighbouringNets,
  getUnderpassNeighbouringNets
} from './query/getNeighbouringNets.js';
import canPlaceWireHere from './validate/canPlaceWireHere.js';
import canPlaceGateHere from './validate/canPlaceGateHere.js';
import canPlaceUnderpassHere from './validate/canPlaceUnderpassHere.js';
import canPlaceButtonHere from './validate/canPlaceButtonHere.js';
import floodFill from './flooding/floodFill.js';
import reconcile from './reconciliation/reconcile.js';

const GROUND = 0;

export default class Editor{
  constructor(context){
    this.context = context;
    this.query = new ContextQuery(this.context);
    this.floodFiller = new FloodFiller(this.context, this.query);
    this.validate = new Validator(this.query);
  }

  drawWire(x, y){
    if(!canPlaceWireHere(this.context.enneaTree, x, y)) return false;

    const neighbouringNets = getWireNeighbouringNets(this.context.enneaTree, x, y);

    if(neighbouringNets.length > 1){
      return false;
    }

    const net = neighbouringNets[0] || GROUND;
    const data = {
      type: 'wire',
      net
    };
    const box = {left:x, top:y};
    let enneaTree = ennea.set(this.context.enneaTree, data, box);

    enneaTree = floodFill(enneaTree, net, {...box, data});

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;

    return true;
  }

  drawGate(x, y){
    if(!canPlaceGateHere(this.context.enneaTree, x-3, y-1)) return false;

    const net = this.query.getNextNet();
    const inputA = ennea.get(this.context.enneaTree, y-1, x-4);
    const inputB = ennea.get(this.context.enneaTree, y+1, x-4);
    const data = {
      type: 'gate',
      net,
      inputA: {
        net: inputA ? inputA.data.net : GROUND
      },
      inputB: {
        net: inputB ? inputB.data.net : GROUND
      }
    };
    const box = {left:x-3, top:y-1, width:4, height:3};
    let enneaTree = ennea.set(this.context.enneaTree, data, box);

    enneaTree = floodFill(enneaTree, net, {...box, data});

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;


    return true;
  }

  drawUnderpass(x, y){
    if(!canPlaceUnderpassHere(this.context.enneaTree, x, y)) return false;

    const neighbouringNets = getUnderpassNeighbouringNets(this.context.enneaTree, x, y);

    if(neighbouringNets.length > 1){
      return false;
    }

    const net = neighbouringNets[0] || GROUND;
    const data = {
      type: 'underpass',
      net
    };
    const box = {left:x, top:y};

    let enneaTree = ennea.set(this.context.enneaTree, data, box);
    enneaTree = ennea.set(enneaTree, {type:'wire', net: GROUND}, {left:x, top:y-1});
    enneaTree = ennea.set(enneaTree, {type:'wire', net: GROUND}, {left:x, top:y+1});

    enneaTree = floodFill(enneaTree, net, {...box, data});

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;
    return true;
  }

  drawButton(x, y){
    if(!canPlaceButtonHere(this.context.enneaTree, x-2, y-1)) return false;

    const net = this.query.getNextNet();
    const data = {
      type: 'button',
      net,
      state: 0
    };
    const box = {left:x-2, top:y-1, width:3, height:3};
    let enneaTree = ennea.set(this.context.enneaTree, data, box);

    enneaTree = floodFill(enneaTree, net, {...box, data});

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;


    return true;
  }

  clearWire(x, y){
    let [enneaTree, ...cleared] = ennea.clearBranch(this.context.enneaTree, {left:x, top:y});

    enneaTree = floodFill(enneaTree, GROUND, ...cleared);

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;

    return true;
  }

  clearGate(x, y){
    let [enneaTree, ...cleared] = ennea.clearBranch(this.context.enneaTree, {left:x, top:y});

    enneaTree = floodFill(enneaTree, GROUND, ...cleared);

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;

    return true;
  }

  clearUnderpass(x, y){
    let [enneaTree, ...cleared] = ennea.clearBranch(this.context.enneaTree, {left:x, top:y});

    enneaTree = floodFill(enneaTree, GROUND, ...cleared);

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;

    return true;
  }

  clearButton(x, y){
    let [enneaTree, ...cleared] = ennea.clearBranch(this.context.enneaTree, {left:x, top:y});

    enneaTree = floodFill(enneaTree, GROUND, ...cleared);

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;

    return true;
  }

  clear(x, y){
    if(this.query.isGate(x, y)){
      return this.clearGate(x, y);
    }else if(this.query.isButton(x, y)){
      return this.clearButton(x, y);
    }else if(this.query.isWire(x, y)){
      return this.clearWire(x, y);
    }else if(this.query.isUnderpass(x, y)){
      return this.clearUnderpass(x, y);
    }
  }

  draw(x, y, tool){
    if(tool == 'wire'){
      if(this.query.isWire(x, y)){
        return this.clearWire(x, y);
      }else{
        return this.drawWire(x, y);
      }
    }else if(tool == 'underpass'){
      if(this.query.isUnderpass(x, y)){
        return this.drawWire(x, y);
      }else{
        return this.drawUnderpass(x, y);
      }
    }else if(tool == 'gate'){
      return this.drawGate(x, y);
    }else if(tool == 'button'){
      return this.drawButton(x, y);
    }else{
      return false;
    }
  }

  getTileAt(x, y){
    switch(this.query.getTileType(x, y)){
      case WIRE:
        return 'wire';
      case UNDERPASS:
        return 'underpass';
      case GATE:
        return 'gate';
      case BUTTON:
        return 'button';
      case EMPTY:
        if(this.query.isGate(x, y)){
          return 'gate';
        }else if(this.query.isButton(x, y)){
          return 'button';
        }else{
          return 'empty';
        }
      default:
        return 'empty';
    }
  }

  longPress(x, y){
    switch(this.query.getTileType(x, y)){
      case WIRE:
        this.drawUnderpass(x, y);
        return true;
      case UNDERPASS:
        this.drawWire(x, y);
        return true;
      case EMPTY:
        if(this.query.isGate(x, y)){
          const [gateX, gateY] = this.query.getGateOutput(x, y);
          this.clearGate(gateX, gateY);
          return true;
        }else if(this.query.isButton(x, y)){
          const [buttonX, buttonY] = this.query.getButtonOutput(x, y);
          this.clearButton(buttonX, buttonY);
          return true;
        }else{
          return false;
        }
      default:
        return false;
    }
  }

  moveSelection(top, left, right, bottom, dx, dy){
    const width = right-left+1;
    const height = bottom-top+1;
    const selection = ndarray([], [height, width]);
    const sourceMap = this.context.mapTexture.map.lo(top, left).hi(height, width);
    for(let y=0; y<height; y++){
      for(let x=0; x<width; x++){
        selection.set(y, x, toTool(sourceMap.get(y, x)));
      }
    }
    for(let y=0; y<height; y++){
      for(let x=0; x<width; x++){
        this.clear(left+x, top+y);
      }
    }
    for(let y=0; y<height; y++){
      for(let x=0; x<width; x++){
        this.draw(left+x+dx, top+y+dy, selection.get(y, x));
      }
    }
  }

  updateGate(x, y){
    const inputA = this.query.getNet(x-3, y-1);
    const inputB = this.query.getNet(x-3, y+1);
    this.setGateInput(x, y, inputA, inputB);
  }

  getGateInput(x, y){
    const [outputX, outputY] = this.split(this.query.getNet(x, y));
    return this.context.gatesTexture.get(outputX, outputY);
  }

  setGateInput(x, y, a, b){
    const [outputX, outputY] = this.split(this.query.getNet(x, y));
    this.context.gatesTexture.set(outputX, outputY, (a<<16) | (b<<0));
  }

  toggleButton(x, y){
    const updater = ennea.update(this.context.enneaTree, old => ({
      ...old,
      state: old.state ? 0 : 1
    }));
    updater.update({top: y, left: x});
    const enneaTree = updater.result();

    const changes = ennea.diff(this.context.enneaTree, enneaTree);
    reconcile(this.context, changes);

    this.context.enneaTree = enneaTree;
  }

  split(v){
    return [
      (v>>0)&0xff,
      (v>>8)&0xff
    ];
  }
}

function toTool(value){
  switch(value){
    case WIRE: return 'wire';
    case GATE: return 'gate';
    case UNDERPASS: return 'underpass';
    case BUTTON: return 'button';
    default: return '';
  }
}