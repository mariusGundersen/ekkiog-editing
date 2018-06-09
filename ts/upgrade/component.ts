import {
  Component, ComponentInput, ComponentOutput, ComponentGate
} from '../types';


export interface Component0 {
  type : 'component',
  schema? : undefined,
  inputs : ComponentInput[],
  outputs : ComponentOutput[],
  gates : ComponentGate1[],
  nets : number[],
  hash : string,
  repo : string,
  name? : string,
  version : string
}

export interface Component1 {
  type : 'component',
  schema : 1,
  inputs : ComponentInput[],
  outputs : ComponentOutput[],
  gates : ComponentGate1[],
  nets : number[],
  hash : string,
  repo : string,
  name : string,
  version : string
}

export interface ComponentGate1 {
  net : number,
  inputA : number,
  inputB : number
}

export default function upgradeComponent(component : Component | Component0) : Component {
  return from1to2(from0to1(component));
}

function from0to1(component: Component0 | Component1 | Component) : Component1 | Component {
  if(component.schema === undefined) {
    return {
      type: 'component',
      schema: 1,
      inputs: component.inputs,
      outputs: component.outputs,
      gates: component.gates,
      nets: component.nets,
      name: component.name || 'unknown',
      repo: '',
      version: '0',
      hash: '0000000000000000000000000000000000000000'
    } as Component1;
  }else{
    return component;
  }
}

function from1to2(component: Component1 | Component) : Component {
  if(component.schema === 1){
    return {
      type: 'component',
      schema: 2,
      inputs: component.inputs,
      outputs: component.outputs,
      gates: component.gates.map(({inputA, inputB}) => [inputA, inputB] as [number, number]),
      net: component.nets[0],
      name: component.name,
      repo: component.repo,
      version: component.version,
      hash: component.hash
    } as Component;
  }else{
    return component;
  }
}