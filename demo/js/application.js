
const TestFacade = require('./testFacade');
const Library = require('./library');
const Printer = require('./printer');
var readline = require('readline-sync');

class Application {
	
	test(){
		let testFacade = new TestFacade();
		let printer = new Printer();

		printer.basicMessage(testFacade.testHelloWorld());
		printer.basicMessage(testFacade.testLibraryAddBook());
		printer.basicDump(testFacade.testGetBookFromLibrary());
		printer.basicDump(testFacade.testGetLibrary());
	}
	
	start(){
		let printer = new Printer();
		this.test();

		printer.basicMessage("Welcome to this library demo!");
		while(true){
			this.startingChoice();
		}
	}
	
	startingChoice(){
		let printer = new Printer();
		let library = new Library();
		
		printer.paragrapheStartMessage("Please choose a number to pick an option : ");
		printer.basicMessage("L - List all books in the library.");
		printer.basicMessage("A - Add a book to the library.");
		printer.basicMessage("U - Update a book of the library.");
		printer.basicMessage("D - Delete a book of the library.");
		printer.basicMessage("exit - Leave de application");

		
		
		let response = '';
		response = readline.question("");

		switch(response){
			case "L":
				library.listBookOfLibrary();
				break;
			case "A":
				printer.basicMessage("A");
				break;
			case "U":
				printer.basicMessage("U");
				break;
			case "D":
				printer.basicMessage("D");
				break;
			case "exit":
				process.exit(0);
				break;
			default:
				printer.warningMessage("your choice is not an option");
				return false;
				break;
		}
		return true;
	}
}

module.exports = Application;