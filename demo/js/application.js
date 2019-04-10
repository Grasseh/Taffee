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
        this._printer.basicMessage('exit - Leave the application');

        let response = '';
        response = readline.question('');


        let optionsMap = {
            'L': this._library.listBookOfLibrary.bind(this._library),
            'A': this.addBookChoice.bind(this),
            'U': this.updateBookChoice.bind(this),
            'D': this.deleteBookChoice.bind(this),
            'exit': process.exit
        };

        if(!optionsMap.hasOwnProperty(response)){
            this._printer.warningMessage('your choice is not an option');
            return false;
        }
        optionsMap[response]();
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

        if (this._library.doesIsbnExists(isbn)){
            this._printer.warningMessage('A book with this isbn is already in the library');
            return;
        }
        this._library.addBook(isbn, title, description);
    }

    updateBookChoice(){
        let response = '';
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

            let optionsMap = {
                'I': this.updateIsbn.bind(this, id),
                'T': this.updateTitle.bind(this, id),
                'D': this.updateDescription.bind(this, id),
                'return': function(){return true;}
            };
            if(optionsMap.hasOwnProperty(response)){
                optionsMap[response]();
                return true;
            }
            this._printer.warningMessage('Your choice is not an option');
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

        if (!this._library.deleteBookById(id)){
            this._printer.warningMessage('An error occurred while trying to delete.');
            return false;
        }
        this._printer.paragrapheStartMessage('The book has been deleted.');
        return true;
    }

    updateIsbn(id){
        this._printer.paragrapheStartMessage('Please type the book\'s new isbn : ');
        let isbn = readline.question('');

        if (!this._library.updateBookIsbn(id, isbn)){
            this._printer.paragrapheStartMessage('This isbn already exists.');
            return false;
        }
        return true;
    }

    updateTitle(id){
        this._printer.paragrapheStartMessage('Please type the book\'s new title : ');
        let title = readline.question('');

        if (!this._library.updateBookTitle(id, title)){
            this._printer.paragrapheStartMessage('This title already exists.');
            return false;
        }
        return true;
    }

    updateDescription(id){
        this._printer.paragrapheStartMessage('Please type the book\'s new description : ');
        let description = readline.question('');

        this._library.updateBookDescription(id, description);
        return true;
    }

}

module.exports = Application;
