
const Printer = require('./printer');
const Book = require('./book');

class Library {
	constructor() {
		this._books = [];
		this.initializeBasicLibrary();
	} 
 
	addBook(isbn, title, description){
		
		this._books.push(new Book(this.getNumberOfBook(),isbn, title, description));
	}
 
    getBookByIsbn(isbn){
		let book = null;
		for (var x = 0; x < this.getNumberOfBook(); x++) {
			if (this._books[x].getIsbn() === isbn){
				book = this._books[x];
			}
		} 
		
        return book;
    }
	
	getNumberOfBook(){
		return this._books.length;
	}
	
	getLibrary(){
		return this._books;
	}
	
	listBookOfLibrary(){
		for (var x = 0; x < this.getNumberOfBook(); x++) {
			this._books[x].printBook();
		} 
		
	}
	
	initializeBasicLibrary(){
		this.addBook("9781976519857","An Unexpected Cookbook: The Unofficial Book of Hobbit Cookery", "Hobbit cooking book");
		this.addBook("9781421599465","Dragon Ball Super, Vol. 3", "well ... it's Dragon Ball Super, Vol. 3");
		this.addBook("9781974701445","Dragon Ball Super, Vol. 4", "well ... it's Dragon Ball Super, Vol. 4");
		this.addBook("9781974704583","Dragon Ball Super, Vol. 5", "well ... it's Dragon Ball Super, Vol. 5");
	}
	
} 

module.exports = Library;
