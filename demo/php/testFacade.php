<?php
require_once('helloWorld.php');
require_once('library.php');

class TestFacade {
 
    public function testHelloWorld() {
        $helloWorld = new HelloWorld();
        return $helloWorld->getHelloWorld();
    }
    
    public function testPlusOne($number) {
        return $number + 1;
    }
	
    public function testGetHighestBookId(){
        $library = new Library();
        return $library->getHighestBookId();
    }
    
    public function testGetBookFromLibrary($isbn){
        $library = new Library();
        $bookReceive = $library->getBookByIsbn($isbn);
        return $bookReceive;
    }
	
    public function testLibraryAddBook($isbn, $title, $description){
        $library = new Library();
        $library->addBook($isbn, $title, $description);

        return $library->getBookByIsbn($isbn);
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
