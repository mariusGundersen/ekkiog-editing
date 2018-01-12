import {
  Component
} from '../types';

export default function upgradeComponent(component : Partial<Component>) : Component {
  const schema : number = component.schema || 0;

  switch(schema){
    //@ts-ignore
    case 0:
      component = {
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
      } as Component;
    //@ts-ignore
    case 1:
      component = {
        ...component,
        displays: []
      };
    default:
      return component as Component;
  }
}