function* idMaker(): Generator<number> {
  let index = 0;
  while (index < 3) yield index++;
}

const timeout = (delay: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, delay);
  });

export { idMaker, timeout };
