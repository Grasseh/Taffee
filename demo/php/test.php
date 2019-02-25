<?php
require_once('testFacade.php');
require_once('printer.php');
class Test {

    public function start(){
        $testFacade = new TestFacade();
        $printer = new Printer();
        $book = null;
        
        $printer->basicMessage('Hello World is good : ' . ($testFacade->testHelloWorld() == 'Hello World'));
        
        $printer->basicMessage('Plus one is good : ' . ($testFacade->testPlusOne(1) === 2));

        $printer->basicMessage('Get highest book Id is good : ' . ($testFacade->testGetHighestBookId() === 3));

        $printer->basicMessage('Get book is good : ' . ($testFacade->testGetBookFromLibrary('9781421599465')->getId() === 1));

        $book = $testFacade->testLibraryAddBook('isbn5', 'title5', 'description5');
        $printer->basicMessage('Add book isbn is good: ' . ($book->getIsbn() === 'isbn5'));
        $printer->basicMessage('Add book title is good: ' . ($book->getTitle() === 'title5'));
        $printer->basicMessage('Add book description is good: ' . ($book->getDescription() === 'description5'));

        $book = $testFacade->testUpdateBook();
        $printer->basicMessage('Update isbn is good : ' . ($book->getIsbn() === 'newisbn1'));
        $printer->basicMessage('Update title is good : ' . ($book->getTitle() === 'newtitle1'));
        $printer->basicMessage('Update description is good : ' . ($book->getDescription() === 'newdescription1'));

        $printer->basicMessage('Delete book is good : ' . ($testFacade->testDeleteBook() === 3));

        $printer->basicMessage('Does isbn exists true is good : ' . ($testFacade->testDoesIsbnExists('9781976519857') === true));
        $printer->basicMessage('Does isbn exists false is good : ' . ($testFacade->testDoesIsbnExists('9781976888887') === false));

    }
}

?>
