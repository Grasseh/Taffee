const TestFacade = require('./testFacade');

class Test {

    start(){
        let testFacade = new TestFacade();
        let book = null;

        console.log('Hello World is good : ', testFacade.testHelloWorld() === 'Hello World');
        console.log('Plus one is good : ', testFacade.testPlusOne(1) === 2);

        console.log('Get highest book Id is good : ', testFacade.testGetHighestBookId() === 3);

        console.log('Get book is good : ', testFacade.testGetBookFromLibrary('9781421599465').getId() === 1);

        book = testFacade.testLibraryAddBook('isbn5', 'title5', 'description5');
        console.log('Add book isbn is good: ', book.getIsbn() === 'isbn5');
        console.log('Add book title is good: ', book.getTitle() === 'title5');
        console.log('Add book description is good: ', book.getDescription() === 'description5');

        book = testFacade.testUpdateBook();
        console.log('Update isbn is good : ', book.getIsbn() === 'newisbn1');
        console.log('Update title is good : ', book.getTitle() === 'newtitle1');
        console.log('Update description is good : ', book.getDescription() === 'newdescription1');

        console.log('Delete book is good : ', testFacade.testDeleteBook() === 3);

        console.log('Does isbn exists true is good : ', testFacade.testDoesIsbnExists('9781976519857') === true);
        console.log('Does isbn exists false is good : ', testFacade.testDoesIsbnExists('9781976888887') === false);

    }
}

module.exports = Test;
