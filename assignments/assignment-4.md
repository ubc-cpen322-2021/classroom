[<< Back to Main](README.md)

# Part 4: Data Persistence using MongoDB

This assignment builds on the work you have done for [Assignment 3](assignment-3.md).

You will have noticed in the previous assignment that when you restart the server, the chatroom list is reset and the chat messages are gone. In this assignment, you will be implementing mechanisms to persist data in the server. Here is a high-level overview of what you will be doing:

* Set up a MongoDB database for the application
* Write a "driver" for interacting with the MongoDB service.
* Create REST endpoints for reading objects from the database.

**We continue to prohibit the use of third-party JavaScript frameworks, except those specifically mentioned, such as Express.js on the server side.**.


## Directory Structure

Same as previous assignments. If you still have `client/chat.html` and `client/profile.html`, you can delete them.

```
/client/
    /assets/
    /index.html
    /style.css
    /app.js
/Database.js    (ADDED in this assignment)
/server.js
/package.json
```

All your server-side code for this assignment goes in `server.js`.
In addition, you will be implementing `Database.js` - we provide the [initial implementation here](src/Database.js).


## Tasks

We use the following object schemas to describe the structure of objects:
```
Room = {
    "_id": String | ObjectId(String),
    "name": String,
    "image" : String
}

Message = {
    "username": String,
    "text": String
}

Conversation = {
    "_id": ObjectId(String),
    "room_id": String,
    "timestamp": Number,
    "messages": [ Message, Message, Message, ... ]
}
```
For example, when we refer to a "`Room` object" in the instructions below, we mean an object with fields `"_id"`, `"name"`, and `"image"` as shown in the schema above.

0. [Dependency] As the first step, you will need to install MongoDB. You can download the latest [MongoDB Community Server, provided as free and open source software at mongodb.com](https://www.mongodb.com/try/download/community). Once you have installed MongoDB, also install the MongoDB JavaScript driver from NPM: `npm install mongodb`. You can refer to the official ["Quick Start" guide](https://docs.mongodb.com/drivers/node/quick-start#add-mongodb-as-a-dependency).
    * We provide a [MongoDB script](src/initdb.mongo) to initialize your database with some initial data. You are not *required* to use this script, but you will be responsible for managing the structure of all the database objects, and configuring the test script accordingly. To run the MongoDB script, start the MongoDB Shell by entering `mongo` in the command line (make sure the MongoDB service is running). Once in the MongoDB Shell, load the script by typing: `load("initdb.mongo")`. This script will set up 2 Collections -  `chatrooms` and `conversations` - with some initial data. At any point during development, you can reset the database to the initial state by re-running this script.

1. (1 Points) [JS] We can use the `mongodb` library to interact with the database. However, the [API provided by the module](https://mongodb.github.io/node-mongodb-native/3.6/api/) are quite low-level and we want to abstract out these details so we don't have to call the low-level methods all the time. In this assignment you will write a `Database` object that will carry out the low-level queries. We have provided an [initial implementation of `Database`](src/Database.js), whose methods you will complete. In `server.js`, declare a variable `db`, assigning a `Database` instance initialized with the appropriate arguments (`mongoUrl` is the address of the MongoDB service you want to connect to -- e.g., `mongodb://localhost:27017` by default. Look in `initdb.mongo` to find out the `dbName` argument). If the `Database` instance successfully connects to the MongoDB service, you should see in the NodeJS console: `[MongoClient] Connected to ${mongoUrl}/${dbName}`.

2. (5 Points) [JS] In this task, we want to make the application read the list of `Room`s from the database.
    * A) In `Database.js`, complete the implementation of `Database.prototype.getRooms`.
        * It does not accept any arguments.
        * It should find documents in the MongoDB `chatrooms` collection, and return a Promise that resolves to an array of `Room` objects.
    * B) In `server.js`, initialize the `messages` object as you have done in the previous assignment, but this time based on the results from `db.getRooms` (initialize an empty array for each `Room`, using the `Room` ID as the key). **Note** that MongoDB API will use the key `_id` for the database objects and not `id`. You will have to update your client side app accordingly to use `_id` instead of `id` -- if you have followed the instructions closely up to this point, you will only have to modify `refreshLobby` and the `"click"` handler in the `LobbyView`.
    * C) In `server.js`, update the `/chat` endpoint's `GET` request handler to get the list of chat rooms using `db.getRooms` method you just implemented. You can now remove the `chatrooms` variable you have defined in Assignment 3. It should still return an array built from combining the `messages` object with the result of `db.getRooms` (consistent with Assignment 3).
    * D) In `Database.js`, complete the implementation of `Database.prototype.getRoom`.
        * It should accept a single argument `room_id`, which can either be a `String` or a `mongodb.ObjectID`. In case the given argument is ambiguous, `mongodb.ObjectID` type should get priority -- i.e., if there are 2 documents: **A** with ID = `"11111111"` and **B** with ID = `ObjectID("11111111")`, **B** should be returned.
        * It should find a single document in the MongoDB `chatrooms` collection that has the `_id` equal to the given `room_id`, and return a Promise that resolves to the document found.
        * If the document does not exist, the Promise should resolve to `null`.
    * E) In `server.js`, create a new `GET` endpoint `/chat/:room_id` where `room_id` is a dynamic route parameter ([see Express.js documentation](https://expressjs.com/en/guide/routing.html#route-parameters)). In the request handler, search for the `Room` in the database using the `db.getRoom` method you just implemented in Task 1.D. If the `Room` was found, send it back to the client. If the `Room` was not found, return HTTP 404 with an error message (e.g., `"Room X was not found"`)

3. (3 Points) [JS] In this task, we want to make the application write a `Room` to the database.
    * A) In `Database.js`, complete the implementation of `Database.prototype.addRoom`.
        * It should accept a single argument `room`, which is a `Room` object with or without the `_id` field.
        * It should insert a `Room` document in the MongoDB `chatrooms` collection.
        * It should return a `Promise` that resolves to the newly inserted `Room` object, including the `_id` as assigned by the MongoDB service.
        * If the `name` field in the `room` object is not provided, the `Promise` should reject with an `Error`.
    * B) In `server.js`, update the `/chat` endpoint's `POST` request handler to use the `db.addRoom` method you have just defined in Task 3. The error handling behaviour (e.g., sending `HTTP 400 Bad Request` upon malformed payload) should remain unchanged and the `messages` object should still be updated as it were in the previous assignment. By the end of this task, the list of chatrooms should be persistent even after you restart the server.

