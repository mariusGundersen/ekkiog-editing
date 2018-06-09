import { Node, Area, Box, BoxArea } from 'ennea-tree';
import { Node as BuddyTree } from 'buddy-tree';

export type Direction = 'rightwards' | 'downwards' | 'leftwards' | 'upwards';

export type Tool = 'wire' | 'gate' | 'underpass' | 'button' | 'light' | 'component';

export type TileType = Tool | 'empty';

export interface Forest {
  readonly buddyTree : BuddyTree,
  readonly enneaTree : EnneaTree
}

export type EnneaTree = Node<Item>;

export { Area, Box, BoxArea, BuddyTree };

export interface Wire{
  readonly type: 'wire',
  readonly net: number
}

export interface Gate{
  readonly type : 'gate',
  readonly net : number,
  readonly inputA : number,
  readonly inputB : number
}

export interface Underpass{
  readonly type : 'underpass',
  readonly net : number
}

export interface Button{
  readonly type : 'button',
  readonly net : number,
  readonly name : string,
  readonly direction : Direction,
}

export interface Component{
  readonly type : 'component',
  readonly schema : 2,
  readonly inputs : ComponentInput[],
  readonly outputs : ComponentOutput[],
  readonly gates : ComponentGate[],
  readonly net : number,
  readonly hash : string,
  readonly repo : string,
  readonly name : string,
  readonly version : string
}

export interface ComponentInput{
  readonly x : number,
  readonly y : number,
  readonly net : number,
  readonly pointsTo : ComponentInputPointer[],
  readonly name? : string
}

export interface ComponentOutput{
  readonly x : number,
  readonly y : number,
  readonly net : number,
  readonly dx : number,
  readonly dy : number,
  readonly name? : string
}

export type ComponentGate = Readonly<[number, number]>;

export interface ComponentInputPointer {
  readonly input : 'A' | 'B',
  readonly index : number
}

export interface Light {
  readonly type : 'light',
  readonly net : number,
  readonly name : string,
  readonly direction : Direction
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
  clearGate(gate : number) : void;
  insertText(item : Item, area : Area) : void;
  removeText(item : Item) : void;
  updateText(before : Item, after : Item) : void;
}

export interface IHaveDirection {
  readonly dx : number,
  readonly dy : number
}

export interface IHavePosition {
  readonly x : number,
  readonly y : number
}

export interface CompiledComponent {
  readonly width : number,
  readonly height : number,
  readonly gates : CompiledComponentGate[],
  readonly inputs : CompiledComponentInput[],
  readonly outputs : CompiledComponentOutput[],
  readonly repo : string,
  readonly name : string,
  readonly hash : string,
  readonly version : string
}

export interface CompiledComponentPin extends IHaveDirection, IHavePosition {
  readonly name? : string
}

export interface CompiledComponentInput extends CompiledComponentPin {
  readonly group? : number
}

export interface CompiledComponentOutput extends CompiledComponentPin {
  readonly gate : number
}

export interface CompiledComponentGate {
  readonly inputA : CompiledComponentGateInput,
  readonly inputB : CompiledComponentGateInput
}

export type CompiledComponentGateInput =
  CompiledComponentGateInputFromGate
  | CompiledComponentGateInputFromInput
  | CompiledComponentGateInputFromGround;

export interface CompiledComponentGateInputFromGate{
  readonly type : 'gate',
  readonly index : number
}

export interface CompiledComponentGateInputFromInput{
  readonly type : 'input',
  readonly index : number
}

export interface CompiledComponentGateInputFromGround{
  readonly type : 'ground'
}

declare global{
  interface Array<T> {
    filter<U extends T>(pred: (e : T, i : number, c : T[]) => e is U): U[];
  }
}