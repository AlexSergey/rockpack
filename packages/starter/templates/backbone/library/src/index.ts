class HelloWorld {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  show(): string {
    return this.name;
  }
}

// eslint-disable-next-line @import-lite/no-default-export
export default HelloWorld;
