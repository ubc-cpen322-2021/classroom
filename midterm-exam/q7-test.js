'use strict';

if (process.argv.length < 3){
    console.log('Provide test argument');
    process.exit();
}

function cacheArguments( foo, n ) {
    var args = [];
    return function() {
        var count = (arguments.length < n) ? arguments.length : n;
        for (var i = 0; i < count; i ++) {
            args[i] = arguments[i];
        }
        if (arguments.length < n)
            return foo.apply(this, args);
        else
            return foo.apply(this, arguments);
    }
}

function runTest3(testFunc, testArg1, testArg2, testArg3, testReturnVal) {
    
    let cacheEnabledFunc = cacheArguments(testFunc, 3);
    
    // call cacheEnabledFunc 
    let result1 = cacheEnabledFunc(testArg1, testArg2, testArg3);
    let result = JSON.stringify(result1);
    process.stdout.write(String(result === testReturnVal));
}

function runTest2(testFunc, testArg1, testArg2, testReturnVal) {
    
    let cacheEnabledFunc = cacheArguments(testFunc, 3);
    
    // call cacheEnabledFunc 
    let result1 = cacheEnabledFunc(1, 2, 3);
    let result2 = cacheEnabledFunc(testArg1, testArg2);
    let result = JSON.stringify(result2);
    process.stdout.write(String(result === testReturnVal));
}

function runTest1(testFunc, testArg1, testReturnVal) {
    
    let cacheEnabledFunc = cacheArguments(testFunc, 3);
    
    // call cacheEnabledFunc 
    let result1 = cacheEnabledFunc(1, 2, 3);
    let result2 = cacheEnabledFunc(10,20);
    let result3 = cacheEnabledFunc(testArg1);
    let result = JSON.stringify(result3);
    process.stdout.write(String(result === testReturnVal));
}

function runTest5(testFunc, testArg1, testArg2, testArg3, testArg4, testArg5, testReturnVal) {
    
    let cacheEnabledFunc = cacheArguments(testFunc, 3);
    
    // call cacheEnabledFunc 
    let result1 = cacheEnabledFunc(1, 2, 3);
    let result2 = cacheEnabledFunc(10,20);
    let result3 = cacheEnabledFunc(1);
    let result4 = cacheEnabledFunc(testArg1, testArg2, testArg3, testArg4, testArg5);
    let result = JSON.stringify(result4);
    process.stdout.write(String(result === testReturnVal));
}

function runTest(testFunc, testReturnVal) {
    
    let cacheEnabledFunc = cacheArguments(testFunc, 3);
    
    // call cacheEnabledFunc 
    let result1 = cacheEnabledFunc(1, 2, 3);
    let result2 = cacheEnabledFunc(10,20);
    let result3 = cacheEnabledFunc(1);
    let result4 = cacheEnabledFunc(1, 2, 3, 4, 5);
    let result5 = cacheEnabledFunc();
    let result = JSON.stringify(result5);
    process.stdout.write(String(result === testReturnVal));
}

let tokens = process.argv[2].split(' ');

const testFunc = {
        f: function f(){
            return arguments;
        }
    };
if(tokens.length==5){
    let funcName = tokens[0];
    let funcArg1 = parseInt(tokens[1]);
    let funcArg2 = parseInt(tokens[2]);
    let funcArg3 = parseInt(tokens[3]);
    let funcReturnVal = String(tokens[4]);
    runTest3(testFunc[funcName], funcArg1, funcArg2, funcArg3, funcReturnVal);
}
else if(tokens.length == 4){
    let funcName = tokens[0];
    let funcArg1 = parseInt(tokens[1]);
    let funcArg2 = parseInt(tokens[2]);
    let funcReturnVal = String(tokens[3]);
    runTest2(testFunc[funcName], funcArg1, funcArg2, funcReturnVal);
}
else if(tokens.length == 3){
    let funcName = tokens[0];
    let funcArg1 = parseInt(tokens[1]);
    let funcReturnVal = String(tokens[2]);
    runTest1(testFunc[funcName], funcArg1, funcReturnVal);
}
else if(tokens.length == 7){
    let funcName = tokens[0];
    let funcArg1 = parseInt(tokens[1]);
    let funcArg2 = parseInt(tokens[2]);
    let funcArg3 = parseInt(tokens[3]);
    let funcArg4 = parseInt(tokens[4]);
    let funcArg5 = parseInt(tokens[5]);
    let funcReturnVal = String(tokens[6]);
    runTest5(testFunc[funcName], funcArg1, funcArg2, funcArg3, funcArg4, funcArg5, funcReturnVal);
}
else if(tokens.length == 2){
    let funcName = tokens[0];
    let funcReturnVal = String(tokens[1]);
    runTest(testFunc[funcName], funcReturnVal);
}