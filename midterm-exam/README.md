## CPEN322 Midterm Exam Solutions

You can find solutions to the midterm exam below.


### Multiple Choice

Q1. "Class of the element"

Q2. "Rule 4"

Q3. "Line 3"

Q4. "The handlers must be initialized any time before the end of the current context"

Q5. "Capture handler on the parent of 'd'"

Q6. "'this' is lexically bound in arrow functions, but dynamically bound in regular functions"

### Programming Questions

#### Q7. Closures

**Solution code**: [`q7-solution.js`](q7-solution.js)

```
function cacheArguments( foo, n ) {
    var args = [];
    return function() {
        var count = (arguments.length < n) ? arguments.length : n;
        for (var i=0; i<count; i++) {
            args[i] = arguments[i];
        }
        if (arguments.length<n)
            return foo.apply(this, args);
        else
            return foo.apply(this, arguments);
    }
}
```

**Test script**: [`q7-test.js`](q7-test.js)

You can change the `cacheArguments` function in this script to try out your solution.
The following are command-line arguments to pass for each test case.

1. `'f 1 2 3 {"0":1,"1":2,"2":3}'`
2. `'f 10 20 {"0":10,"1":20,"2":3}'`
3. `'f 1 {"0":1,"1":20,"2":3}'`
4. `'f 1 2 3 4 5 {"0":1,"1":2,"2":3,"3":4,"4":5}'`
5. `'f {"0":1,"1":2,"2":3}'`

Example command for running Test 1 above:
```
node q7-test.js 'f 1 2 3 {"0":1,"1":2,"2":3}'
// should print "true" if test passed
```

* *Note that the single-quote delimiters are important for preventing the shell from automatically escaping the double-quotes.*


#### Q8. DOM Traversal

Solution code: [`q8-solution.js`](q8-solution.js)
HTML Test Page: [`q8.html`](q8.html)

```
function watchTextChange(node, hasChanged){
	if (!node) return 0;
	if (node.classList && node.classList.contains('skip')) return 0;

	let count = 0;
	if (hasChanged(node)){
		count ++;
		node.parentNode.classList.add('changed');
	}

	for (let i = 0; i < node.childNodes.length; i ++){
		let child = node.childNodes[i];
		count += watchTextChange(child, hasChanged);
	}

	return count;
}
```

One-liner (equivalent):
```
function watchTextChange(node, hasChanged){
	return (!node || (node.classList && node.classList.contains('skip'))) ? 0 : Array.from(node.childNodes).reduce((acc, child) => acc + watchTextChange(child, hasChanged), (hasChanged(node) ? (node.parentNode.classList.add('changed'), 1) : 0));
}
```

#### Q9. Objects

**Solution code**: [`q9-solution.js`](q9-solution.js)

```
function newOp(obj, foo, args) {
    var newObj = Object.create(obj);
    var result = foo.apply(newObj, args);
    return (typeof(result) == "object") ? result : newObj;
}

function createCircle(x, y, r) {
    let p = newOp(Point.prototype, Point, [0, 0]);
    return newOp(p, Circle, [x, y, r])
}
```

**Test script**: [`q9-test.js`](q9-test.js)

You can change the `newOp` and `createCircle` functions in this script to try out your solution.
The following are command-line arguments to pass for each test case.

1. `A`
2. `B`

Example command for running Test 1 above:
```
node q9-test.js A
```

Expected output for the tests:

1. `A`:
```
Creates a blank, plain JavaScript object.
Substitutes prototype.
Binds this.
Calls constructor with correct args.
Returns this in the correct case.

```

2. `B`:
```
Creates a blank, plain JavaScript object.
Substitutes prototype.
Binds this.
Calls constructor with correct args.
Returns this in the correct case.
Is not an instanceof Circle.
Is an instanceof Point.

```


#### Q10. Node.js async input handling

**Solution code**: [`q10-solution.js`](q10-solution.js)

```
function countStarWords(inputStream, outputStream, done){
    var numStarWords = 0;
    var state = ' ';
    var beginStarWord = false;

    function handleInputStream(blob) {
        for (var i = 0; i < blob.length; i ++){
            if (state == ' *') {
                if (blob[i] == '*') {
                    state += '*';
                } else {
                    state = '';
                }
            }
            else if (state == ' **') {
                if (blob[i] == ' ') {
                    if (beginStarWord) {
                        numStarWords++;
                        state = ' ';
                        beginStarWord = false;
                    }
                } else {
                    beginStarWord = true;
                }
            } else if (state == ' ') {
                if (blob[i] == '*') {
                    state += '*';
                } else if (blob[i] != ' '){
                    state = '';
                }
            } else {
                if (blob[i] == ' ') {
                    state += ' ';
                } else {
                    state = '';
                }
            }
        }
    }

    function handleOutputStream() {
        if (numStarWords > 10) {
            outputStream.write('-1');
        } else {
            outputStream.write(numStarWords.toString());
        }
        done();
    }

    inputStream.on('data', handleInputStream);
    inputStream.on('end', handleOutputStream);
}
```

**Test script**: [`q10-test.js`](q10-test.js)

You can change the `countStarWords` function in this script to try out your solution.
The following are test files you can pass as command-line arguments.

1. [`q10-inputs/test-0.txt`](q10-inputs/test-0.txt): Expected = 1
2. [`q10-inputs/test-1.txt`](q10-inputs/test-1.txt): Expected = 0
3. [`q10-inputs/test-2.txt`](q10-inputs/test-2.txt): Expected = 0
4. [`q10-inputs/test-3.txt`](q10-inputs/test-3.txt): Expected = 2
5. [`q10-inputs/test-4.txt`](q10-inputs/test-4.txt): Expected = 3
6. [`q10-inputs/test-5.txt`](q10-inputs/test-5.txt): Expected = -1
7. [`q10-inputs/test-6.txt`](q10-inputs/test-6.txt): Expected = 5
8. [`q10-inputs/test-7.txt`](q10-inputs/test-7.txt): Expected = 0
9. [`q10-inputs/test-8.txt`](q10-inputs/test-8.txt): Expected = 0
10. [`q10-inputs/test-9.txt`](q10-inputs/test-9.txt): Expected = 2

Example command for running Test 1 above:
```
node q10-test.js q10-inputs/test-0.txt
```