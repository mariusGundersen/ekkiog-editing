import { Node } from 'ennea-tree';
import { Node as BuddyNode } from 'buddy-tree';

export interface Forest {
  buddyTree : BuddyNode,
  enneaTree : TreeNode
}

export type TreeNode = Node<Item>;

export interface Wire{
  type: 'wire',
  net: number
}

export interface Gate{
  type : 'gate',
  net : number,
  inputA : number,
  inputB : number
}

export interface Underpass{
  type : 'underpass',
  net : number
}

export interface Button{
  type : 'button',
  net : number,
  state : boolean
}

export interface Component{
  type : 'component',
  inputs : {x : number, y : number, net : number, pointsTo : ComponentInputPointer[]}[],
  outputs : {x : number, y : number, net : number, dx : number, dy : number}[],
  gates : {net : number, inputA : number, inputB : number}[],
  nets : number[]
}

export interface ComponentInputPointer {
  input : 'A' | 'B',
  net : number
}

export interface Input{
  type : 'input'
}

export interface Output{
  type : 'output'
}

export type Item = Wire
  | Gate
  | Underpass
  | Button
  | Component
  | Input
  | Output;


export interface Context{
  mapTexture : Texture,
  netMapTexture : Texture,
  gatesTexture : Texture
}

export interface Texture {
  get(x : number, y : number) : number,
  set(x : number, y : number, net : number) : void
}

export interface CompiledComponent {
  width : number,
  height : number,
  gates : CompiledComponentGate[],
  inputs : {
    x : number,
    y : number,
    dx : number,
    dy : number
  }[]
  outputs : {
    x : number,
    y : number,
    dx : number,
    dy : number,
    gate : number
  }[]
}

export interface CompiledComponentGate {
  net : number,
  inputA : CompiledComponentGateInput,
  inputB : CompiledComponentGateInput
}

export type CompiledComponentGateInput =
  CompiledComponentGateInputFromGate
  | CompiledComponentGateInputFromInput
  | CompiledComponentGateInputFromGround;

export interface CompiledComponentGateInputFromGate{
  type : 'gate',
  index : number
}

export interface CompiledComponentGateInputFromInput{
  type : 'input',
  index : number
}

export interface CompiledComponentGateInputFromGround{
  type : 'ground'
}

declare global{
  interface Array<T> {
    filter<U extends T>(pred: (a: T) => a is U): U[];
  }
}