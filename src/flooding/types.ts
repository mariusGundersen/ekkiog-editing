import {
  Pos
} from 'ennea-tree';

import {
  Direction
} from '../types';

export interface Context {
  net : number,
  pos : Pos,
  prev : Pos
}