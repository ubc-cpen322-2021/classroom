'use strict';

if (process.argv.length < 3){
    console.log('Provide test argument');
    process.exit();
}

let part = process.argv[2];

const testsA = {
    'Creates a blank, plain JavaScript object.': () => {
        return JSON.stringify(newOp({}, () => {}, [])) === '{}' 
    },
    'Substitutes prototype.': () => {
        let p = {'test': 'prototype'}
        let result = newOp(p, () => {}, [])
        if (!result) {
            return false
        }
        return Object.getPrototypeOf(result) === p
    },
    'Binds this.': () => {
        let testReference = {'test': 'reference'}
        let c = function() {
            this.testReference = testReference
        }
        let result = newOp({}, c, [])
        if (!result) return false
        return result.testReference === testReference
    },
    'Calls constructor with correct args.': () => {
        let args, reference
        let c = function() {
            reference = this
            args = arguments
        }
        let testArgs = [[0], [1], [2]]
        let result = newOp({}, c, testArgs)
        if (result !== reference) return false
        for (let i = 0; i < Math.max(testArgs.length, args.length); i++) {
            if (args[i] !== testArgs[i]) return false
        }
        return true
    },
    'Returns this in the correct case.': () => {
        let testReference;
        let returnedTestReference = {'test': 'reference'}
        let returner = function() {
            testReference = this
            return returnedTestReference
        }
        let nonReturner = function() {
            testReference = this
        }
        let nonReturner2 = function() {
            testReference = this
            return 1
        }
        let result = newOp({}, nonReturner, [])
        if (result !== testReference) return false
        result = newOp({}, returner, [])
        if (result !== returnedTestReference) return false
        result = newOp({}, nonReturner2, [])
        if (result !== testReference) return false
        return true
    }
}

const tests = {
    'A': testsA,
    'B': {
        ...testsA,
        'Is not an instanceof Circle.': () => {
            let result = createCircle(1, 2, 3);
            return !(result instanceof Circle)
        },
        'Is an instanceof Point.': () => {
            let result = createCircle(1, 2, 3);
            return result instanceof Point
        },
    }
}

var Point = function (x, y) {
   this.x = x;
   this.y = y;
   this.area = function() {
       return 0;
   }
}; 
 
Point.prototype.toString = function() {
   return "(" + this.x + "," + this.y + ")";
};
 
var Circle = function(x, y, r) {
   Point.call(this, x, y);
   this.r = r;
   this.area = function() {
       return 3.1412 * this.r * this.r;
   }
};

function newOp(obj, foo, args) {
    // create a new plain object, and set its prototype too
    var newObj = Object.create(obj);

    // call the constructor with the passed parguments, 
    // while binding the newly creatd object as this
    var result = foo.apply(newObj, args);

    // if the return value of the constructor is an object, return it
    return (typeof (result) == "object") ? result : newObj;
}

function createCircle(x, y, r) {
    // instantiate a point to use it as a prototype
    let p = newOp(Point.prototype, Point, [0, 0]);

    // instantiate a Circle using the created point as the prototype,
    // so the circle becomes an instance of Point
    return newOp(p, Circle, [x, y, r])
}


for (let testKey in tests[part]) {        
    if (tests[part][testKey]())
        process.stdout.write(testKey + '\n');
    else
        process.stdout.write('\n');
}