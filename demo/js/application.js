const Library = require('./library');
const Printer = require('./printer');
let readline = require('readline-sync');

class Application {
    start(){
        this._printer = new Printer();
        this._library = new Library();

        this._printer.basicMessage('Welcome to this library demo!');
        while(true){
            this.startingChoice();
        }
    }

    startingChoice(){
        this._printer.paragrapheStartMessage('Please choose a letter to pick an option : ');
        this._printer.basicMessage('L - List all books in the library.');
        this._printer.basicMessage('A - Add a book to the library.');
        this._printer.basicMessage('U - Update a book of the library.');
        this._printer.basicMessage('D - Delete a book of the library.');
        this._printer.basicMessage('exit - Leave de application');

        let response = '';
        response = readline.question('');

        switch(response){
        case 'L':
            this._library.listBookOfLibrary();
            break;
        case 'A':
            this.addBookChoice();
            break;
        case 'U':
            this.updateBookChoice();
            break;
        case 'D':
            this.deleteBookChoice();
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            this._printer.warningMessage('your choice is not an option');
            return false;
        }
        return true;
    }


    addBookChoice(){
        let isbn = '';
        let title = '';
        let description = '';

        this._printer.paragrapheStartMessage('Please enter the following book\'s informations');

        this._printer.paragrapheStartMessage('Isbn : ');
        isbn = readline.question('');

        this._printer.paragrapheStartMessage('Title : ');
        title = readline.question('');

        this._printer.paragrapheStartMessage('Description : ');
        description = readline.question('');

        if (!this._library.doesIsbnExists(isbn)){
            this._library.addBook(isbn, title, description);
        }
        else{
            this._printer.warningMessage('A book with this isbn is already in the library');
        }
    }

    updateBookChoice(){
        let response = '';
        let isbn = '';
        let title = '';
        let description = '';
        let id = '';
        let bookfound = null;

        while(true){
            while (bookfound === null){
                this._printer.paragrapheStartMessage('Please pick the book\'s id or type return');

                id = readline.question('');
                if (id === 'return')
                    return true;

                bookfound = this._library.getBookById(id);

                if (bookfound === null){
                    this._printer.warningMessage('No book with this id exists! Try again.');
                }
            }

            this._printer.paragrapheStartMessage('Please choose a letter to pick an option : ');
            this._printer.basicMessage('I - Update a book\'s isbn.');
            this._printer.basicMessage('T - Update a book\'s title.');
            this._printer.basicMessage('D - Update a book\'s description.');
            this._printer.basicMessage('return - Go back to main menu.');

            response = readline.question('');

            switch(response){
            case 'I':
                this._printer.paragrapheStartMessage('Please type the book\'s new isbn : ');
                isbn = readline.question('');

                if (!this._library.updateBookIsbn(id, isbn)){
                    this._printer.paragrapheStartMessage('This isbn already exists.');
                }
                return true;
            case 'T':
                this._printer.paragrapheStartMessage('Please type the book\'s new title : ');
                title = readline.question('');

                if (!this._library.updateBookTitle(id, title)){
                    this._printer.paragrapheStartMessage('This title already exists.');
                }
                return true;
            case 'D':
                this._printer.paragrapheStartMessage('Please type the book\'s new description : ');
                description = readline.question('');

                this._library.updateBookDescription(id, description);
                return true;
            case 'return':
                return true;
            default :
                this._printer.warningMessage('Your choice is not an option');
                break;
            }
        }
    }

    deleteBookChoice(){
        let id = '';
        let bookfound = null;

        while (bookfound === null){
            this._printer.paragrapheStartMessage('Please pick the book\'s id or type return');

            id = readline.question('');
            if (id === 'return')
                return true;

            bookfound = this._library.getBookById(id);

            if (bookfound === null){
                this._printer.warningMessage('No book with this id exists! Try again.');
            }
        }

        if (this._library.deleteBookById(id)){
            this._printer.paragrapheStartMessage('The book has been deleted.');
        }
        else {
            this._printer.warningMessage('An error occurred while trying to delete.');
            return false;
        }
        return true;
    }

}

module.exports = Application;
