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