4. (7 Points) [JS] The list of chat rooms are now persistent, but all the chat message are ephemeral. We need to be clever about saving the chat messages, because they are created very frequently - writing to the database for each message will create a lot of overhead, potentially increasing the risk of a server crash. To handle this more efficiently, we will deal with chat messages in terms of "conversation" blocks - you could think of this as a buffering mechanism. A "conversation" will contain a fixed-length array of messages, and whenever the server accumulates the predefined number of text messages, it will save the block in the database. If the server crashes, it would lose messages in the current block, but any messages before that should be persistent.
    * A) In `Database.js`, complete the implementation of `Database.prototype.addConversation`.
        * It accepts a single argument `conversation`, which is a `Conversation` object.
        * It should insert a `Conversation` document in the MongoDB `conversations` collection.
        * It should return a `Promise` that resolves to the newly inserted Mongo Document.
        * If any of the fields (`room_id`, `timestamp`, `messages`) is not provided, the `Promise` should reject with an `Error`.
    * B) In `Database.js`, complete the implementation of `Database.prototype.getLastConversation`.
        * It accepts 2 arguments: `room_id` and optional `before`.
        * If `before` is not given, use the current UNIX time in milliseconds given by `Date.now`.
        * It should find the `Conversation` object with `room_id` field equal to the given `room_id` argument, and `timestamp` *less than* the given `before` argument. If multiple `Conversation` objects are found, it should select *the one whose `timestamp` is closest to `before`*.
        * It should return a `Promise` that resolves to the `Conversation` object found.
        * The `Promise` should resolve to `null` if no `Conversation` was found.
    * C) In `server.js` declare a global constant `messageBlockSize` and assign a number (set a small number like `10` during development, so you can test it easily). This number will indicate how many messages to include in a conversation.
    * D) In `server.js`, update the `message` handler for the `broker` client WebSocket, performing the following *in addition to* what it was doing in Assignment 3:
        * If the length of the corresponding `messages[message.roomId]` array is equal to `messageBlockSize` after pushing the new message, create a new `Conversation` object and add to the database by calling `db.addConversation`. The `timestamp` of the new `Conversation` should be UNIX time in milliseconds. After successfully saving the `Conversation` into the database, empty the corresponding messages array to collect new messages.
    * E) In `server.js`, define a new `GET` endpoint `/chat/:room_id/messages`, where `room_id` is the room ID. This endpoint should return a `Conversation` based on the `room_id` parameter and the `before` parameter in the query string. For example, if a `GET` request is made to `/chat/room-1/messages?before=1604188800000`, the server should return a `Conversation` with `room_id` equal to `"room-1"` and `timestamp` less than `1604188800000`.
    * F) In the `Service` object in `app.js` (client-side), define a new function `getLastConversation`, which accepts 2 arguments: `roomId` and `before`. It should simply make an AJAX `GET` request to the `/chat/:room_id/messages` endpoint, encoding the `before` parameter as a query string in the URL. It should return a `Promise` that resolves to the `Conversation` object returned by the server.

