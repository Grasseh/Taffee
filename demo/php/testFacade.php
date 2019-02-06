<?php
require_once('helloWorld.php');
require_once('library.php');
require_once('book.php');

class TestFacade {
 
    public function testHelloWorld() {
        return 'Hello World';
    }
	
	public function testGetBookFromLibrary(){
		$library = new Library();
		
		$library->addBook(2, 'isbn2', 'title2','description2');
		$bookReceive = $library->getBookByIsbn(0);
		return $bookReceive;
	}
	
	public function testLibraryAddBook(){
		$library = new Library();
		$library->addBook(1, 'isbn1', 'title1','description1');
		$library->addBook(1, 'isbn2', 'title2','description2');
		$library->addBook(1, 'isbn3', 'title3','description3');
		$library->addBook(1, 'isbn4', 'title4','description4');
		$library->addBook(1, 'isbn5', 'title5','description5');

		return $library->getNumberOfBook();
	}
	
	public function testGetLibrary(){
		$library = new Library();
		$library->addBook(1, 'isbn1', 'title1','description1');
		$library->addBook(1, 'isbn2', 'title2','description2');
		$library->addBook(1, 'isbn3', 'title3','description3');
		$library->addBook(1, 'isbn4', 'title4','description4');
		$library->addBook(1, 'isbn5', 'title5','description5');

		return $library;
	}
	
} 

?>