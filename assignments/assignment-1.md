[<< Back to Main](README.md)

# Project Overview

You are hired as a web developer for UBC IT department to develop a web application for students and professors to chat online. As part of your job, you are going to build an online discussion forum where anyone can create a chat room about a topic and people can have live chat using the application.


# Part 1: Building the Client-side GUI

For the first part of this project, you will **build the graphical user interface (GUI)** for the application. The GUI will not be functional, but it will give us an idea of how the application will look, and serve as a template when we start implementing features in the next part of the project. Below are examples of the 3 pages of the application that we will design.

![screenshot.png](../assets/screenshot.png?raw=true "Example Pages")

The above screenshot is just an example, and you are free to choose colours and fonts of your own choice (*unless specified otherwise in a task*).

**For this assignment, you will be using only HTML and CSS to create the layout of the GUI and apply styles to different DOM elements. There is no JavaScript required for this assignment, so you will be penalized if you use JavaScript for this assignment.**

Throughout the project, **we prohibit the use of third-party CSS and JavaScript frameworks** like Bootstrap, React, Angular, or Vue, because we want you to explore the inner workings of a web application. As you go through the assignments, hopefully you will understand how these third-party frameworks do their "magic".


## Directory Structure

To help you get started, you will need to structure your project like the following. **Submission instructions are given in the end of this document.**

```
/client/
    /assets/
    /index.html
    /chat.html
    /profile.html
    /style.css
/server.js
/package.json
```

* Client-side application root directory (all html files go in this directory)
  * `assets` (other static resources such as images go in this directory)
  * `index.html` (this is the entry point to your website, and the main page GUI goes here)
  * `chat.html` (the chat page)
  * `profile.html` (the profile page)
* `server.js` is the server-side NodeJS script serving the website. You will add functionalities here from assignment 3 onward
* `package.json` contains information such as dependent NPM modules. This is used by NPM.


## Using a Web Server

While you can still view your application pages (`index.html`, `chat.html`, `profile.html`) locally by opening them with a browser, you should work on the pages by serving them with a web server and viewing them as actual web pages (not a local HTML file). To facilitate this process, we have provided a basic web server in your repository - `server.js`. You can serve your client-side application by typing the following at the root directory of your project.

### Serving your Web Application

```
# we assume your project root is = project-me

~/project-me$ node server.js
```

### Installing Dependencies

The server uses ExpressJS, which is a popular NodeJS framework for building web servers. You will need to install this module by typing the following:
```
~/project-me$ npm install express
```
OR the following (we already declared this library as a dependency in `package.json` so that NPM knows what all modules to install)
```
~/project-me$ npm install
```

When the web server is running, your client-side application will be available at `http://localhost:3000`.


## Tasks

1. [HTML] Create the base html layout that will be used for all 3 pages in the application. Refer to the screenshot above and the reference diagram below. When you are done with this task, you can copy and paste the HTML to each of the pages (`index.html`, `chat.html`, `profile.html`). The 3 pages differ only in their contents inside the `#page-view` element:

![base-layout.png](../assets/base-layout.png?raw=true "Application Layout")
    
    * Main Container (`div id = app-view`)
        * Navigation (`ul id = app-menu`)
            * Menu Item 1 (`li class = menu-item`)
                * Link (`a href = /`)
            * Menu Item 2 (`li class = menu-item`)
                * Link (`a href = /profile`)
        * Page Container (`div id = page-view`)

    * **You can find all the images that you need for the application in the `client/assets` directory in your project repository. Alternatively, you are free to use your own images.**

2. [HTML] `index.html` will be the main page of the application. In the `#page-view` div of the base layout, create a new `div` with the class name `content` that will hold all the contents of the page. Inside that `div`, create a list of chat rooms using an unordered list (i.e., `ul`). Inside each list item, there should be a link to the URL `/chat`. Refer to the reference diagram below.

![lobby-layout.png](../assets/lobby-layout.png?raw=true "Lobby Page Layout")
    
    * Page Content Container (`div class = content`)
        * List of Rooms (`ul class = room-list`)
            * Menu Item 1 ~ 4 (`li`)
                * Link (`a href = /chat`)
        * Page Controls (`div class = page-control`)
            * Input for new room name (`input type = text`)
            * Button to create new room (`button`)

3. [HTML] `chat.html` page is where users will have conversations. Similar to Task 2, create a new `div` with the class name `content` for the page contents. Refer to the reference diagram below for the rest of the structure.

