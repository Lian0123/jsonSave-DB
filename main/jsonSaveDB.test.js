const fs = require('fs');
const path = require('path');
const config = require('./config');
const JsonSaveDB = require('./jsonSaveDB');
const { log } = require('console');
const logErr = false;

test(`JEST INIT`, () => {
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase1`),{recursive: true});
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase2`),{recursive: true});
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase3`),{recursive: true});
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase3_1`),{recursive: true});
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase4`),{recursive: true});
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase4_1`),{recursive: true});
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase5`),{recursive: true});
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase6`),{recursive: true});
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase7`),{recursive: true});
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase8`),{recursive: true});
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase9`),{recursive: true});
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase10`),{recursive: true});
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase11`),{recursive: true});
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase12`),{recursive: true});
    fs.rmdirSync(path.join(config.path.savePath,`testDatabase13`),{recursive: true});
    expect(true).toBe(true);
});

test(`建立一新資料庫(成功)`, () => {
    let isCatch   = false;
    let testDB    = new JsonSaveDB.coreDB();
    
    //測試資料夾是否存在
    testDB.createDB(`testDatabase1`);
    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase1`))).toBe(true);

    //測試資料儲存正確性
    let getInfoDB = JSON.parse(fs.readFileSync(path.join(config.path.savePath,`testDatabase1`,`db.json`)));
    expect(getInfoDB.database).toBe(`testDatabase1`);

});

test(`建立一新資料庫(失敗:重名)`, () => {
    let isCatch   = false;
    let testDB    = new JsonSaveDB.coreDB();
    try{
        testDB.createDB(`testDatabase2`);
        testDB.createDB(`testDatabase2`);
    }catch(err){
        if(logErr)console.log(err);
        isCatch = true;
    }

    //測試快取
    expect(isCatch).toBe(true);
    
    //測試資料夾是否存在
    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase2`))).toBe(true);
});

test(`重新命名一資料庫(成功)`, () => {
    let isCatch   = false;
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


});

test(`重新命名一資料庫(失敗:指派目標已存在))`, () => {
    let isCatch   = false;
    let testDB    = new JsonSaveDB.coreDB();

    //測試資料夾是否存在
    testDB.createDB(`testDatabase4`);
    testDB.createDB(`testDatabase4_1`);
    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase4`))).toBe(true);

    //測試資料儲存正確性
    let getInfoDB = JSON.parse(fs.readFileSync(path.join(config.path.savePath,`testDatabase4`,`db.json`)));
    expect(getInfoDB.database).toBe(`testDatabase4`);
    let getInfoDB2 = JSON.parse(fs.readFileSync(path.join(config.path.savePath,`testDatabase4_1`,`db.json`)));
    expect(getInfoDB2.database).toBe(`testDatabase4_1`);

    try{
        testDB.renameDB(`testDatabase4`,`testDatabase4_1`);
    }catch(err){
        if(logErr)console.log(err);
        isCatch = true;
    }
    expect(isCatch).toBe(true);

    //測試資料夾是否存在
    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase4`))).toBe(true);
    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase4_1`))).toBe(true);

});

test(`重新命名一資料庫(失敗:自我執行))`, () => {
    let isCatch   = false;
    let testDB    = new JsonSaveDB.coreDB();
    
    //測試資料夾是否存在
    testDB.createDB(`testDatabase5`);
    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase5`))).toBe(true);

    //測試資料儲存正確性
    let getInfoDB = JSON.parse(fs.readFileSync(path.join(config.path.savePath,`testDatabase5`,`db.json`)));
    expect(getInfoDB.database).toBe(`testDatabase5`);
 
    try{
        testDB.renameDB(`testDatabase5`,`testDatabase5`);
    }catch(err){
        if(logErr)console.log(err);
        isCatch = true;
    }
    expect(isCatch).toBe(true);

    //測試資料夾是否存在
    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase5`))).toBe(true);
});


test(`移除一資料庫(成功:無Table))`, () => {
    let isCatch   = false;
    let testDB    = new JsonSaveDB.coreDB();

    //測試資料夾是否存在
    testDB.createDB(`testDatabase6`);
    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase6`))).toBe(true);

    //測試資料儲存正確性
    let getInfoDB = JSON.parse(fs.readFileSync(path.join(config.path.savePath,`testDatabase6`,`db.json`)));
    expect(getInfoDB.database).toBe(`testDatabase6`);

    try{
        testDB.removeDB(`testDatabase6`);
    }catch(err){
        if(logErr)console.log(err);
        isCatch = true;
    }
    expect(isCatch).toBe(false);

    //測試資料夾是否存在
    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase6`))).toBe(false);
});

test(`移除一資料庫(失敗:無指定資料庫))`, () => {

    let isCatch   = false;
    let testDB    = new JsonSaveDB.coreDB();

    //測試資料夾是否存在
    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase7`))).toBe(false);

    try{
        testDB.removeDB(`testDatabase7`);
    }catch(err){
        if(logErr)console.log(err);
        isCatch = true;
    }
    expect(isCatch).toBe(true);

});

