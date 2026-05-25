export class MyLib {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  show(): string {
    return this.name;
  }
}
