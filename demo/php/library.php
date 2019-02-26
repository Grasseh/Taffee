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
        return -1;
    }
    
    public function addBook($isbn, $title, $description){
        $this->books[] = new Book($this->getNumberOfBook(),$isbn, $title, $description);
    }
    
    public function getBookById($id){
        $book = array_pop(array_filter($this->books,function($book) use ($id) {return $book->getId() == $id;}));
        if ($book == 'undefined')
            return null;

        return $book;

    }
    
    public function getBookByIsbn($isbn){
        $book = array_pop(array_filter($this->books,function($book) use ($isbn) {return $book->getIsbn() == $isbn;}));
        if ($book == 'undefined')
            return null;

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
    
    public function updateBookTitle($id, $title){
        $book = $this->getBookById($id);
        if ($book != null){
            $book->setTitle($title);
            return true;
        }

        return false;
    }
    
    public function updateBookIsbn($id, $isbn){
        $book = $this->getBookById($id);
        if ($book != null && !$this->doesIsbnExists($isbn)){
            $book->setIsbn($isbn);
            return true;
        }

        return false;
    }

    public function updateBookDescription($id, $description){
        $book = $this->getBookById($id);
        if ($book != null){
            $book->setDescription($description);
            return true;
        }

        return false;
    }
    
    public function deleteBookById($id){
        for ($x = 0; $x < $this->getNumberOfBook(); $x++) {
            if ($this->books[$x]->getId() == $id){
                array_splice($this->books, $x, 1);
                return true;
            }
        }
        return false;
    }

    public function doesIsbnExists($isbn){
        for ($x = 0; $x < $this->getNumberOfBook(); $x++) {
            if ($this->books[$x]->getIsbn() == $isbn){
                return true;
            }
        }
        return false;
    }
    
    private function initializeBasicLibrary(){
        $this->addBook("9781976519857","An Unexpected Cookbook: The Unofficial Book of Hobbit Cookery", "Hobbit cooking book");
        $this->addBook("9781421599465","Dragon Ball Super, Vol. 3", "well ... it's Dragon Ball Super, Vol. 3");
        $this->addBook("9781974701445","Dragon Ball Super, Vol. 4", "well ... it's Dragon Ball Super, Vol. 4");
        $this->addBook("9781974704583","Dragon Ball Super, Vol. 5", "well ... it's Dragon Ball Super, Vol. 5");
    }
    
} 

?>
