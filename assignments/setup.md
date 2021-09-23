[<< Back to Assignments](../README.md)

## CPEN322 Assignment Repository Setup

For all the assignments in this course, you will be using Github to share your code with us; you will **need a Github account** and also have **Git installed on your local machine**. First, you will need to provide us with your Github username, so that we can create a private repository for you. This document describes the overall workflow for setting up your assignment repository. The following is an overview:

1. [Install Git or Github Desktop](#install-git)
2. [Create a Github account](#create-a-github-account)
3. [Submit your Github username on UBC Canvas](#share-your-github-username)
4. [Accept invitation and clone your repository](#clone-your-repository)

We also provide two Git tutorial videos for your reference:
1. Basic Git operations: [https://youtu.be/tD-6X4IAXs8](https://youtu.be/tD-6X4IAXs8).
2. Git branching: [https://youtu.be/4icXtQm2-Hw](https://youtu.be/4icXtQm2-Hw). Note that you do not need Git branching feature to finish your assignments, but it can help you better organize your repository.

### Install Git

*If you already use Git or Github Desktop, you can move to the next step.*

Go to [https://git-scm.com/downloads](https://git-scm.com/downloads) and download Git. If you prefer a graphical user interface, you can download [Github Desktop](https://desktop.github.com/), which includes Git.


### Create a Github account

*If you already have a Github account, you can move to the next step.*

If you have not already, [create a Github account](https://github.com).


### Share your Github username

You will need to **share your Github username on Canvas** to receive an invitation to your assignment repository.

1. You will see a link to the "Assignment Repository Setup" assignment on your Canvas course page as shown in the screenshot below. It will appear in the "To Do List" on the right side of the screen as shown in box #2. You can also find them in the "Assignments" menu shown in box #1. Click on the link.

![canvas-setup-0.png](../assets/canvas-setup-0.png?raw=true "Screenshot 0")

2. Click the "Submit Assignment" button.

![canvas-setup-1.png](../assets/canvas-setup-1.png?raw=true "Screenshot 1")

3. You will see a text box like the one shown below.

![canvas-setup-2.png](../assets/canvas-setup-2.png?raw=true "Screenshot 2")

4. Enter your Github username into the text box in the submission page and then click "Submit Assignment". *Make sure there are no other characters such as whitespaces (e.g., `\n`, `\t`)*.

![canvas-setup-3.png](../assets/canvas-setup-3.png?raw=true "Screenshot 3")


### Clone your repository

This walk-through assumes you're working in a Unix environment - i.e. using `ls` for listing directories instead of `dir` as in MS-DOS.

1. After the deadline for the "Assignment Repository Setup" (Sep 26, 2021), you should receive an invitation to your repository. Accept the Github invitation sent to **your primary email address** associated with your Github account.
2. Once you have access to the repository, clone the repository on your local machine by using the `git clone` command as shown in the example below:

```
# In this code example we assume:
#     your Github username is "my-username",
#     your working directory is at "~/cpen322"
# Replace the above two tokens with your own settings.

~/cpen322$ git clone https://github.com/ubc-cpen322-2021/project-my-username.git
```

3. The repository is now copied to your machine at `~/cpen322/project-my-username`. Navigate into the directory to see the content.

```
~/cpen322$ cd project-my-username
~/cpen322/project-my-username$ ll
```

You will see that there are some files already inside your repository along with a `.gitignore` file. We have provided a base directory structure and some blank files. Please maintain the directory structure throughout the project, as it helps with the grading workflow.


4. Enter `git status` in your command line to see which branch you're currently working on and if there are any files that have been added or modified since your last commit.

```
~/cpen322/project-my-username$ git status
On branch master
nothing to commit, working directory clean
```

If you followed the steps so far, the above message should print to your terminal, saying that there is no new or modified files.


5. You can enter `git log` to see the commit history.

```
~/cpen322/project-my-username$ git log
```

The log should show only the first commit that your TA has made.

