"use strict";

var dataStore = require('./dataStore.js');
var setupui = require('./setupui.js');

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
$(document).ready(function () {
    console.log('localStorage', localStorage);
    var counter = localStorage.counter;
    console.log('localStorage.counter', localStorage.counter);
    if(!counter) counter = 1;
    else ++counter;
    localStorage.counter = counter;
    dataStore.init();
    setupui();
});
