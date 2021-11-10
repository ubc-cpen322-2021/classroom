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