5. (8 Points) [JS] By now, messages should persist at least up to the last `Conversation` block. In this task, we will create a mechanism to continuously read the `Conversation` blocks as we scroll up in the chat view - a UI mechanism commonly refered to as "infinite scrolling". To achieve this, we will make some changes to the `Room` and `ChatView` classes, and use a **generator function** to load the messages from the server.
    * A) In the `Room` class in `app.js`, define a new method named `addConversation(conversation)`. This method is similar to `addRoom`, except that here you want to insert the given messages at the beginning of the `Room.messages` array. Make sure the order of messages is chronological. After inserting the messages to the `Room` object, call the `onFetchConversation(conversation)` event listener callback, which will be assigned later by the `ChatView`. This callback is used to notify the `ChatView` that new data is available (similar to how `onNewMessage` works).
    * B) In `app.js`, define a **generator function** named `makeConversationLoader(room)`. The generator function will "remember" the last conversation fetched, and incrementally fetch the conversations as the user scrolls to the top of the chat view, until there is no more conversation blocks to be read.
        * i. In this function, you should use a local variable to keep track of the last conversation block fetched (or just the timestamp of the last conversation).
        * ii. Then, using a conditional loop, use the `Service.getLastConversation` method you implemented in Task 4.F to fetch the conversation block from the server. The last conversation read has information needed for determining the next query parameters.
        * iii. Just before you make a request to the server, set the `room.canLoadConversation` property to `false`. This property has not been defined yet (you will do that next), but you will use this boolean flag to indicate whether more data can be loaded and if the request is in progress.
        * iv. Upon fetching a result, update the local variable (the one you're using to maintain the generator state), and set the `canLoadConversation` flag to `true`. If a `Conversation` object was returned, call the `room.addConversation` method. If there is no result, leave the `canLoadConversation` flag as-is (`false`), and the function should terminate.
        * v. This generator function should `yield` a `Promise` object that resolves to the conversation data if exists, and resolves to `null` otherwise.
    * C) In the `Room` object's constructor, create a Generator instance by calling `makeConversationLoader`, passing in the `Room` instance itself as the argument. Assign this Generator to the `Room` instance's `getLastConversation` property. Also in the constructor, define a boolean variable named `canLoadConversation` and initialize it to `true`. You will use in `ChatView` to determine whether to allow making further requests or not.
    * D) In `ChatView`, you will need to trigger the entire fetch-update-render cycle when the mouse is scrolled up in the chat view (we assume that `this.chatElem` has a minimum and maximum height, and it has a scrollbar in the `y` direction). Attach a `wheel` event listener in the `this.chatElem` element. Now that each room has a generator for loading conversations, this event listener should be incredibly simple. Invoke the generator's `next` function, *only if the following conditions are met*:
        * The scroll is at the top of the view
        * Mouse scroll direction is "up"
        * `this.room.canLoadConversation` is `true`
    * E) In the `setRoom` method of `ChatView`, create an anonymous function and attach it to the `this.room` instance's `onFetchConversation` property -- this is the callback you use to receive new conversation blocks. The behaviour is almost the same as `onNewMessage`, except that you will be attaching multiple messages at once, at the beginning of the DOM. After you render the messages, you will have to adjust the scroll position, so you may want to keep track of the scroll height before you render the messages. More specifically, if the scroll height is `hb` pixels before rendering, the scroll height will increase to `ha` pixels after adding the messages. The scroll's vertical position should be at `ha - hb` after rendering.


## Testing

The testing infrastructure is identical to the one used in the previous assignment, *except for the URL of the scripts used*. Therefore, we will not elaborate on how to use the test script's API; you can refer to the ["Testing" section in the previous assignment](assignment-3.md#testing), and update the URLs of the test scripts accordingly.

* **Client-side**:
    * URL: `http://99.79.42.146/cpen322/test-a4.js` (this goes in `index.html`)
    * Default Values (can be customized with `cpen322.setDefault(key, val)`):
        * `testRoomId`: `'room-1'`,
        * `image`: `'assets/everyone-icon.png'`,
        * `webSocketServer`: `'ws://localhost:8000'`
    * Exported closure variables: `lobby`, `chatView`

* **Server-side**:
    * URL: `http://99.79.42.146/cpen322/test-a4-server.js` (this goes in the `cpen322.connect` function inside `server.js`. You still need to use the same `cpen322-tester.js` module from Assignment 3)
    * Exported global variables: `app`, `db`, `messages`, `messageBlockSize`

* **NOTE:** Unlike the test scripts in the previous assignments, this test script *will not clean up the test objects* it creates during the test. Previously, we could safely delete the test objects because we know that the objects were all in-memory and definitely belong to the application. In this assignment, the application connects to a database, which we consider as *"external"* to the application. Since we cannot make assumptions about the database service you're connecting to, we refrain from performing destructive operations. (Most of you would probably be running your own fresh database service, but we don't neglect the chance that some of you might be using an existing/shared database or connecting to a cloud-hosted service).


## Marking

There are 5 tasks for this assignment (Total 24 Points):
* Task 1: 1 Points
* Task 2: 5 Points
* Task 3: 3 Points
* Task 4: 7 Points
* Task 5: 8 Points


## Submission instructions

Copy the **commit hash** from Github and enter it in Canvas.

For step-by-step instructions, refer to [the tutorial](../tutorials/canvas-submission.md).


### Deadline

These deadlines will be strictly enforced by the assignment submission system (Canvas).

* Sunday, Nov 21, 2021 23:59:59 PST
