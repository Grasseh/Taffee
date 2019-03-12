[](i:NodeInvoker)
[](m:../testFacade.js)


# Saying hello world!
Our project rocks and needs to output Hello world!

## Example
When the project function is called then we see the output [Hello World](t:Test.testHelloWorld()).

## Example
When the project function is called then we see the output [Hella World](t:Test.testHelloWorld()).

## Adding a number

Adding a single number is simple.
Assuming we have a number [5](var:var1), then if the system adds one, 
we see the output [51](t:Test.testPlusOne(var1)).

## Adding a book
Assuming we have a book with an ISBN number[12345](var:isbn), a title [Test And Testing](var:title) and a description [A book about tests](var:test),
when we add it to the library, then we get the highest ISBN [12345](t:testLibraryAddBook(isbn,title,test))