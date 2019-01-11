class EntryController{
    init(){
        console.info('Hello World');
    }

    notCalledFn(){
        console.log('HAHAHA');
    }
}

let entry = new EntryController();
entry.init();

module.exports = EntryController;
