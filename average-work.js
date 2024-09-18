/*const Blockchain = require('./blockchain');

const blockchain = new Blockchain();

blockchain.addBlock({ data: 'initial' });

console.log('first block', blockchain.chain[blockchain.chain.length-1]);

let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average;

const times = [];

for (let i=0; i<10000; i++) {
  prevTimestamp = blockchain.chain[blockchain.chain.length-1].timestamp;

  blockchain.addBlock({ data: `block ${i}`});
  nextBlock = blockchain.chain[blockchain.chain.length-1];

  nextTimestamp = nextBlock.timestamp;
  timeDiff = nextTimestamp - prevTimestamp;
  times.push(timeDiff);

  average = times.reduce((total, num) => (total + num))/times.length;

  console.log(`Time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}ms`);
}*/
const Blockchain = require('./blockchain');

const blockchain = new Blockchain();

blockchain.addBlock({ data: 'initial' });

console.log('first block', blockchain.chain[blockchain.chain.length-1]);

let prevTimestamp, nextTimestamp, nextBlock, timeDiff;
let totalTime = 0;  // To store cumulative time

const times = [];

for (let i = 0; i < 10000; i++) {
  prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;

  blockchain.addBlock({ data: `block ${i}` });
  nextBlock = blockchain.chain[blockchain.chain.length - 1];

  nextTimestamp = nextBlock.timestamp;
  timeDiff = nextTimestamp - prevTimestamp;
  times.push(timeDiff);

  totalTime += timeDiff;  // Add time difference to totalTime
  let average = totalTime / times.length;  // Calculate running average

  // Consider logging only every 100 blocks to reduce noise
  if (i % 100 === 0) {
    console.log(`Time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}ms`);
  }
}
