import { Node, Area, Box, BoxArea } from 'ennea-tree';
import { Node as BuddyNode } from 'buddy-tree';

export type Direction = 'rightwards' | 'downwards' | 'leftwards' | 'upwards';

export type Tool = 'wire' | 'gate' | 'underpass' | 'button' | 'light' | 'component';

export interface Forest {
  buddyTree : BuddyNode,
  enneaTree : TreeNode
}

export type TreeNode = Node<Item>;

export { Area, Box, BoxArea, BuddyNode };

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
  name? : string,
  direction : Direction,
}

export interface Component{
  type : 'component',
  inputs : ComponentInput[],
  outputs : ComponentOutput[],
  gates : ComponentGate[],
  nets : number[],
  source? : CompiledComponent,
  name? : string
}

export interface ComponentInput{
  x : number,
  y : number,
  net : number,
  pointsTo : ComponentInputPointer[],
  name? : string
}

export interface ComponentOutput{
  x : number,
  y : number,
  net : number,
  dx : number,
  dy : number,
  name? : string
}

export interface ComponentGate{
  net : number,
  inputA : number,
  inputB : number
}

export interface ComponentInputPointer {
  input : 'A' | 'B',
  index : number
}

export interface Light {
  type : 'light',
  net : number,
  name? : string,
  direction : Direction
}

export type Item = Wire
  | Gate
  | Underpass
  | Button
  | Component
  | Light;

export interface MutableContext{
  setMap(x : number, y : number, tile : number) : void;
  setNet(x : number, y : number, net : number) : void;
  setGate(gate : number, inputA : number, inputB : number) : void;
  insertText(item : Item, area : Area) : void;
  removeText(item : Item) : void;
  updateText(before : Item, after : Item) : void;
}

export interface IHaveDirection {
  dx : number,
  dy : number
}

export interface IHavePosition {
  x : number,
  y : number
}

export interface CompiledComponent {
  width : number,
  height : number,
  gates : CompiledComponentGate[],
  inputs : CompiledComponentInput[],
  outputs : CompiledComponentOutput[],
  name : string
}

export interface CompiledComponentPin extends IHaveDirection, IHavePosition {
  name? : string
}

export interface CompiledComponentInput extends CompiledComponentPin {
}

export interface CompiledComponentOutput extends CompiledComponentPin {
  gate : number
}

export interface CompiledComponentGate {
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
    filter<U extends T>(pred: (e : T, i : number, c : T[]) => e is U): U[];
  }
}