function* idMaker() {
  var index = 0;
  while (index < 3)
    yield index++;
}

const timeout = (delay) => (
  new Promise(resolve => {
    setTimeout(resolve, delay);
  })
)

export {
  idMaker,
  timeout
}
