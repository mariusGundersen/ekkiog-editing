import { Context } from '../types';

export function setMap(context : Context, x : number, y : number, tile : number){
  context.mapTexture.set(x, y, tile);
}

export function setNetMap(context : Context, x : number, y : number, net : number){
  context.netMapTexture.set(x, y, net);
}

export function setGate(context : Context, v : number, a : number, b : number){
  context.gatesTexture.set((v>>0)&0xff, (v>>8)&0xff, (a<<16) | (b<<0));
}