

#include "SoftwareSerial.h"
#include <SPI.h>
#include <MFRC522.h>
 
#define SS_PIN 10
#define RST_PIN 9
MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance.
 
String uniqueCode="57eab3ad9474e914d73e3f30";
String by="";
String ssid ="Lenovo";

String password="hellohello";

SoftwareSerial esp(6,7);

String data;

String server = "192.168.43.29"; 

String uri = "/device";

String URLEncode(String msg)
{
    const char *hex = "0123456789abcdef";
    String encodedMsg = "";
    for(int i =0 ;i<msg.length();i++){
      if( ('a' <= msg[i] && msg[i] <= 'z')
                || ('A' <= msg[i] && msg[i] <= 'Z')
                || ('0' <= msg[i] && msg[i] <= '9') ) {
            encodedMsg += msg[i];
        } else {
            encodedMsg += '%';
            encodedMsg += hex[msg[i] >> 4];
            encodedMsg += hex[msg[i] & 15];
        }
    }
//    while (*msg!='\0'){
//        if( ('a' <= *msg && *msg <= 'z')
//                || ('A' <= *msg && *msg <= 'Z')
//                || ('0' <= *msg && *msg <= '9') ) {
//            encodedMsg += *msg;
//        } else {
//            encodedMsg += '%';
//            encodedMsg += hex[*msg >> 4];
//            encodedMsg += hex[*msg & 15];
//        }
//        msg++;
//    }
    return encodedMsg;
}


void setup() {


esp.begin(115200);

Serial.begin(115200);

reset();

connectWifi();

SPI.begin();      // Initiate  SPI bus
  mfrc522.PCD_Init();   // Initiate MFRC522
  Serial.println("Waiting to read car ID...");
  Serial.println();

}

void reset() {

esp.println("AT+RST");

delay(1000);

if(esp.find("OK") ) Serial.println("Module Reset");

}

//connect to your wifi network

void connectWifi() {

String cmd = "AT+CWJAP=\"" +ssid+"\",\"" + password + "\"";

esp.println(cmd);

delay(4000);

if(esp.find("OK")) {

Serial.println("Connected!");

}

else {

connectWifi();

Serial.println("Cannot connect to wifi"); }

}



void loop () {

 if ( ! mfrc522.PICC_IsNewCardPresent()) 
  {
    return;
  }
  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) 
  {
    return;
  }
  //Show UID on serial monitor
  Serial.print("UID tag :");
  String content= "";
  byte letter;
  for (byte i = 0; i < mfrc522.uid.size; i++) 
  {
     Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
     Serial.print(mfrc522.uid.uidByte[i], HEX);
     content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
     content.concat(String(mfrc522.uid.uidByte[i], HEX));
  }
  Serial.println();
  Serial.print("Message : ");
  content.toUpperCase();
  Serial.println(content);
//  by=content;
  by=URLEncode(content);
  Serial.println(by);
  httppost();

delay(1000);

}


void httppost () {

esp.println("AT+CIPSTART=\"TCP\",\"" + server + "\",3000");//start a TCP connection.

if( esp.find("OK")) {

Serial.println("TCP connection ready");

} delay(1000);

String str = "uniqueCode=57eab3ad9474e914d73e3f30&by="+by;

String postRequest =

"POST " + uri + " HTTP/1.0\r\n" +

"Host: " + server + "\r\n" +

"Accept: *" + "/" + "*\r\n" +

"Content-Type: application/x-www-form-urlencoded\r\n" +
"Content-Length: " + str.length() + "\r\n" +

"\r\n" + str;

String sendCmd = "AT+CIPSEND=";//determine the number of caracters to be sent.

esp.print(sendCmd);

esp.println(postRequest.length() );

delay(500);

if(esp.find(">")) { Serial.println("Sending.."); esp.print(postRequest);

if( esp.find("SEND OK")) { Serial.println("Packet sent");

while (esp.available()) {

String tmpResp = esp.readString();

Serial.println(tmpResp);

}

// close the connection

esp.println("AT+CIPCLOSE");

}

}}

