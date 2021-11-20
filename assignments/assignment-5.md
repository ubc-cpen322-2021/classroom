[<< Back to Main](README.md)

# Part 5: Adding Authentication and Securing the Application

This assignment builds on the work you have done for [Assignment 4](assignment-4.md).

In this part, you will secure your application by adding basic authentication and authorization, as well as some defensive features. Here is a high-level overview of what you will be doing:

* Implement a simple authentication mechanism.
* Protect server resources from unauthorized users by using session cookies.
* Sanitize user input to defend against Cross-Site Scripting attacks.

**We continue to prohibit the use of third-party JavaScript frameworks, except those specifically mentioned, such as Express.js on the server side.**.


## Directory Structure

```
/client/
    /assets/
    /index.html
    /login.html       (ADDED in this assignment)
    /style.css
    /app.js
/Database.js
/SessionManager.js    (ADDED in this assignment)
/server.js
/package.json
```

All your server-side code for this assignment goes in `server.js`. In this assignment **you will be adding 2 more files**: `login.html` and `SessionManager.js`. We provide the [initial implementation of `SessionManager.js` here](src/SessionManager.js).


## Useful References

* [Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
* Express.js Guide
    * [Writing a middleware](https://expressjs.com/en/guide/writing-middleware.html)
    * [Using a middleware](https://expressjs.com/en/guide/using-middleware.html)
    * [Writing error handlers](https://expressjs.com/en/guide/error-handling.html#writing-error-handlers)
* [Node.js `ws` module API documentation](https://github.com/websockets/ws/blob/master/doc/ws.md)


## Tasks

1. (2 Points) [HTML] Until now, we have been using a hard-coded *mock* profile data in the client side. In the following tasks, you will build a simple authentication mechanism, and maintain a client session using cookies. It will involve the following steps:
    * Create a login page to be served at `/login` GET endpoint.
    * Initialize a database table to store user data.
    * Create a POST endpoint to "sign in" the user, which involves creating a session in the server and setting the `Set-Cookie` HTTP header in the response, passing the session token.
    * Protect the HTTP resource endpoints that only signed in users would be allowed to access.

    * A) As the first step, create a HTML page named `login.html` inside the root directory of the client application (next to `index.html`). This login page *will not be a part of the single-page application*, because we want the login page to be accessible to anyone, while `index.html` accessible only to signed in users. Hence, `login.html` will be served as an entirely separate HTML page, requiring a full reload.
        * `login.html` should contain a `form` element, with the `method` attribute set to `"POST"` and the `action` attribute set to `"/login"` - this means that the form will be submitted to `/login` endpoint via `POST` request.
        * Inside the `form`, there should be a text `input` with the `name` set to `"username"`.
        * Inside the `form`, there should be a password `input` with the `name` set to `"password"`.
        * Inside the `form`, there should be a submit `input` or `button`.


2. (1 Point) [JS] Before we can receive the login form handle the authentication steps, you will need to initialize the database and populate it with some user data. You will also need a way to read user information from the database.
    * A) Use the [`initUsers.mongo` script provided](src/initUsers.mongo) to populate the database - you will need to `load("initUsers.mongo")` in the Mongo Shell, similar to how you initialize the other objects in the previous assignment.
        * If you look inside the `initUsers.mongo` script, you will notice that the password field has a rather complicated string - this is not the actual password. *It is never a good idea to store sensitive data in plaintext in the database*, because the damage will be huge if the database gets compromised. What the database stores here is the salted SHA256 hash of the password. We will get into more detail about this in Task 3.D.
    * B) After initializing the database, create a method named `getUser(username)` in `Database.js`. It accepts a single `username` argument and queries the `users` collection for a document with the `username` field equal to the given `username`. The method should return a `Promise` that resolves to the user document if found, `null` otherwise.
    * The 2 test users in the `initUsers.mongo` script are: `alice` with password = `secret`, and `bob` with password = `password`.


3. (5 Points) [JS] Now that we have a login form and a user database, we will write the server-side logic to handle the login request and maintain a **user session**. By default, when we receive an HTTP request, there is no way for the server to tell which request came from which user, because HTTP messages do not contain the relevant information (i.e., HTTP is a stateless protocol). This is where a **cookie** becomes useful: to maintain some session data between a client and the server. A user session is realized by associating a given request with a user by inspecting the **cookie** included in the request.

    In the following tasks, you will build a mechanism to maintain a user session in the server. At a high-level, the following needs to happen:
    * When a client *signs in* successfully, the server needs to generate some unique token to be used privately between the client and the server. The server needs to remember this token. Then the server needs to tell the client to include this token in every request, so that it can tell if a request came from the signed-in client.
    * The client needs to remember the token returned from the server, and make sure to include it in every request made to the protected endpoints.
    * For every request made to the protected endpoints, the server needs to check the token included in the request, and determine whether the token is valid. If the token is invalid, the server needs to reject the request.

    Some of the server-client interaction described above comes for free by using *cookies* to exchange the session token. Since cookie exchange is a standardized mechanism ([RFC 6265](https://tools.ietf.org/html/rfc6265)), the browser does all the heavy-lifting for you; namely, you don't need to set the cookie yourself, the browser sets it automatically when the server includes a `Set-Cookie` header in the response. In this task, you will be building the server side of the session management. We have provided an [initial implementation of `SessionManager`](src/SessionManager.js), whose methods you will complete.
    * A) In `server.js`, declare a variable `sessionManager`, assigning a `SessionManager` instance.
    * B) Complete the implementation of the `createSession` function in `SessionManager`, performing the following operations:
        * Generate a random string token (e.g. you can use `crypto.randomBytes`). This token will be the session token you associate with a client. Make sure this token is random and long enough to guarantee uniqueness and confidentiality. To evaluate the "strength" of the generated token, we use the following ad-hoc formula: `strength(token) = shannonEntropy(token) * length(token)`. If you're curious, you can [read about Shannon Entropy here](http://bearcave.com/misl/misl_tech/wavelets/compression/shannon.html).
        * Create an object with a `username` property, assigning the given `username` argument. You can also store some other metadata such as the timestamp when the token was created, and when the token should expire. Then, using the generated token as a key, store this object in the `sessions` dictionary.
        * On the given `response` argument, set the `Set-Cookie` header using the express method [`response.cookie()`](https://expressjs.com/en/api.html#res.cookie). The cookie name should be set to `cpen322-session`, and the value set to the token you just generated. In addition, set the `Max-Age` attribute on the cookie to the given `maxAge` argument. If the `maxAge` argument is not given, use some default value.
        * `maxAge` milliseconds after a session data is created, it should be deleted from the `sessions` dictionary. You can use timers to achieve this.
    * C) In `server.js`, create a `POST` endpoint at the path `/login`. This is where the login form will be submitted to. In the `POST` `/login` handler, use the `db.getUser` method to look up the user data from the database.
        * If the user is not found, redirect back to the `/login` page.
        * If the user is found, you will have to now check that the password in the submitted form corresponds to the salted SHA256 hash stored in the database. Use the `isCorrectPassword` function you implement in Task 3.D (next subtask). to check the submitted password. If the password is correct, create a new user session using the `createSession` function you just implemented, and then redirect the request to `/`. If the password is incorrect, redirect back to the `/login` page.
    * D) In the global scope of `server.js`, implement a helper function named `isCorrectPassword(password, saltedHash)`, refering to the following description to figure out how you can compare the two strings `password` and `saltedHash`. You can use the built-in `crypto` module to compute the SHA256 hash.
        * The stored password (`saltedHash`) in the database is made from concatenating 2 strings:
            * the first 20 characters is the "salt" string - it is just a random string we generate each time we want to store some password. We will refer to this string as the `salt`.
            * the remaining 44 characters is the `base64` representation of the SHA256 hash of the "salted password".
        * The "salted password" is simply the concatenation of "plaintext password" (`password`) and the `salt`.
        * *For testing, you'll need to export this function*


4. (7 Points) [JS] So far, we can authenticate a user and create a user session, but it is rather useless in protecting any of the pages; you can still access the app at `/` without signing in and the application does not know anything about the signed in user. To protect each of the resource endpoints, we will need to read the cookie value included in a request, check if the token exists in the `sessions` object inside the `sessionManager`, then proceed normally if the token is valid, or return HTTP 401 if not. We could perform these steps for each endpoint, but Express.js provides an easier way to do this using ["middleware" functions](https://expressjs.com/en/guide/writing-middleware.html).
    * A) Complete the implementation of the `middleware` function in `SessionManager`, performing the following operations:
        * First, try to read the cookie information from the request. Since we're not using any Express.js extensions like `cookie-parser`, you will have to read it from the HTTP header and parse the string yourself.
        * If the cookie header was not found, "short-circuit" the middleware by calling the `next` function, passing in a `SessionError` object, and returning immediately. This short-circuit mechanism is [described here](https://expressjs.com/en/guide/error-handling.html).
        * After parsing the cookie header, check if the token (cookie value) is found in the `sessions` object. If it was not found, short-circuit the middleware as above. If the session exists, assign the username associated with the session to a new `username` property on the `request` object passed to the middleware function. Additionally, assign a property named `session` and set its value to the cookie value (the token). These two properties will be used by the next handler in the Express.js middleware chain. Then, call `next` with zero arguments to trigger the next middleware.
    * B) We need to customize how we deal with errors thrown by the above middleware. You can refer to the [Express.js guide for defining custom error handlers](https://expressjs.com/en/guide/error-handling.html#writing-error-handlers). This error handler will be useful in the next task. In the error handler, check if the error is a `SessionError` instance (*Note that this is exported as `SessionManager.Error` if you look in the `SessionManager` module*). If it is, then you'll need to respond according to the `Accept` header of the request. If the `Accept` header specifies `application/json`, return HTTP 401 with the error message. Otherwise, redirect the request to the `/login` page. If the error is not a `SessionError` object, return HTTP 500.
    * C) You need to use the `middleware` function to protect some of the resources. You can do this simply by providing the `middleware` function as the argument before the final request handler function, as the Express.js API methods are variadic functions. Pay close attention to the order in which endpoints are defined, and the order in which the middlewares are added. Refer to the [API documentations](https://expressjs.com/en/guide/using-middleware.html) for further information. You should protect the following resource endpoints:
        * `/chat/:room_id/messages`
        * `/chat/:room_id`
        * `/chat`
        * `/profile` (you will create this in Task 6)
        * `/app.js`
        * `/index.html`
        * `/index`
        * `/`
        * *Note: You will notice that while you want to protect the URL `/`, which maps to `/index.html`, you want the rest of the directory such as `/style.css` and `/login.html` to be accessible without authentication. To do this, use the same `express.static` middleware to serve the protected files (`index.html` and `app.js`) with the `SessionManager.middleware` included. In Express.js, more restrictive paths are declared first, so you will need to declare these endpoints before the generic catch-all `/` endpoint. You can also experiment with RegEx routes to selectively apply the middleware.*


5. (2 Points) [JS] In addition to the protected endpoints listed in Task 4, we also need to protect the WebSocket. Otherwise, rogue clients can connect to the WebSocket broker and send messages to the legitimate application users.
    * A) In the `connection` event handler of the `broker` object, read and parse the cookie from the request headers. You can read the cookies from the [second argument of the `connection` handler](https://github.com/websockets/ws/blob/master/doc/ws.md#event-connection), which is a [`http.IncomingMessage`](https://nodejs.org/docs/latest-v12.x/api/http.html#http_class_http_incomingmessage) object. If the cookie is not present or the cookie value is invalid, close the client socket. If the cookie is valid, proceed as usual.
    * B) In the `message` handler of the `broker` client, ignore any `username` field included in the message sent by a client. Instead, overwrite the `username` field with the username associated with the socket's session, before forwarding the message to the other clients. You can now omit the `username` field when you call `socket.send` in `app.js`.


6. (2 Point) [JS] We need to update the client application so that it uses the `profile` of the signed in user instead of the static `profile`. To fetch the `profile` information dynamically, we also need to create the server-side endpoint.
    * A) In `server.js`, create a `GET` `/profile` endpoint, protected with the session middleware. This endpoint simply returns an object containing a property `username` - this value can be obtained from the Request object you augment in the session middleware.
    * B) In `app.js`, create `Service.getProfile` function, which makes a `GET` request to the `/profile` endpoint you created above. It should handle the response just like the other functions in the `Service` object do. Then, in the `main` function, call `Service.getProfile` to get the username from the server, and assign this username in the `profile` object. 


