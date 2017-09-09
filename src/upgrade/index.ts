import {
  Tool,
  Item
} from '../types';

import upgradeComponent from './component';

export interface UpgradableItem {
  type : Tool
}

export default function upgrade(item : UpgradableItem) : Item {
  switch(item.type){
    case 'component':
      return upgradeComponent(item as any);
    default:
      return item as any;
  }
}