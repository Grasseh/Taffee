<?php
require_once('printer.php');

class Book {
    
    private $id;
    private $isbn;
    private $title;
    private $description;
    
    
    public function __construct($id, $isbn, $title, $description) {
        $this->id = $id;
        $this->isbn = $isbn;
        $this->title = $title;
        $this->description = $description;
    }
    
    public function setId($id) {
        $this->id = $id;
    }
    
    public function getId() {
        return $this->id;
    }
    
    public function setTitle($title) {
        $this->title = $title;
    }
    
    public function getTitle() {
        return $this->title;
    }
    
    public function setDescription($description) {
        $this->description = $description;
    }
    
    public function getDescription() {
        return $this->description;
    }
    
    public function setIsbn($isbn) {
        $this->isbn = $isbn;
    }
    
    public function getIsbn() {
        return $this->isbn;
    }
    
    public function printBook(){
        $printer = new Printer();
        
        $printer->paragrapheStartMessage(' ID : ' . $this->id);
        $printer->basicMessage(' ISBN : ' . $this->isbn);
        $printer->basicMessage(' TITLE : ' . $this->title);
        $printer->basicMessage(' DESCRIPTION : ' . $this->description);
    }
} 

?>