7. (2 Points) [JS] Lastly, we need a way to "sign out" of the application. This involves creating a `/logout` endpoint and deleting the session data.
    * A) Complete the implementation of the `deleteSession` function in `SessionManager`, performing the following operations:
        * Delete the `username` property of the given request.
        * Delete the `session` property of the given request.
        * Delete the session object associated with the request from the `sessions` object.
    * B) In `server.js`, create a `GET` `/logout` endpoint. The request handler should delete the session associated with the request by calling `sessionManager.deleteSession`. Then, send a redirect response to the login page.
    * *While we don't assess you on this, you can also create a "Sign out" button/link in the client app.*


8. (3 Point) Authenticating users is only a small part of securing your application. Your application is still vulnerable to various attacks - such as a Cross-Site Scripting (XSS) attack. In this task you will implement defence against XSS attacks by sanitizing the input given by a user.
    * If you do not see how your application is vulnerable to XSS attacks, open multiple tabs and navigate to a chat room to simulate a conversation. In the chat message, copy-and-paste the following javascript code: `You think I'm just chatting<img src="/assets/profile-icon.png" onload="alert('but I just mounted a XSS attack!');this.parentNode.removeChild(this)"/> normally`. This message will be sent to all other clients in the same room, and the client-application will render this string by adding it to the DOM. When your `ChatView` renders this as a DOM element, you should observe an alert box. This is called the Cross-Site Scripting (XSS) attack. You can see why this is dangerous, because the code the attacker injects can access information belonging to other clients, for example, cookies (authentication tokens).
    * A) In the client-side application, locate the lines of code responsible for rendering the message received from the WebSocket. In that code block, *sanitize* the received message before appending it to the DOM.
        * Think about how you want to "sanitize" a given user input. Do you want to simply invalidate texts containing `<script>` tag? Or should you be removing the tag but still show the body of the tag? What if you wanted to share code through the chat, and you wanted to show the entire script tag verbatim? We leave this choice up to you.
    * B) While sanitizing a malicious input just before rendering may suppress the attack (at least for now), the application is still vulnerable. Think about what happens in the server - the message goes to the `broker`, and it gets stored in the database as conversation objects. What would happen if, in the future, you replace your client application? or if your server interacts with a 3rd-party client application?
        * In addition to sanitizing the message in the client, also sanitize a given message in the `message` handler of the `broker` client. Ensure the dirty message does not get forwarded to the other clients, and does not get stored in the database.


