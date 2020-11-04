#!/usr/bin/env node

var start = require('./index.js')
var myArgs = process.argv.slice(2);
var action = myArgs[0];

switch(action){
    case 'start':
        start();
    break;
    default:
        start();
    break;
}