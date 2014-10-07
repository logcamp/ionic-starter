Ionic Template App
=====================

A starting project for Ionic

# Overview

This is boilerplate for ionic, powered by ``coffeescript``, ``jade`` and ``stylus``. 
[Firebase](https://www.firebase.com/) is also integrated as it runs smoothly with angular.

## PreRequisites

You need to have:

- Ionic: ``npm install -g cordova ionic``
- Gulp: ``npm install --global gulp``

## Installation

- Clone this project: ``git clone https://github.com/tUrG0n/ionic-starter.git``
- Remove the ``.git`` folder.
- run ``npm install; cd app; npm install``

### Naming your project

You need to update your project name in:

- ``app/gulpfile.coffee`` for the ``app_file_name``
- ``app/assets/index.html``, replace template with the name of your app under: ``js/app.js`` and ``/css/app.css``
- ``app/**/*.coffee``, replace any occurance of ``APPNAME`` with the name of your app.


## How to Run

You need to run two commands:

1. ``cd app; gulp`` <- This command will compile and watch your code.
2. ``ionic serve``  <- This command will livereload the app in the browser.
