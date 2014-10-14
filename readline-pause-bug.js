#!/usr/bin/env node

// This script is modeled after the 'Tiny CLI' in the readline documentation.
// See http://nodejs.org/api/readline.html#readline_example_tiny_cli
// A few changes have been made to demonstrate that rl.pause() does not
// pause line events. The problem was discovered while trying to get
// the REPL module to produce valid transripts of sessions when the
// input and output for the REPL are file streams.
// While invesigating that problem, I discovered that readline's failure
// to pause line events was the likely root cause.
// See issues: https://github.com/joyent/node/issues/3628
// and https://github.com/joyent/node/issues/8340

'use strict';

var readline = require('./pausable-readline');

var rl = readline.createInterface(process.stdin, process.stdout);

var useAsync = process.argv.length>2 && process.argv[2]==='async';

rl.setPrompt('OHAI> ');
rl.prompt();

rl.on('line', function(line) {

    if (line[line.length-1] == '\n')
      console.error('Line should not end with newline here!!');

    function respond() {
        process.stdout.write('==> ' + line + '\n');
        rl.prompt();
    }

    // Immediately pause input.
    // We now expect to not receive any more line events until a call to rl.resume() or rl.promp().
    // Note that rl.prompt() is called after the response is written in the function respond().
    rl.pause();

    // In a TTY session, stdin is immediately echoed to stdout.
    // When piping to stdout, we want to see a transcript with both the input text and the output (response)
    // text appearing in causal order. So we must write the input to stdout.
    // We do it now, in the 'line' event handler, after rl.pause(), but before the reponse is generated.
    if (!process.stdout.isTTY)
        process.stdout.write(line + '\n');

    if (useAsync)
        setImmediate(respond);
    else
        respond();
});

