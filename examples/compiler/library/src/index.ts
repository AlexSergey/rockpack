export class MyLib {
  private readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  show(): string {
    return this.name;
  }
}
