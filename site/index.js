"use strict";

var dataStore = require('./dataStore.js');
var setupui = require('./setupui.js');

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
$(document).ready(function () {
    dataStore.init();
    setupui();
});
