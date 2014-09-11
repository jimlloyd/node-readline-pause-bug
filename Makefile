.PHONY: test

default: differences.txt
	cat differences.txt

differences.txt : test.sync.output test.async.output
	diff --side-by-side test.sync.output test.async.output > differences.txt || true

test.sync.output : readline-pause-bug.js test.input
	node readline-pause-bug.js < test.input > test.sync.output

test.async.output : readline-pause-bug.js test.input
	node readline-pause-bug.js async < test.input > test.async.output

clean:
	rm -f test.sync.output test.async.output differences.txt

