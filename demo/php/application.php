<?php
require_once('testFacade.php');
require_once('library.php');
require_once('printer.php');

class Application {
    
    public function test(){
        $testFacade = new TestFacade();
        $printer = new Printer();
        
        $printer->basicMessage($testFacade->testHelloWorld());
        $printer->basicMessage($testFacade->testLibraryAddBook());
        $printer->basicDump($testFacade->testGetBookFromLibrary());
        $printer->basicDump($testFacade->testGetLibrary());
    }
    
    public function start(){
        $printer = new Printer();
        $this->test();
        
        $printer->basicMessage("Welcome to this library demo!");
        while(true){
            $this->startingChoice();
        }
    }
    
    private function startingChoice(){
        $printer = new Printer();
        $library = new Library();
        
        $printer->paragrapheStartMessage("Please choose a number to pick an option : ");
        $printer->basicMessage("L - List all books in the library.");
        $printer->basicMessage("A - Add a book to the library.");
        $printer->basicMessage("U - Update a book of the library.");
        $printer->basicMessage("D - Delete a book of the library.");
        $printer->basicMessage("exit - Leave de application");
        
        $handle = fopen ("php://stdin","r");
        $line = fgets($handle);
        
        switch(trim($line)){
            case "L":
            $library->listBookOfLibrary();
            break;
            case "A":
            $printer->basicMessage("A");
            break;
            case "U":
            $printer->basicMessage("U");
            break;
            case "D":
            $printer->basicMessage("D");
            break;
            case "exit":
            exit();
            break;
            default:
            $printer->warningMessage("your choice is not an option");
            return false;
            break;
        }
        fclose($handle);
        return true;
    }
}
?>
