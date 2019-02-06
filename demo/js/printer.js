
class Printer {
	
	basicMessage(message){
		console.log(message + "\r\n");
	}
	
	basicDump(message){
		console.log(message);
		console.log("\r\n");
	}
	
	paragrapheStartMessage(message){
		console.log("\r\n\r\n" + message + "\r\n");
	}
	
	warningMessage(message){
		console.log("\r\n\r\n" + message.toUpperCase() + "\r\n\r\n");
	}

} 

module.exports = Printer;
