[<< Back to Main](README.md)

# Part 3: Exchanging Data with the Server

This assignment builds on the work you have done for [Assignment 2](assignment-2.md).

In this part, you will be implementing mechanisms to exchange data with the server. Here is a high-level overview of what you will be doing:

* Implement the client-side functionalities to read and update the list of chat rooms from the server via AJAX requests.
* Implement a WebSocket client to send and receive messages from the WebSocket server.
* Implement a WebSocket server to act as a message broker between the client applications.

**We continue to prohibit the use of third-party JavaScript frameworks, except those specifically mentioned, such as Express.js on the server side.**


## Directory Structure

Same as previous assignments. If you still have `client/chat.html` and `client/profile.html`, you can delete them.

```
/client/
    /assets/
    /index.html
    /style.css
    /app.js
/server.js
/package.json
```

All your server-side code for this assignment goes in `server.js`.


## Tools

During development, you will need to restart the server after you make changes to your server-side code. This can be distracting when you're making frequent changes. To make your development experience pleasant, you can use an NPM module named `nodemon`, which watches your files and restarts the server automatically. We allow the use of this module from this assignment onwards.

*When you install this module, make sure you install it with the `--save-dev` flag to indicate that this module is only used during development, or `--no-save` flag to exclude it entirely from the application dependencies list*.

You can install this package like below:

```
npm install --save-dev nodemon
```

and then use it to serve your application:
```
nodemon server.js
```

Depending on your NodeJS installation, you may have to add the `node_modules/.bin` directory to your `PATH` environment variable.


## Tasks

