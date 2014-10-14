var rl = require('readline');
var inherits = require('util').inherits;
var es = require('event-stream');

var Interface = rl.Interface;

function PausableInterface(input, output, completer, terminal) {
  var self = this;
  this.rawinput = input;
  this.splitter = es.split();
  this.lineReader = this.rawinput.pipe(this.splitter);
  this.wrappedInput = this.lineReader
    .pipe(es.map(function(line, cb) {
      if (line.indexOf('\n') !== -1) {
        console.error('Line should not have newlines here!:', line);
      }
      self.lineReader.pause();
      setImmediate(cb, null, line+'\n');
    })
  );

  Interface.call(this, this.wrappedInput, output, completer, terminal);

  if (terminal) {
    this._setRawMode(this.rawinput);
    rl.emitKeypressEvents(this.rawinput);
    rl.emitKeypressEvents(this.lineReader);
    rl.emitKeypressEvents(this.splitter);
    rl.emitKeypressEvents(this.wrappedInput);
  }
}

inherits(PausableInterface, Interface);

exports.createInterface = function(input, output, completer, terminal) {
  if (arguments.length === 1) {
    // an options object was given
    output = input.output;
    completer = input.completer;
    terminal = input.terminal;
    input = input.input;
  }

  return new PausableInterface(input, output, completer, terminal);
};

PausableInterface.prototype.pause = function() {
  if (this.paused) return;
  this.lineReader.pause();
  this.paused = true;
  this.emit('pause');
  return this;
};

PausableInterface.prototype.resume = function() {
  if (!this.paused) return;
  this.lineReader.resume();
  this.paused = false;
  this.emit('resume');
  return this;
};

PausableInterface.prototype.prompt = function(preserveCursor) {
  if (this.paused) this.resume();
  if (this.terminal) {
    if (!preserveCursor) this.cursor = 0;
    this._refreshLine();
  } else {
    this.output.write(this._prompt);
  }
};
