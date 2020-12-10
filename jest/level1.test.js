const fs      = require('fs');
const path    = require('path');
const config   = require('./config');

function deleteTestFile(fileName) {
    fs.rmdirSync(path.join(config.path.savePath, fileName), { recursive: true });
}

test(`JEST INIT`, () => {
    deleteTestFile(`databaseAddTest(ok1)`);
    deleteTestFile(`databaseAddTest(ok2)`);
    deleteTestFile(`databaseAddTest(error1)`);
    deleteTestFile(`databaseAddTest(error2)`);
    deleteTestFile(`databaseAddTest(error3)`);
    expect(true).toBe(true);
});

/*
 * |------------------------------------------------------------------
 * | TestID : databaseAddTest(ok1)
 * | About  : add one database in this database system.
 * |
 */
test(`databaseAddTest(ok1)`, () => {
    const db1     = `databaseAddTest(ok1)`;
    
    let testDB    = new JsonSaveDB.coreDB();
    
    //test file path is not exists
    testDB.createDB(db1);
    expect(fs.existsSync(path.join(config.path.savePath,db1))).toBe(true);

    //test database name is will need(it is not only file path name,but also json name need follow this)
    let getInfoDB = JSON.parse(fs.readFileSync(path.join(config.path.savePath,db1,`db.json`)));
    expect(getInfoDB.database).toBe(db1);

});