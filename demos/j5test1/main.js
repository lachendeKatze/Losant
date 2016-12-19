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
var five = require("johnny-five");
var Edison = require("edison-io");

var board= new five.Board({
    io: new Edison() 
});

board.on("ready", function(){

    var rotary = new five.Sensor("A0");
    
    var lcd = new five.LCD({
        controller: "JHD1313M1"
    });
    
    rotary.scale(0,255).on("change",function(){
        // console.log("rotary value: " + this.value);
        var r = linear(0xFF, 0x4B, this.value, 0xFF);
        var g = linear(0x00, 0x00, this.value, 0xFF);
        var b = linear(0x00, 0x82, this.value, 0xFF);
        lcd.bgColor(r,g,b);     
    });    
});

function linear(start, end, step, steps){
    return (end-start)*step/steps+start;
}

