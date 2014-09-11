node-readline-pause-bug
=======================

Note: failing Travis build due to readline bug:
[![Build Status](https://travis-ci.org/jimlloyd/node-readline-pause-bug.svg)](https://travis-ci.org/jimlloyd/node-readline-pause-bug)

A demonstration of a bug in node's readline.

Run 'make' to produce output demonstrating the bug.
The script readline-pause-bug.js is run twice, once with the default
option to generate responses synchronously, and again with the option
to generate responses asynchronously using setImmediate to defer the
response.

After generating both outputs, diff --side-by-side is run to show
the differences.

The script is modeled after the 'Tiny CLI' in the readline documentation.
See http://nodejs.org/api/readline.html#readline_example_tiny_cli
A few changes have been made to demonstrate that rl.pause() does not
pause line events. The problem was discovered while trying to get
the REPL module to produce valid transripts of sessions when the
input and output for the REPL are file streams.
While invesigating that problem, I discovered that readline's failure
to pause line events was the likely root cause.
See issues: https://github.com/joyent/node/issues/3628
and https://github.com/joyent/node/issues/8340
