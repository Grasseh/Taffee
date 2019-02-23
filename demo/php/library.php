<?php
require_once('book.php');

class Library {
    
    private $books = array();
    
    public function __construct() {
        $this->initializeBasicLibrary();
    } 

    public function getHighestBookId(){
        if (count($this->books) > 0)
            return max(array_map( function ($book){return $book->getId();}, $this->books));
            //return Math.max.apply(Math, this._books.map(function(book) { return book.getId(); }), -1);
        return -1;
    }
    
    public function addBook($isbn, $title, $description){
        $this->books[] = new Book($this->getNumberOfBook(),$isbn, $title, $description);
    }
    
    public function getBookByIsbn($isbn){
        $book = null;
        for ($x = 0; $x < $this->getNumberOfBook(); $x++) {
            if ($this->books[$x]->getIsbn() == $isbn){
                $book = $this->books[$x];
            }
        } 
        
        return $book;
    }
    
    public function getNumberOfBook(){
        return count($this->books);
    }
    
    public function getLibrary(){
        return $this->books;
    }
    
    public function listBookOfLibrary(){
        for ($x = 0; $x < $this->getNumberOfBook(); $x++) {
            $this->books[$x]->printBook();
        } 
        
    }
    
    private function initializeBasicLibrary(){
        $this->addBook("9781976519857","An Unexpected Cookbook: The Unofficial Book of Hobbit Cookery", "Hobbit cooking book");
        $this->addBook("9781421599465","Dragon Ball Super, Vol. 3", "well ... it's Dragon Ball Super, Vol. 3");
        $this->addBook("9781974701445","Dragon Ball Super, Vol. 4", "well ... it's Dragon Ball Super, Vol. 4");
        $this->addBook("9781974704583","Dragon Ball Super, Vol. 5", "well ... it's Dragon Ball Super, Vol. 5");
    }
    
} 

?>