![chat-layout.png](../assets/chat-layout.png?raw=true "Chat Page Layout")

    * Page Content Container (`div class = content`)
        * Room Name Heading (`h4 class = room-name`)
        * Messages (`div class = message-list`)
            * Other User Message Box (`div class = message`)
                * Username Text (`span class = message-user`)
                * Message Text (`span class = message-text`)
            * Current End-User Message Box (`div class = message my-message`)
                * Username Text (`span class = message-user`)
                * Message Text (`span class = message-text`)
        * Page Controls (`div class = page-control`)
            * Input for message (`textarea`)
            * Button to send message (`button`)

4. [HTML] `profile.html` page is where the end-user can update their personal information. Create the page content `div` the same way as `index.html` and `chat.html`. Refer to the reference diagram below for the rest of the structure.

![profile-layout.png](../assets/profile-layout.png?raw=true "Profile Page Layout")

    * Page Content Container (`div class = content`)
        * Form (`div class = profile-form`)
            * Form Field (`div class = form-field`)
                * Field Label (`label`)
                * Field Input (use the appropriate input)
        * Page Controls (`div class = page-control`)
            * Button to save changes (`button`)

5. [CSS] Create a CSS stylesheet named `style.css` to add relevant styles that would help you design the layout for the application. Except for the following constraints, feel free to choose your own design:
    * When the width of the viewport is *greater than or equal to 1024px*, the width of `#app-view` should be 80% of its container (i.e., `body`).
    * When the width of the viewport is *less than 1024px and greater than or equal to 768px*, the width of `#app-view` should be 90% of its container.
    * When the width of the viewport is *less than 768px*, the width of `#app-view` should be 100% of its container.
    * In `chat.html`, the message box for other users (i.e., `div.message`) should stick to the left, while the message box for the current application user (i.e., `div.my-message`) should stick to the right. They should have different colors.

6. [CSS] You need to add some basic interactivity to the website using pure css (no javascript is required for these tasks, so *please do not use JavaScript*)
    * A) When you hover over any of the items in the main navigation menu (`#app-menu li`), the **text and background color should be changed**. As soon as you move the mouse pointer away, the color should be restored back to the original color.

    ![hover-a.png](../assets/hover-a.png?raw=true "Menu Item Hover")

    * B) When you hover over any of the chat room menu item on `index.html` page (`.room-list li`), the **background color should change**. As soon as you take the mouse pointer away, the background should revert to its original color.

    ![hover-b.png](../assets/hover-b.png?raw=true "Room Item Hover")



## Testing

**To test your code, insert the following script tags in the head tag of your page.** Alternatively, to make the script load faster, you can download the script and host it locally in your `client` directory.
```
<script src="http://99.79.42.146/cpen322/test-a1.js" type="text/javascript"></script>
```
You will see a red button on the top-right corner of your web page. Click it to test your code. Running the test will help you to debug your application during development.

* **Note for Test 6**: the test uses WebRTC functionality for screen-share, and will request access to your browser tab in order to observe the screen. Make sure you select the specific *browser tab* and not "Your Entire Screen" or "Application Window". If you do not feel comfortable about sharing your screen, you can skip this test.


## Marking

There are 6 tasks for this assignment (Total 35 Points):
* Task 1: 6 Points
* Task 2: 6 Points
* Task 3: 10 Points
* Task 4: 6 Points
* Task 5: 6 Point
* Task 6: 1 Point


## Submission instructions

Copy the **commit hash** from Github and enter it in Canvas.

For step-by-step instructions, refer to [the tutorial](canvas-submission.md).


### Deadline

These deadlines will be strictly enforced by the assignment submission system (Canvas).

* Sunday, Oct 10, 2021 23:59:59 PST


### Frequently Asked Questions

* *Can we customize the look of the user interface?*

Yes, you are free to style your app however you want as long as it conforms to the specifications in the instructions above -- i.e., passes the given tests.

* *Is passing all the tests enough to get the points?*

Yes, the tests should give you a good idea of the points you will receive.
However, passing the tests doesn't *guarantee* the marks, as we will look for cases of plagiarism or test-hijacking - there will be human intervention before the final marks are determined.

* *Can we use `nodemon`?*

Yes. Make sure to install it with the flag `--no-save` or `--save-dev`.

* *Can we organize the CSS rules in multiple stylesheets?*

No. The test script looks for the `<link>` element with the `src` set to `style.css`. If it fails to find this element, it stops running the rest of the test cases.

While this is not one of the graded tasks, if we have to step in to make some basic checks pass, we will be deducting marks. This is just a logistical constraint. (This is why we asked to maintain the directory structure)

* *Should we include the test script when we submit?*

Yes. You won't lose marks for not including it, but including it makes it easy for the TAs to inspect your application.