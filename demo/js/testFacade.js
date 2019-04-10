const HelloWorld = require('./helloWorld');
const Library = require('./library');

class TestFacade {

    testHelloWorld() {
        let helloWorld = new HelloWorld();
        return helloWorld.getHelloWorld();
    }

    testPlusOne({number = 1}) {
        return parseInt(number) + 1;
    }

    testGetHighestBookId(){
        let library = new Library();
        return library.getHighestBookId();
    }

    testGetBookFromLibrary(isbn){
        let library = new Library();
        let bookReceive = library.getBookByIsbn(isbn);
        return bookReceive;
    }

    testLibraryAddBook({isbn = 1, title = 'title', description = 'desc'}){
        let library = new Library();
        library.addBook(isbn, title, description);

        return library.getBookByIsbn(isbn).getIsbn();
    }

    testUpdateBook(){
        let library = new Library();
        library.addBook('isbn1', 'title1', 'description1');

        let book = library.getBookByIsbn('isbn1');
        library.updateBookIsbn(book.getId(), 'newisbn1');
        library.updateBookTitle(book.getId(), 'newtitle1');
        library.updateBookDescription(book.getId(), 'newdescription1');

        return library.getBookById(book.getId());
    }

    testDeleteBook(){
        let library = new Library();
        library.deleteBookById(library.getHighestBookId());

        return library.getNumberOfBook();
    }

    testDoesIsbnExists(isbn){
        let library = new Library();
        return library.doesIsbnExists(isbn);
    }

}

module.exports = TestFacade;
