// filesystem
const fs = require('fs');

// get the highest id value from an array
function reduceIDs(arr) {
  if (arr === undefined || !Array.isArray(arr)) return 0;
  return arr.reduce((prev, current) => (prev.identifier > current.identifier) ? prev : current).identifier;
}

// read from file and return readable data
function readFromFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, function (err, data) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        resolve(JSON.parse(data));
      }
    });
  });
}

// target array
let combinedArray = [];

// passed arguments arrays
let argumentArrays = [process.argv[3], process.argv[4]];
let promiseArr = [];

argumentArrays.forEach( (arr, i) => {
  let promise = readFromFile(arr);
  promiseArr.push(promise);
});

Promise.all(promiseArr)
.then( (values) => {
  console.log('Files read');
  let arrayOne = values[0];
  let arrayTwo = values[1];

  // restart the second array's IDs at the end of the first array's IDs
  let iteration = reduceIDs(arrayOne);

  if (iteration) {
    arrayTwo.forEach( (item) => {
      iteration++;
      item.identifier = iteration;
    });
  }

  for (let a = 0; a < arrayOne.length; a++) {
    combinedArray.push(arrayOne[a]);
  }
  for (let b = 0; b < arrayTwo.length; b++) {
    combinedArray.push(arrayTwo[b]);
  }

  // parse combined array to json
  let combinedParsed = JSON.stringify(combinedArray, null, 4);

  // get comma-less pseudo json for mLab import...
  let combinedStripped = combinedArray.map( item => {
    return JSON.stringify(item);
  }).join("\n");

  // write combined output to new files
  fs.writeFile(`content/combined-alice-in-wonderland-${process.argv[2]}.json`, combinedParsed, function(err) {
    console.log('Json file written!');
  });
  fs.writeFile(`content/combined-alice-in-wonderland-${process.argv[2]}.txt`, combinedStripped, function(err) {
    console.log('String file written!');
  });
});
