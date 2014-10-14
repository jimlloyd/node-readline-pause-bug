.PHONY: test

test : test.sync.output test.async.output
	diff --side-by-side test.sync.output test.async.output && echo "All is well!"

test.sync.output : FORCE
	node readline-pause-bug.js < test.input > test.sync.output

test.async.output : FORCE
	node readline-pause-bug.js async < test.input > test.async.output

clean:
	rm -f test.sync.output test.async.output differences.txt

async :
	node readline-pause-bug.js async < test.input

FORCE:
