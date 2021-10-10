[<< Back to Main](README.md)

# Part 2: Dynamically Rendering Client-side Application

This assignment builds on the work you have done for [Assignment 1](assignment-1.md).

In this part, you will be implementing the client-side functionalities of the application. Here is a high-level overview of what you will be doing:

* Turn the application into a **Single-page Application** by dynamically replacing the DOM depending on the URL in the address bar ("Client-side routing")
* Define high-level objects such as `Room` and `Lobby` to manage the application state. (**Object-Oriented programming**)
* Define application components like `ChatView` and `LobbyView` to dynamically update the DOM tree upon changes in the application state, following a **Model-View-Control (MVC) pattern** used in many mainstream frameworks like React, Angular, and Vue.
* Create event handlers to add interactivity in the application and to update the application state.

Throughout the assignment, **we prohibit the use of third-party JavaScript frameworks** like React, Angular, or Vue, because we want you to see and experience the inner workings of a web application. After you go through the assignments, hopefully you will understand how these third-party frameworks do their "magic".


## Directory Structure

Same as assignment 1, except this time it will include a JavaScript file that describes your application.

```
/client/
    /assets/
    /index.html
    /chat.html       (will be deleted at the end of the assignment)
    /profile.html    (will be deleted at the end of the assignment)
    /style.css
    /app.js          (created in this assignment)
/server.js
/package.json
```

`app.js` will have all your JavaScript code. You should include this in your `index.html` as a `<script>` tag. At the end of this assignment, you will no longer need `chat.html` and `profile.html` as we will dynamically generate these pages using JavaScript.


## Helper Functions

Here are some helper functions you may find useful during development. You are not obliged to use them.
```
// Removes the contents of the given DOM element (equivalent to elem.innerHTML = '' but faster)
function emptyDOM (elem){
    while (elem.firstChild) elem.removeChild(elem.firstChild);
}

// Creates a DOM element from the given HTML string
function createDOM (htmlString){
    let template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
}

// example usage
var messageBox = createDOM(
    `<div>
        <span>Alice</span>
        <span>Hello World</span>
    </div>`
    );
```


## Tasks

1. (1 Points) [JS] Define a function named `main` in the global scope, and then add it as the event handler for the `load` event of the `window` object. The `main` function will be called *once* when the page is loaded. *We impose strict naming for functions and variables, so that the automated tests can locate them. Therefore, for all of the tasks, please follow the variable naming closely.*

2. (4 Points) [JS] We will first create a client-side "router" to render pages dynamically based on the URL. The idea is to use the hash `#` part of the URL as the client-side path, preventing the browser from making a GET request to fetch a different page. For example, instead of fetching the profile page at `/profile` on the server, we will dynamically render the profile page on the client side when the location hash is `#/profile`.
    * A) Inside the `main` function (from Task 1), define a function named `renderRoute()`. This function should read the URL from the address bar (hint: use `window.location.hash`) and then conditionally perform the following:
        * If the first part of the path is an empty string `""`, it should empty the contents of `#page-view`, and then populate it with the corresponding content from `index.html` from Assignment 1 (i.e., `div.content`). From now on, we will refer to this page as the "lobby page".
        * If the first part of the path is `"chat"`, it should empty the contents of the `#page-view`, and then populate it with the corresponding content from `chat.html` from Assignment 1. From now on, we will refer to this page as the "chat page".
        * If the first part of the path is `"profile"`, it should empty the contents of `#page-view`, and then populate it with the corresponding content from `profile.html` from Assignment 1. From now on, we will refer to this page as the "profile page".
        * *The helper functions provided above will come in handy for this task.*
    * B) Inside the `main` function, attach the `renderRoute` function as the event handler for the `popstate` event of the `window` object. The `popstate` event is fired when the URL changes (e.g., when the back button is clicked).
    * C) Inside the `main` function, call the `renderRoute` function once, so that the appropriate page is rendered upon page load.
    * D) Replace all the `href` attributes of all the links in the HTML by adding a `#` character at the beginning of the URL. After you have done this, your application should now be a [Single-page Application](https://en.wikipedia.org/wiki/Single-page_application). Verify that this routing mechanism works by clicking around the links and observing the pages render dynamically.

3. (4 Points) [JS] In Task 2, you have generated each page programmatically. However, the generated DOM has no relation to the application state, and is recreated every time the URL changes. In this task, we will create objects to represent each page, and each object will hold the relevant data and handle the events within the page. This software design pattern is called ["Model-View-Control"](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller).
    * A) Define a class named `LobbyView`. Inside the constructor, create the DOM for the "lobby page" (which you have generated in Task 2) and then assign it to the `elem` property.
    * B) Define a class named `ChatView`. Inside the constructor, create the DOM for the "chat page" (which you have generated in Task 2) and then assign it to the `elem` property.
    * C) Define a class named `ProfileView`. Inside the constructor, create the DOM for the "chat page" (which you have generated in Task 2) and then assign it to the `elem` property.
    * D) Inside the `main` function, instantiate the view objects using the classes you have just defined in Tasks 3.A, 3.B, and 3.C. Use the variable names `lobbyView`, `chatView`, and `profileView`.
    * E) Update the `renderRoute` function to use the newly instantiated objects instead (hint: you should reuse the DOM attached to the `elem` property of each object).

4. (2 Points) [JS] In this task, you will update the class definitions from Task 3 to store references to some of the DOM elements, which you will use later. This is an intermediate step, so you may not observe any noticeable change in application behaviour.
    * A) Inside the constructor of `ChatView`, after you have created the `elem` property, create the following properties to store references to the descendant elements. (hint: you can use `this.elem.querySelector`)
        * i. `titleElem` - store reference to the `h4` heading for the room name.
        * ii. `chatElem` - store reference to the `div.message-list` container. You will dynamically add message boxes inside this `div` later.
        * iii. `inputElem` - store reference to the `textarea` element for entering the message to send.
        * iv. `buttonElem` - store reference to the `button` element for sending the message.
    * B) Inside the constructor of `LobbyView`, create the following properties.
        * i. `listElem` - store reference to the `ul.room-list` element. You will dynamically add list items on this.
        * ii. `inputElem` - store reference to the `input` element for entering the new room name.
        * iii. `buttonElem` - store reference to the `button` element for creating a room.

5. (7 Points) [JS] In Task 3, you have defined higher level objects to represent each page, but they don't hold any data. In this task you will define some more objects you will use to represent the application state.
    * A) Define a class named `Room`. The constructor should accept 4 arguments (in this order): `id`, `name`, `image`, `messages`. For `image`, provide a default image url (e.g., `assets/everyone-icon.png`), and for `messages`, provide an empty array as the default value. Inside the constructor, assign the given arguments to the properties with the same name (`id`, `name`, `image`, and `messages`).
    * B) In the `Room` class, add a method with the following signature: `addMessage(username, text)`. If the given `text` is an empty string or a sequence of whitespaces, the method should simply return. Otherwise, the method should create a new object with the keys `username` and `text`, assigning the given arguments to the corresponding field, then push the object into the `this.messages` array.
    * C) Define a class named `Lobby`, whose constructor takes zero arguments. Inside the constructor, initialize a `rooms` property, assigning it an *associative array* of 4 `Room` objects indexed by the `id` property. Use the `Room` class you defined in Task 4.A to create new instances. In the next Task, we will dynamically render the lobby page from this array.
    * D) In the `Lobby` class, add a method with the signature `getRoom(roomId)`. The method should search through the rooms and return the room with `id` = `roomId` if found.
    * E) In the `Lobby` class, add a method with the signature `addRoom(id, name, image, messages)`. The method should create a new `Room` object, using the given arguments, and add the object in the `this.rooms` array.

6. (5 Points) [JS] In this task, you will use the objects you defined in Task 4 to provide the "model" for each of the views, so that the views can be rendered dynamically.
    * A) Inside the `main` function, before the instantiation of `lobbyView`, create a `Lobby` object and assign it to the variable `lobby`. This object will be the [*"single source of truth"*](https://en.wikipedia.org/wiki/Single_source_of_truth) within the application.
    * B) Modify the constructor of `LobbyView` to accept a single argument `lobby`. Then inside the constructor, assign the received argument to the property named `lobby`.
    * C) In the `LobbyView` class, add a method named `redrawList` that takes zero argument. This method should empty the contents of `this.listElem`, then populate the list dynamically from the array of `Room` objects inside the `lobby` object. Call this method inside the constructor to draw the initial list of rooms.
    * D) Inside the constructor of `LobbyView` class, attach a `click` event handler on the `this.buttonElem` element. The event handler should get the text value from the `this.inputElem` element, and call the `addRoom` method of the `this.lobby` object. After that, clear the text value of `this.inputElem`.

7. (2 Points) [JS] Clicking the "Create Room" button should now trigger the `addRoom` method properly, but you will not see any changes in the view. This is because we have not yet completed the Model-View-Control loop. More specifically, the `LobbyView.redrawList` method hasn't been called yet. However, we do not want to call this method directly in the `click` event handler; rather, we want `redrawList` to be called whenever the `lobby` object changes, regardless of which event triggered the update. In other words, we want `LobbyView` object to observe changes in the `lobby` object and call `redrawList` automatically. Here, we will use the ["observer pattern"](https://en.wikipedia.org/wiki/Observer_pattern) by implementing *a simple event listener* on the `Lobby` object.
    * A) At the end of the `addRoom` method of the `Lobby` object, check if `this.onNewRoom` function is defined. If it is defined, call the function, passing the newly created `Room` object as the argument.
    * B) Inside the constructor of `LobbyView`, assign a new anonymous function to the `this.lobby` object's `onNewRoom` property. The anonymous function should accept a single argument `room`. The function should add a new list item to the `this.listElem` element, generating the DOM with the given `room` data. Alternatively, you could also simply call `redrawList` method (this would be less efficient, as it redraws the entire list).
    * *The mechanism you implemented in this task may seem strange at first, but this is essentially an "unsafe" version of the event listener interface, similar to DOM Event API 1.0 (but not 2.0, which supports multiple event listeners). This event-driven pattern is extremely prevalent in JavaScript applications, so you should spend some time following along the control-flow, if it is unclear.*