1. (5 Points) [JS (`app.js`)] In this task, you will fetch the list of rooms (as a JSON object) from the server by making an AJAX request. All the subtasks (1.A ~ 1.E) are to be done in `app.js`.
    * A) Define an object (associative array) in the global scope named `Service`. This object will store functions you can call to make different requests to the server.
    * B) In the `Service` object, add an `origin` property to store the URL of your server as a string. The format should be the same as [`window.location.origin`](https://www.w3schools.com/jsref/prop_loc_origin.asp). *In case you do not host your server locally (i.e., localhost), the test script checks your value against `window.location.origin`*
    * C) In the `Service` object, define a function named `getAllRooms` that does not take any arguments.
        * i. This function should make an AJAX request to `Service.origin + "/chat"` URL and return a `Promise` that resolves to the JSON response data. *Note the lack of "#" - this URL is a server-side endpoint*
        * ii. In case of client-side error, the `Promise` should reject with the error that was caught.
        * iii. In case of server-side error (i.e., the server returns a response that does not have HTTP status 200), the `Promise` should reject with a newly created `Error` containing any message from the server.
        * *You can either use the [`XMLHttpRequest` API](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), or the [`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) that most modern browsers support.*
    * D) Now that you can read the list of rooms from the server, you will use the `getAllRooms` function to fetch the list of rooms, then render it in your view dynamically. *Note that this `getAllRooms` function is asynchronous, and you will not obtain the list of rooms in the return value. Rather, the returned list will be available as the first argument in the callback you pass to `Promise.prototype.then(callback)` method.*
        * i. Update the `Lobby` constructor so that `rooms` property is set to an empty object.
        * ii. Define a function named `refreshLobby` inside the `main` function, which takes zero arguments.
        * iii. In `refreshLobby`, call the `getAllRooms` function you just created to make an AJAX request to the server. When the returned `Promise` resolves, update `lobby.rooms` object by iterating through the array of rooms just received from the server. Note that the server returns an `Array` while `lobby.rooms` is an `Object` (associative array). Make sure you do not replace the `lobby.rooms` object itself, but rather update each individual `Room` instances inside it. If a `Room` already exists, update the name and image. If a `Room` does not exist, call `lobby.addRoom` method to add the new room.
        * iv. Call `refreshLobby` once inside the `main` function.
    * E) In the `main` function, create a timer using `setInterval`, and periodically refresh the list of chat rooms by calling `refreshLobby`.


2. (4 Points) [JS (`server.js`)] Now that you can request the server for data, you will create the server-side `GET` endpoint to handle the requests.
    * A) In `server.js`, create a variable named `chatrooms` and then assign an *Array* of objects (*Associative Arrays*) with the following properties: `id`, `name`, `image`. You can assign arbitrary values to each of the properties, given that `id` is unique. These objects are similar to the `Room` objects, but without any methods. *Note the lack of `messages` property* - we will use another object to store the messages separately.
    * B) In `server.js`, create a variable named `messages` and then assign an *Associative Array*. This object will store the messages for each of the rooms, using the room `id` as the key. For each of the rooms in the `chatrooms` array, create a corresponding empty array in the `messages` object, indexed by the room `id`.
    * C) Define an Express.js `GET` endpoint at the path `/chat` using the Express.js API method `route`. You can refer to the [Express.js API documentation (v.4)](https://expressjs.com/en/4x/api.html#app.route) to learn how to use it. The `GET` endpoint should return an array of objects with the properties `id`, `name`, `image`, `messages`, built from the `chatrooms` array and the `messages` object. *Make sure you do not modify the original objects* inside `chatrooms` array.

3. (4 Points) [JS] Previously, when you refreshed the page on your client-side application, the array of chatrooms would be reset because any updates to the array is local to the browser. In this task, you will make an AJAX `POST` request to update the data on the server.
    * A) In the `Service` object in the client-side app (`app.js`), define a function named `addRoom` that takes a single argument `data`. `data` will be an object (associative array) containing 2 fields: `name`, and `image`. In the `Service.addRoom` function, make a `POST` request to the `Service.origin + "/chat"` endpoint, with the given `data` in the request payload. Set the `Content-Type` header to `application/json`, and make sure you serialize the object into a JSON string.
    * B) In `server.js`, define a `POST` endpoint in the same `route` as the `GET` endpoint from Task 2. The `POST` request handler should inspect the `data` object sent by the client, validate that it has at least the `name` field, then proceed with the following:
        * i. If the data does not have a `name` field, then respond with HTTP status 400 and provide an error message.
        * ii. If the data does have a `name` field, then create an associative array - with fields `id`, `name`, and `image` - to represent a room. Generate a new unique ID for this object and assign it to the `id` field. For the `name` and `image` fields, assign the data received from the client. After you create this object, add it to the `chatrooms` array. In addition, add an empty array in the `messages` object, using the newly generated room ID as the key. Finally, respond with HTTP status 200, sending the newly created room object as a JSON string.
    * C) As a last step, we need to call the `Service.addRoom` function from the client-side app when the "Create Room" button is clicked. Locate the `click` event handler you created from assignment 2 (in the `LobbyView` class), in which you called `this.lobby.addRoom`. Update the handler to call `Service.addRoom` instead, passing in the appropriate arguments. Only after the server returns a response without errors, call the `this.lobby.addRoom` method with the appropriate arguments.

4. (3 Points) [JS (`app.js`)] By now, the lobby view should be fully functional. In this task, you will implement the chat functionality, using `WebSocket` to immediately relay information between client applications. For AJAX requests, you would have noticed that the server cannot send messages to the client unless the client sends a request first. This is a typical client-server request-response protocol. In modern web applications, we want a more flexible bi-directional communication where the server is also able to push data to the client. `WebSocket`s allow you to do just that. Using a `WebSocket` object on the client side, the client application can send messages to the server as usual, but can also "listen" to messages from the server. On the server side, there would be a WebSocket server, that maintains connections to multiple `WebSocket` clients. In this task, you will first create the WebSocket client.
    * A) In the `main` function, create a variable named `socket` and assign a new `WebSocket` instance, connecting to the appropriate WebSocket server endpoint (`ws://localhost:8000` if you used port 8000). *Since you don't have the server side implemented yet, you may encounter connection errors. This is normal. If you want to just test your connection, you can connect to the WebSocket test server at `99.79.42.146:8000`*
    * B) Attach a `message` event handler on the `WebSocket` instance. Inside the event handler, you will need to do the following:
        * i. Parse the given message passed in the argument. The message is a serialized JSON string and will have 3 fields: `roomId`, `username`, and `text`.
        * ii. Based on the `roomId`, get the appropriate `Room` object using `Lobby.getRoom` method you implemented from assignment 2. Then add the message in the `Room` object using `Room.addMessage` method.
    * C) Modify the contructor of `ChatView` class to accept a single argument `socket`. It should store a reference to the given `socket` object in its property with the same name `socket`. Then, modify the existing instantiation of `chatView` to use the `socket` object created in Task 4A.
    * D) Modify the `sendMessage` method of `ChatView`. In addition to all the code you have from assignment 2 (you won't need to remove any code, provided you have implemented it correctly in the previous assignment), send the message to the server using the `this.socket` object. The message should be an object with 3 fields: `roomId`, `username`, `text`. Make sure you serialize the object into a JSON string.

5. (4 Points) [JS (`server.js`)] In this task, you will make the "chat view" fully functional by implementing a `WebSocket` server to act as a message broker between the clients.
    * A) Install the [`ws` module from NPM](https://www.npmjs.com/package/ws) (*this is one of the 3rd-party modules we require you to use*. `ws` is the de-facto WebSocket module providing a high-level API for essential WebSocket operations. While you can technically implement a WebSocket using the Node.js built-in `net` module, conforming to the WebSocket protocol specifications requires a lot of effort, and we do not want to reinvent the wheel here).
    * B) Inside `server.js`, require the `ws` library. Then, create a variable named `broker` and assign a `ws.Server` instance. Use a different port (e.g., 8000) than the `express` server. You can refer to the [`ws` API documentation on Github](https://github.com/websockets/ws#simple-server). *The client-side test script will use the address `ws://localhost:8000` by default. If you wish to use a different address, configure the test script by calling `cpen322.setDefault('webSocketServer', URL)` in `app.js`*
    * C) The WebSocket server's role is to simply act as a message broker between the clients. For example, assuming 3 clients - A, B, and C - are connected, if client A sends a message, it will relay the message to clients B and C. Whenever a new client connects to the WebSocket server, a `connection` event is raised. The `connection` event handler for the `ws.Server` object receives the newly connected client socket as the argument. Inside the `connection` event handler, you define what to do with each client. When any client sends a message (`message` event), iterate through the `broker.clients` set and forward the message to each client, *except to the client that sent the message*. Additionally, parse the message and then push it into the corresponding array in the `messages` object you created in Task 2. Remember that the `messages` object stores arrays of messages for each room, indexed by the `roomId`.
    * *You can verify that the chat functionality now works by opening multiple tabs in the browser and entering some text in the chat view. Alternatively, if your smartphone and laptop/desktop are in the same home network, you can test it using your smartphone by opening the application at your laptop/desktop's local IP*
    