This concludes the 5-part course project for CPEN322. Congratulations!


## Testing

The testing infrastructure is identical to the one used in the previous assignment, *except for the URL of the scripts used*. Therefore, we will not elaborate on how to use the test script's API; you can refer to the ["Testing" section in the previous assignment](assignment-3.md#testing), and update the URLs of the test scripts accordingly.

* **Client-side**:
    * URL: `http://99.79.42.146/cpen322/test-a5.js` (this goes in `index.html`)
    * Default Values (can be customized with `cpen322.setDefault(key, val)`):
        * `testRoomId`: `'room-1'`,
        * `cookieName`: `'cpen322-session'`,
        * `testUser1`: `{ username: 'alice', password: 'secret', saltedHash: '1htYvJoddV8mLxq3h7C26/RH2NPMeTDxHIxWn49M/G0wxqh/7Y3cM+kB1Wdjr4I=' }`
        * `testUser2`: `{ username: 'bob', password: 'password', saltedHash: 'MIYB5u3dFYipaBtCYd9fyhhanQkuW4RkoRTUDLYtwd/IjQvYBgMHL+eoZi3Rzhw=' }`
        * `image`: `'assets/everyone-icon.png'`,
        * `webSocketServer`: `'ws://localhost:8000'`
    * Exported closure variables: `lobby`, `chatView`

