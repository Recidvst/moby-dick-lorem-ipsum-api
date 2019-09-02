function reduceIDs(arr) {
  if (arr === undefined || !arr.isArray) return 0;
  return arr.reduce((prev, current) => (prev.id > current.id) ? prev : current).id;
}

// const slug = process.argv[2]
// const firstArray = process.argv[3]
// let secondArray = process.argv[4]

// pass parsed JSON into here as array
let iteration = reduceIDs(firstArray);

if (iteration) {
  secondArray.forEach( (item) => {
    item.id = iteration;
    iteration++:
  });
}

console.log(firstArray);
console.log(secondArray);
