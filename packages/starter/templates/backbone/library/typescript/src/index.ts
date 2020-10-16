class HelloWorld {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  show(): string {
    return this.name;
  }
}

export default HelloWorld;
