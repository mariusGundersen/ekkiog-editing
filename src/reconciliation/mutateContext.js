export function setMap(context, x, y, tile){
  context.mapTexture.set(x, y, tile);
}

export function setNetMap(context, x, y, net){
  context.netMapTexture.set(x, y, net);
}

export function setGate(context, v, a, b){
  context.gatesTexture.set((v>>0)&0xff, (v>>8)&0xff, (a<<16) | (b<<0));
}

export function setGateA(context, v, a){
  const p = context.gatesTexture.get((v>>0)&0xff, (v>>8)&0xff);
  const b = (p>>0)&0xffff;
  context.gatesTexture.set((v>>0)&0xff, (v>>8)&0xff, (a<<16) | (b<<0));
}

export function setGateB(context, v, b){
  const p = context.gatesTexture.get((v>>0)&0xff, (v>>8)&0xff);
  const a = (p>>16)&0xffff;
  context.gatesTexture.set((v>>0)&0xff, (v>>8)&0xff, (a<<16) | (b<<0));
}