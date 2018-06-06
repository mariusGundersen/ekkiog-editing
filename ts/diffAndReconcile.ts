import { diff } from 'ennea-tree';
import { TreeNode, MutableContext } from './types';
import reconcile from './reconciliation/reconcile';

export default function diffAndReconcile(before : TreeNode, after : TreeNode, context : MutableContext){
  const changes = diff(before, after);
  return reconcile(context, changes);
}