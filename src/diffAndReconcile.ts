import { diff } from 'ennea-tree';
import { TreeNode, Context } from './types';
import reconcile from './reconciliation/reconcile';

export default function diffAndReconcile(before : TreeNode, after : TreeNode, context : Context){
  const changes = diff(before, after);
  return reconcile(context, changes);
}