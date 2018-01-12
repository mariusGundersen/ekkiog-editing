interface Array<T> {
  filter<U extends T>(pred: (e : T, i : number, c : T[]) => e is U): U[];
}