* **Server-side**:
    * URL: `http://99.79.42.146/cpen322/test-a5-server.js` (this goes in the `cpen322.connect` function inside `server.js`. You still need to use the same `cpen322-tester.js` module from Assignment 4)
    * Exported global variables: `app`, `db`, `messages`, `messageBlockSize`, `sessionManager`, `isCorrectPassword`

* **NOTE:** Unlike the test scripts in the previous assignments, this test script *will not clean up the test objects* it creates during the test. Previously, we could safely delete the test objects because we know that the objects were all in-memory and definitely belong to the application. In this assignment, the application connects to a database, which we consider as *"external"* to the application. Since we cannot make assumptions about the database service you're connecting to, we refrain from performing destructive operations. (Most of you would probably be running your own fresh database service, but we don't neglect the chance that some of you might be using an existing/shared database or connecting to a cloud-hosted service).


## Marking

There are 8 tasks for this assignment (Total 24 Points):
* Task 1: 2 Points
* Task 2: 1 Points
* Task 3: 5 Points
* Task 4: 7 Points
* Task 5: 2 Points
* Task 6: 2 Points
* Task 7: 2 Points
* Task 8: 3 Points


## Submission instructions:

Copy the **commit hash** from Github and enter it in Canvas.

For step-by-step instructions, refer to [the tutorial](canvas-submission.md).


### Deadline:

These deadlines will be strictly enforced by the assignment submission system (Canvas).

* Sunday, Dec 5, 2021 23:59:59 PST
