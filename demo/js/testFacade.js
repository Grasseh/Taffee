const HelloWorld = require('./helloWorld');
const Library = require('./library');
const Book = require('./book');

class TestFacade {
 
    testHelloWorld() {
        return 'Hello World';
    }
	
	testGetBookFromLibrary(){
		let library = new Library();
		
		library.addBook(2, 'isbn2', 'title2','description2');
		let bookReceive = library.getBookByIsbn(0);
		return bookReceive;
	}
	
	testLibraryAddBook(){
		let library = new Library();
		library.addBook(1, 'isbn1', 'title1','description1');
		library.addBook(1, 'isbn2', 'title2','description2');
		library.addBook(1, 'isbn3', 'title3','description3');
		library.addBook(1, 'isbn4', 'title4','description4');
		library.addBook(1, 'isbn5', 'title5','description5');

		return library.getNumberOfBook();
	}
	
	testGetLibrary(){
		let library = new Library();
		library.addBook(1, 'isbn1', 'title1','description1');
		library.addBook(1, 'isbn2', 'title2','description2');
		library.addBook(1, 'isbn3', 'title3','description3');
		library.addBook(1, 'isbn4', 'title4','description4');
		library.addBook(1, 'isbn5', 'title5','description5');

		return library;
	}
	
} 

module.exports = TestFacade;
