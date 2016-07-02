
export default class Symbol {

  private _name: string;
  private _stack: string[];

  constructor(name: string, stack: string[]) {
    this._name = name;
    this._stack = stack;
  }

  get name(): string {
    return this._name;
  }

  get stack(): string[] {
    return this._stack;
  }
}