## Testing

Now that you're working on a "full-stack" implementation (client & server), there are 2 different test scripts, one for the server and another for the client. The 2 scripts are meant to work together, so you will need to set up both in order for the tests to work properly.

### Client-side

**Insert the following script tag within the `head` tag of your page, BEFORE your `app.js`. It is important that the test script is loaded synchronously before your application script for it to work correctly.**
```
<script src="http://99.79.42.146/cpen322/test-a3.js" type="text/javascript"></script>
```

**In addition to adding the script tag above,** you will need to inject some tester code to expose some of the objects accessed during the test. The testing interface is designed this way because there is no way for a third-party script (i.e. the test script) to observe closure variables unless you expose them explicitly.

For example, in Task 1 you are asked to declare a local function `refreshLobby` inside the `main` function. If you do not expose the name `refreshLobby` from within the `main` function, there is simply no way for the tester to observe `refreshLobby` since it is a closed variable. To make such variables available, you must invoke the `cpen322.export` function as shown below.

```
// assuming we want to expose `refreshLobby` and `lobby` from inside `main`

// traditional syntax
function main(){
    /* other code */

    cpen322.export(arguments.callee, {
        refreshLobby: refreshLobby,
        lobby: lobby
    });
}

// concise ES6 property shorthand syntax
function main(){
    /* other code */

    cpen322.export(arguments.callee, { refreshLobby, lobby });
}
```

You will see a red button on the top-right corner of your web page. Click it to test your code.
Watch out for any alert messages or console output, which tell you any missing components/functionalities. You are responsible for ensuring that all the functionalities above are implemented correctly - the tests are only there to help you. We reserve the right to test your code with other test cases than the above.

The test script uses certain default values during the test.
* WebSocket server URL - the test script expects that your WebSocket server is at `"ws://localhost:8000"`.
* Default room image URL - the test script expects the default image URL to be `"assets/everyone-icon.png"`.

To set a different default value for your application, you can use `cpen322.setDefault` as shown below:
```
cpen322.setDefault("webSocketServer", YOUR_SERVER_URL);
cpen322.setDefault("image", YOUR_IMAGE_URL);
```


### Server-side

**Download this [`cpen322-tester.js`](tests/cpen322-tester.js) script and place it in your project directory. Then in `server.js`, import the tester module as shown below:**
```
// assuming cpen322-tester.js is in the same directory as server.js
const cpen322 = require('./cpen322-tester.js');

/* your code */

// at the very end of server.js
cpen322.connect('http://99.79.42.146/cpen322/test-a3-server.js');
cpen322.export(__filename, { app });
```

Similar to the client-side script, you will need to call some tester code to expose some of the objects accessed during the test. *Note that the first argument to `cpen322.export` is `__filename` and not `arguments.callee`*.


## Marking

There are 5 tasks for this assignment (Total 20 Points):
* Task 1: 5 Points
* Task 2: 4 Points
* Task 3: 4 Points
* Task 4: 3 Points
* Task 5: 4 Points


## Submission instructions:

Copy the **commit hash** from Github and enter it in Canvas.

For step-by-step instructions, refer to [the tutorial](canvas-submission.md).


### Deadline:

These deadlines will be strictly enforced by the assignment submission system (Canvas).

* Sunday, Nov 7, 2021 23:59:59 PST