8. (10 Points) [JS] Finally, you will add dynamism and interactivity in the "chat view". The tasks will be similar to Task 6 and 7, but with an extra bit of complexity.
    * A) Declare a global variable `profile`, and assign an object with a single key `username`, assigning an arbitrary name (e.g. `"Alice"`). This object will represent the current user.
    * B) At the end of the `addMessage` method of the `Room` object, check if `this.onNewMessage` function is defined. If it is defined, call the function, passing the newly created message object as the argument.
    * C) In the `ChatView` class, define a method with the signature `sendMessage()`. The function should read the text value from `this.inputElem` and call the `addMessage` method of the `this.room` object. You can pass in `profile.username` as the first argument. After that, clear the text value of `this.inputElem`.
    * D) Inside the constructor of `ChatView`, make the following modifications:
        * i. Add a new property named `room` and assign `null` to it. 
        * ii. Add a `click` event handler to the `this.buttonElem` element. The event handler should call the `sendMessage` method.
        * iii. Add a `keyup` event handler to the `this.inputElem` element. The event handler should call the `sendMessage` method *only if the key is the "enter" key without the "shift" key*.
    * E) In the `ChatView` class, define a method with the signature `setRoom(room)`. We need this method because unlike `LobbyView` where `this.lobby` object is fixed, `this.room` object can be changed. In this method, perform the following operations:
        * i. Assign the given `room` argument to the `room` property.
        * ii. Update the `this.titleElem` to display the new room name.
        * iii. Clear the contents of `this.chatElem`, and dynamically create the message boxes from the `this.room.messages` array. To distinguish between other users' messages and the current user's, you can compare the username against `profile.username`.
        * iv. Assign an anonymous function accepting a single argument `message` to `this.room` object's `onNewMessage` property (i.e., attach a new event listener). The function should add a new message box on `this.chatElem` element. To distinguish between other users' messages and the current user's, you can compare the username against `profile.username`.
    * F) Finally, we want to show the specific chat room when the user clicks on it in the lobby. We return to the `renderRoute()` function in `main` to do this.
        * i. In the branch that reads if the URL has a `"chat"` path, extract the `Room` object with the current room ID (by calling the `getRoom` function of the `Lobby` object).
        * ii. Call the `setRoom` function of the `chatView` object with the extracted room object.
        * iii. Make sure you handle exceptions before the call (i.e. the room exists and is not null).

## Testing

**To test your code, insert the following script tag within the `head` tag of your page, BEFORE your `app.js`. It is important that the test script is loaded synchronously before your application script for it to work correctly.**
```
<script src="http://99.79.42.146/cpen322/test-a2.js" type="text/javascript"></script>
```

**In addition to adding the script tag above,** you will need to inject some tester code to successfully test Tasks 2, 3, 6, and 8. The testing interface is designed this way because there is no way for a third-party script (i.e. the test script) to observe closure variables unless you expose them explicitly.

For example, in Task 2 you are asked to declare a local function `renderRoute` inside the `main` function. If you do not expose the name `renderRoute` from within the `main` function, there is simply no way for the tester to observe `renderRoute` since it is a closed variable. To make such variables available, you must invoke the `cpen322.export` function as shown below.

```
// assuming we want to expose `renderRoute` and `lobbyView` from inside `main`

// traditional syntax
function main(){
    /* other code */

    cpen322.export(arguments.callee, {
        renderRoute: renderRoute,
        lobbyView: lobbyView
    });
}

// concise ES6 property shorthand syntax
function main(){
    /* other code */

    cpen322.export(arguments.callee, { renderRoute, lobbyView });
}
```

You will see a red button on the top-right corner of your web page. Click it to test your code.
Watch out for any alert messages or console output, which tell you any missing components/functionalities. You are responsible for ensuring that all the functionalities above are implemented correctly - the tests are only there to help you. We reserve the right to test your code with other test cases than the above.

The test script uses certain default values during the test.
* Room ID - the test script expects that you have a Room instance with the ID `"room-1"`.
* Default room image URL - the test script expects the default image URL to be `"assets/everyone-icon.png"`.

To set a different default value for your application, you can use `cpen322.setDefault` as shown below:
```
cpen322.setDefault("image", YOUR_IMAGE_URL);
cpen322.setDefault("testRoomId", YOUR_ROOM_ID);
```


## Marking

There are 8 tasks for this assignment (Total 35 Points):
* Task 1: 1 Points
* Task 2: 4 Points
* Task 3: 4 Points
* Task 4: 2 Points
* Task 5: 7 Point
* Task 6: 5 Point
* Task 7: 2 Point
* Task 8: 10 Point


## Submission instructions

Copy the **commit hash** from Github and enter it in Canvas.

For step-by-step instructions, refer to [the tutorial](canvas-submission.md).


### Deadline

These deadlines will be strictly enforced by the assignment submission system (Canvas).

* Sunday, Oct 24, 2021 23:59:59 PST
