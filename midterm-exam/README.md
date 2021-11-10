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

Solution code: [`q7-solution.js`](q7-solution.js)

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

Solution code: [`q9-solution.js`](q9-solution.js)

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


#### Q10. Node.js async input handling

Solution code: [`q10-solution.js`](q10-solution.js)

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