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

var mraa = require("mraa") ; // "low" level i/o interace libraray
var Device = require('losant-mqtt').Device; // provide IoT connectivity
var five = require("johnny-five");
var Edison = require("edison-io"); // Intel Edison board plug-in for Johnny-Five

// Create the Losant "IoT" device - your keys here
var device = new Device({
    id: '****',
    key: '****',
    secret: '****'
});

device.connect();

// create the board object
var board = new five.Board({
   io: new Edison()
});

board.on("ready", function(){

    // sensors
    var rotary = new five.Sensor("A0");
    var thermometer = new five.Thermometer({
        controller: "GROVE",
        pin: "A0"
    });

    //actuators
    var led = new five.Led("D2");
    var lcd = new five.LCD({
        controller: "JHD1313M1"
    });

    // test-start display
    lcd.bgColor("blue");
    lcd.autoscroll();
    lcd.cursor(0,0).print("Losant-Edison 0");
    device.on('command', function(command)
    {
        console.log("receiving command from Losant: " + command.name + "which is a  " + typeof(command.name));
        console.log("command payload: " + JSON.stringify(command.payload));
        // parseLosantPayload(command.name,command.payload);
        parseLosantPayload(command.name, JSON.stringify(command.payload),lcd);
    });


}); // end board "ready"

// this is poorly contructed and thought out! change this!
function parseLosantPayload(command,payload,lcd){

    var obj = JSON.parse(payload);

    if ( command == "LCDMSG"){
        console.log("parsing command for LCDMSG");
        console.log(" the msg is: " + obj.msg);
        lcd.cursor(1,0).print("                ");
        lcd.cursor(1,0).print(obj.msg);
    }

    if (command== "LCDBKG"){
        console.log("parsing command for LCDBKG");
        console.log( "The values are:" + obj.R + ", " + obj.G + ", " + obj.B);
        lcd.bgColor(parseInt(obj.R),parseInt(obj.G),parseInt(obj.B));
    }

}
