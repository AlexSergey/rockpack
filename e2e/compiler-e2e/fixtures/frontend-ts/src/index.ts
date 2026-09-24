type Tagged = { tag?: string };

const tagged = <T extends abstract new () => object>(target: T): T => {
  (target as unknown as Tagged).tag = 'decorated';

  return target;
};

@tagged
class Widget {
  readonly name: string = 'widget';
}

document.title = `${new Widget().name}:${String((Widget as unknown as Tagged).tag)}`;
