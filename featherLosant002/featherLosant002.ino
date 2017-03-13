/* 
 *  Huzzah Feather(ESP8266) - Losant Sketch
 *  Using the Losant.h library greatly simplifies MQTT/JSON communications to Losant
 *  Greg, Eli, Marcos
 *  Connect to WiFi -> Connect to Losant -> Tx/Rx JSON payloads
 *  
 */

#include <ESP8266WiFi.h>
#include <Losant.h>
#include <SoftwareSerial.h>

/*
 * Credentials to establish IoT connecctivty, first to WiFi then to Losant
 * !!!!!!! DELETE CREDENTIALS BEFORE POSTZING CODE IN PUBLIC !!!!!!!!!!!!!
 */

// WiFi credentials.
const char* WIFI_SSID = "";
const char* WIFI_PASS = "";

// Losant credentials.
const char* LOSANT_DEVICE_ID = "";
const char* LOSANT_ACCESS_KEY = "";
const char* LOSANT_ACCESS_SECRET = "";

WiFiClientSecure wifiClient;
LosantDevice device(LOSANT_DEVICE_ID);

// experimental characterisitics
String ratID =  String("nullID");
int trialNum = 0;
int startTime = 0;
int event = 0;
int timeHeld = 0;


void setup() 
{
  // This serial is used for debugging purposes, SoftwareSerial will be added to communicate to the Due/Embedded apparatus
  Serial.begin(115200);
  delay(2000);

  /*
   * handleCommand is the callback function used to interpret command payloads being sent from Losant
   */
  
  device.onCommand(&handleCommand);
  connect(); // function to connect to WiFi then Losant,have had to attempt mutliple reset reconnections
}

void loop() 
{
  bool toReconnect = false;

  if(WiFi.status() != WL_CONNECTED) {
    Serial.println("Disconnected from WiFi");
    toReconnect = true;
  }

  if(!device.connected()) {
    Serial.println("Disconnected from Losant");
    Serial.println(device.mqttClient.state());
    toReconnect = true;
  }

  if(toReconnect) {
    connect();
  }

  device.loop();

  delay(100);
}
void connect() 
{
  // Connect to Wifi.

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(WIFI_SSID);

  
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) 
  {
    delay(500);
    Serial.print(".");
  }

  // Connect to Losant.
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  Serial.println();
  Serial.print("Connecting to Losant...");
  device.connectSecure(wifiClient, LOSANT_ACCESS_KEY, LOSANT_ACCESS_SECRET);
  while(!device.connected()) 
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected!");
  Serial.println("This device is now ready for use!");
}

void handleCommand(LosantCommand *command)
{
  // interpret paylodas coming from the Losant Dashboard
  Serial.print("Command received: ");
  Serial.println(command->name);
  JsonObject& payload = *command->payload;
  payload.printTo(Serial);
  if (strcmp(command->name, "CMD0")==0)
  {
    Serial.print("CMD0 Recognized, ");
    Serial.println(payload["VALUE0"].asString());
  }
  if (strcmp(command->name, "CMD1") == 0)
  {
    Serial.print("CMD1 Recognized, ");
    Serial.println(payload["VALUE"].asString());
  }

  if (strcmp(command->name, "REPLY") == 0)
  {
    Serial.print("REPLY Recognized");  
  }

  if (strcmp(command->name, "SETID") == 0)
  {
    Serial.print("SETID Recognized: ");
    ratID = payload["VALUE"].asString();
    Serial.println(ratID);  
  }

  if (strcmp(command->name, "SENDEXP") == 0)
  {
    Serial.print("SENDEXP Recognized, ");
    sendExperiment();
  }
  
}

void sendExperiment()
{
    // create random experimental characterisitics
    generateData();
  
    // create JSON payload
    StaticJsonBuffer<250> jsonBuffer;
    JsonObject& root = jsonBuffer.createObject();
    root["data"];
    JsonObject& data = root.createNestedObject("data");
    //make sure these variables are under Device Attributes in the Properties portion of the Device on Losant
    data["RatID"] = ratID;
    data["TrialNum"] = String(trialNum);
    data["CurrentTrialStartTime"] = String(startTime);
    data["EventsCompleted"] = String(event);
    data["TimeHeld"] = String(timeHeld); 
    device.sendState(root);
}

void generateData()
{
  trialNum = random(100);
  startTime = random(24);
  event = random(25);
  timeHeld = random(60); 
  Serial.print("Rat ID: ");
  Serial.println(ratID);
  Serial.println("Random Experiment Characteristics: ");
  Serial.println("===================================");
  Serial.print("Trial Number: ");Serial.println(trialNum);
  Serial.print("Start Time: ");Serial.println(startTime);
  Serial.print("Event Number: ");Serial.println(event);
  Serial.print("Time Held: ");Serial.println(timeHeld);
  Serial.println("===================================");

   
}
