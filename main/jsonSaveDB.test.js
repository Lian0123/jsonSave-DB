const fs = require('fs');
const path = require('path');
const config = require('./config');
const JsonSaveDB = require('./jsonSaveDB');

test(`JEST INIT`, () => {
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase1`),{recursive: true});
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase2`),{recursive: true});
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase3`),{recursive: true});
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase3_1`),{recursive: true});
    expect(true).toBe(true);
});

test(`建立一筆新資料庫(成功)`, () => {
    let testDB    = new JsonSaveDB.coreDB();
    
    //測試資料夾是否存在
    testDB.createDB(`testDatabase1`);
    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase1`))).toBe(true);

    //測試資料儲存正確性
    let getInfoDB = JSON.parse(fs.readFileSync(path.join(config.path.savePath,`testDatabase1`,`db.json`)));
    expect(getInfoDB.database).toBe(`testDatabase1`);

})

test(`建立一筆新資料庫(失敗)`, () => {
    let isCatch   = false;
    let testDB    = new JsonSaveDB.coreDB();
    try{
        testDB.createDB(`testDatabase2`);
        testDB.createDB(`testDatabase2`);
    }catch(err){
        isCatch = true;
    }

    //測試快取
    expect(isCatch).toBe(true);
    
    //測試資料夾是否存在
    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase2`))).toBe(true);
})

test(`重新命名一筆資料庫(成功)`, () => {
    let testDB    = new JsonSaveDB.coreDB();
       
    //測試資料夾是否存在
    testDB.createDB(`testDatabase3`);
    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase3`))).toBe(true);

    //測試資料儲存正確性
    let getInfoDB = JSON.parse(fs.readFileSync(path.join(config.path.savePath,`testDatabase3`,`db.json`)));
    expect(getInfoDB.database).toBe(`testDatabase3`);
    testDB.renameDB(`testDatabase3`,`testDatabase3_1`);

    //測試舊資料夾是否存在
    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase3`))).toBe(false);

    //測試新資料夾是否存在
    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase3_1`))).toBe(true);

    //測試資料儲存正確性
    let getInfoDB2 = JSON.parse(fs.readFileSync(path.join(config.path.savePath,`testDatabase3_1`,`db.json`)));
    expect(getInfoDB2.database).toBe(`testDatabase3_1`);


})




