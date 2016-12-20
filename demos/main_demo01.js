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

var mraa = require("mraa") ;
var Device = require('losant-mqtt').Device; // provide IoT connectivity

// add any UPM requires that you need
// and the rest of your app goes here
// see the samples for more detailed examples

// console.log(mraa) ;     // prints mraa object to XDK IoT debug output panel

var APP_NAME = "IoT Analog Read" ;


console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n") ;   // poor man's clear console
console.log("Initializing " + APP_NAME) ;

// get values from A0 port on Edison Grove Base Shield
var analog0 = new mraa.Aio(0);
var analog0Read = function()
{
    return analog0.read();
};

// get values from A1 port on Edison Grove Base Shield
var analog1 = new mraa.Aio(1);
var analog1Read = function()
{
    return analog1.read();
};


// get value from A2 port on Edison Grove Base Shield
var analog2 = new mraa.Aio(2);
var analog2Read = function()
{
    return analog2.read();
};

// type process.exit(0) in debug console to see
// the following message be emitted to the debug console

var calculateTemperature = function(rawAnalogValue)
{
    var B = 4275.0;
    var R = 1023.0 / rawAnalogValue - 1.0;
    R = 100000.0 * R;

    return Math.round(1/(Math.log(R/100000.0)/B+1/298.15)-273.15);
};

// Your keys here!
var device = new Device({
    id: '****',
    key: '****',
    secret: '****'
});

device.connect();

device.on('command', function(command)
{
    console.log("receiving command from Losant: " + command.name);
    console.log("command payload: " + JSON.stringify(command.payload));
    // .log(typeof(command.payload));
});

setInterval(function(){
    var analog0Value = analog0Read();
    var analog1Value = analog1Read();
    var temperature = calculateTemperature(analog2Read());
    console.log("sending: " + analog0Value + ", " + analog1Value, ", " + temperature);
    device.sendState({analogValue: analog0Value, light1: analog1Value, temp: temperature});
},3600);
