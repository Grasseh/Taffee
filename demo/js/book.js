const Printer = require('./printer');

class Book {
    constructor(id, isbn, title, description) {
        this._id = id;
        this._isbn = isbn;
        this._title = title;
        this._description = description;
    }

    setId(id) {
        this._id = id;
    }

    getId() {
        return this._id;
    }

    setTitle(title) {
        this._title = title;
    }

    getTitle() {
        return this._title;
    }

    setDescription(description) {
        this._description = description;
    }

    getDescription() {
        return this._description;
    }

    setIsbn(isbn) {
        this._isbn = isbn;
    }

    getIsbn() {
        return this._isbn;
    }

    printBook(){
        let printer = new Printer();

        printer.paragrapheStartMessage(` ID : ${ this._id}`);
        printer.basicMessage(` ISBN : ${ this._isbn}`);
        printer.basicMessage(` TITLE : ${ this._title}`);
        printer.basicMessage(` DESCRIPTION : ${ this._description}`);
    }
}

module.exports = Book;