test(`建立一資料表(成功))`, () => {
    let isCatch   = false;
    let testDB    = new JsonSaveDB.coreDB();

    testDB.createDB(`testDatabase8`);
    testDB.createTable(`testDatabase8`,`table1`);

    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase8`,`table1`,`table.json`))).toBe(true);

    let getInfoTable = JSON.parse(fs.readFileSync(path.join(config.path.savePath,`testDatabase8`,`table1`,`table.json`)));
    expect(getInfoTable.table).toBe(`table1`);
});

test(`建立一筆資料(成功:單呼叫))`, () => {
    let isCatch   = false;
    let testDB    = new JsonSaveDB.coreDB();

    testDB.createDB(`testDatabase9`);
    testDB.createTable(`testDatabase9`,`table1`);
    testDB.insertTableData(`testDatabase9`,`table1`,1234);

    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase9`,`table1`,`data_0.json`))).toBe(true);

    let getInfoRowData = JSON.parse(fs.readFileSync(path.join(config.path.savePath,`testDatabase9`,`table1`,`data_0.json`))).data;
    expect(getInfoRowData.length > 0).toBe(true);
    expect(getInfoRowData[0] === 1234).toBe(true);
});

test(`建立多筆資料(成功:多次呼叫)`, () => {
    let isCatch   = false;
    let testDB    = new JsonSaveDB.coreDB();

    testDB.createDB(`testDatabase10`);
    testDB.createTable(`testDatabase10`,`table1`);
    testDB.insertTableData(`testDatabase10`,`table1`,`1234`);
    testDB.insertTableData(`testDatabase10`,`table1`,12345);
    testDB.insertTableData(`testDatabase10`,`table1`,`uuu`);
    testDB.insertTableData(`testDatabase10`,`table1`,{a:12,b:`popop`});

    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase10`,`table1`,`data_0.json`))).toBe(true);

    let getInfoRowData = JSON.parse(fs.readFileSync(path.join(config.path.savePath,`testDatabase10`,`table1`,`data_0.json`))).data;
    expect(getInfoRowData.length > 0).toBe(true);
    expect(getInfoRowData[0] === `1234`).toBe(true);
    expect(getInfoRowData[1] === 12345).toBe(true);
    expect(getInfoRowData[2] === `uuu`).toBe(true);
    expect(getInfoRowData[3].a === 12).toBe(true);
    expect(getInfoRowData[3].b === `popop`).toBe(true);
});


test(`建立多筆資料(成功:多並行處理)`, () => {
    let isCatch   = false;
    let testDB    = new JsonSaveDB.coreDB();
    let tmpRow    = [];
    
    for (let i = 0; i < 1000; i++) {
        tmpRow.push("aa"+i);
    }
    
    testDB.createDB(`testDatabase12`);
    testDB.createTable(`testDatabase12`,`table1`);
    testDB.multInsertTableData(`testDatabase12`,`table1`,tmpRow);
    
    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase12`,`table1`,`data_0.json`))).toBe(true);

    let getInfoRowData = JSON.parse(fs.readFileSync(path.join(config.path.savePath,`testDatabase12`,`table1`,`data_0.json`))).data;
    expect(getInfoRowData.length > 0).toBe(true);
    
});

test(`搜尋一筆資料(成功)`, () => {

    let isCatch   = false;
    let testDB    = new JsonSaveDB.coreDB();
    let tmpRow    = [];
    
    for (let i = 0; i < 1000; i++) {
        tmpRow.push("aa"+i);
    }
    
    testDB.createDB(`testDatabase13`);
    testDB.createTable(`testDatabase13`,`table1`);
    testDB.multInsertTableData(`testDatabase13`,`table1`,tmpRow);
    testDB.insertTableData(`testDatabase13`,`table1`,`aa1`);
    let getSearch = testDB.searchTableData(`testDatabase13`,`table1`,`aa1`);
    console.log(getSearch);
    expect(getSearch.length > 0).toBe(true);

    expect(fs.existsSync(path.join(config.path.savePath,`testDatabase13`,`table1`,`data_0.json`))).toBe(true);

    let getInfoRowData = JSON.parse(fs.readFileSync(path.join(config.path.savePath,`testDatabase13`,`table1`,`data_0.json`))).data;
    expect(getInfoRowData.length > 0).toBe(true);
});
