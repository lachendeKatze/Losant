/*
 * Blank IoT Node.js starter app.
 *
 * Use this template to start an IoT Node.js app on any supported IoT board.
 * The target board must support Node.js. It is helpful if the board includes
 * support for I/O access via the MRAA and UPM libraries.
 *
 * https://software.intel.com/en-us/xdk/docs/lp-xdk-iot
 */


// keep /*jslint and /*jshint lines for proper jshinting and jslinting
// see http://www.jslint.com/help.html and http://jshint.com/docs
/* jslint node:true */
/* jshint unused:true */

"use strict" ;


var mraa = require("mraa");
var five = require("johnny-five");
var Edison = require("edison-io");

var board= new five.Board({
    io: new Edison() 
});

board.on("ready", function(){

    var led13 = new five.Led(13);
    var led2 = new five.Led(2);
    var led4 = new five.Led(3);
    
    led13.blink(500);
    led2.blink(250);
    led4.blink(100);
});

