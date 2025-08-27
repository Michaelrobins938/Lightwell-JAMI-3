
const { glob } = require('glob');
const crypto = require('crypto');
const fs = require('fs');

const main = async () => {
  const files = await glob('**/*', { nodir: true, ignore: ['node_modules/**', '.git/**'] });
  const hashes = {};

  for (const file of files) {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(file);
    for await (const chunk of stream) {
      hash.update(chunk);
    }
    const hex = hash.digest('hex');

    if (hashes[hex]) {
      hashes[hex].push(file);
    } else {
      hashes[hex] = [file];
    }
  }

  const duplicates = Object.values(hashes).filter(arr => arr.length > 1);

  if (duplicates.length > 0) {
    console.log('Duplicate files found:');
    for (const group of duplicates) {
      console.log(group.join('\n'));
      console.log('---');
    }
  } else {
    console.log('No duplicate files found.');
  }
};

main();
