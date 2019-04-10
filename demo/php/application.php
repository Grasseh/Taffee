<?php
require_once('library.php');
require_once('printer.php');

class Application {
    private $printer;
    private $library;
    
    public function start(){
        $this->printer = new Printer();
        $this->library = new Library();
        
        $this->printer->basicMessage("Welcome to this library demo!");
        while(true){
            $this->startingChoice();
        }
    }
    
    private function startingChoice(){
        $this->printer->paragrapheStartMessage('Please choose a letter to pick an option : ');
        $this->printer->basicMessage('L - List all books in the library.');
        $this->printer->basicMessage('A - Add a book to the library.');
        $this->printer->basicMessage('U - Update a book of the library.');
        $this->printer->basicMessage('D - Delete a book of the library.');
        $this->printer->basicMessage('exit - Leave the application');

        $response = '';
        $response = readline("");

        $optionsMap = array(
            'L'=> function(){$this->library->listBookOfLibrary();},
            'A'=> function(){$this->addBookChoice();},
            'U'=> function(){$this->updateBookChoice();},
            'D'=> function(){$this->deleteBookChoice();},
            'exit'=> function(){exit();}
        );

        if(!array_key_exists($response, $optionsMap)){
            $this->printer->warningMessage('your choice is not an option');
            return false;
        }
        $optionsMap[$response]();
        return true;
    }
    
    private function addBookChoice(){
        $isbn = '';
        $title = '';
        $description = '';

        $this->printer->paragrapheStartMessage('Please enter the following book\'s informations');

        $this->printer->paragrapheStartMessage('Isbn : ');
        $isbn = readline("");;

        $this->printer->paragrapheStartMessage('Title : ');
        $title = readline("");;

        $this->printer->paragrapheStartMessage('Description : ');
        $description = readline("");;

        if ($this->library->doesIsbnExists($isbn)){
            $this->printer->warningMessage('A book with this isbn is already in the library');
            return;
        }
        $this->library->addBook($isbn, $title, $description);
    }
    
    private function updateBookChoice(){
        $response = '';
        $id = '';
        $bookfound = null;

        while(true){
            while ($bookfound == null){
                $this->printer->paragrapheStartMessage('Please pick the book\'s id or type return');

                $id = readline("");;
                if ($id == 'return')
                    return true;

                $bookfound = $this->library->getBookById($id);

                if ($bookfound == null){
                    $this->printer->warningMessage('No book with this id exists! Try again.');
                }
            }

            $this->printer->paragrapheStartMessage('Please choose a letter to pick an option : ');
            $this->printer->basicMessage('I - Update a book\'s isbn.');
            $this->printer->basicMessage('T - Update a book\'s title.');
            $this->printer->basicMessage('D - Update a book\'s description.');
            $this->printer->basicMessage('return - Go back to main menu.');

            $response = readline("");;

            $optionsMap = array(
                'I' => function($id){return $this->updateIsbn($id);},
                'T' => function($id){return $this->updateTitle($id);},
                'D' => function($id){return $this->updateDescription($id);},
                'return' => function(){return true;}
            );
            if(array_key_exists($response, $optionsMap)){
                $optionsMap[$response]($id);
                return true;
            }
            $this->printer->warningMessage('Your choice is not an option');
        }
    }
    
    private function deleteBookChoice(){
        $id = '';
        $bookfound = null;

        while ($bookfound === null){
            $this->printer->paragrapheStartMessage('Please pick the book\'s id or type return');

            $id = readline("");;
            if ($id === 'return')
                return true;

            $bookfound = $this->library->getBookById($id);

            if ($bookfound === null){
                $this->printer->warningMessage('No book with this id exists! Try again.');
            }
        }

        if (!$this->library->deleteBookById($id)){
            $this->printer->warningMessage('An error occurred while trying to delete.');
            return false;
        }
        $this->printer->paragrapheStartMessage('The book has been deleted.');
        return true;
    }

    private function updateIsbn($id){
        $this->printer->paragrapheStartMessage('Please type the book\'s new isbn : ');
        $isbn = readline("");;
        if (!$this->library->updateBookIsbn($id, $isbn)){
            $this->printer->paragrapheStartMessage('This isbn already exists.');
            return false;
        }
        return true;
    }

    private function updateTitle($id){
        $this->printer->paragrapheStartMessage('Please type the book\'s new title : ');
        $title = readline("");;
        if (!$this->library->updateBookTitle($id, $title)){
            $this->printer->paragrapheStartMessage('This title already exists.');
            return false;
        }
        return true;
    }

    private function updateDescription($id){
        $this->printer->paragrapheStartMessage('Please type the book\'s new description : ');
        $description = readline("");;
        $this->library->updateBookDescription($id, $description);
        return true;
    }
}
?>
