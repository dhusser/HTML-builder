const readline = require('readline'),
  fs = require('fs'),
  path = require('path'),
  file = path.join(__dirname, 'text.txt'),
  io = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

io.on('SIGINT', () => {
  console.log('\nGood Luck!\n');
  io.close();
  return;
});

fs.writeFile(file, '', (err) => {
  if (err) throw err;
  startPrompt();
});

function startPrompt() {
  io.question('Enter the text to add to the file (to exit, type \'exit\' or press ctrl + c): ', answer => {
    if (answer === 'exit') {
      console.log('\nGood Luck!\n');
      io.close();
      return;
    };

    fs.appendFile(file, answer + '\n', (err) => {
      if (err) throw err;
      console.log('\nFile saved successfully!\n');
      startPrompt();
    });

  });
};