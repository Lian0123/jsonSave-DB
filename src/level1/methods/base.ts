import * as fs       from "fs";
import * as path     from "path";
/*
 * |-------------------------------------------------------------------
 * | About:
 * |  test value is undefined.
 * |
 * | Example:
 * |  ||===============================================================
 * |  || import { isUndefined } base from "./base";
 * |  || let a1 = { a:"1234" };
 * |  || 
 * |  || //return true
 * |  || isUndefined(a1?.a);
 * |  || 
 * |  || //return false
 * |  || isUndefined(a1?.b);
 * |  || 
 */
export function isUndefined(value :any) :boolean{
    return value === undefined;
}

/*
 * |-------------------------------------------------------------------
 * | About:
 * |  test value is defined.
 * |
 * | Example:
 * |  ||===============================================================
 * |  || import { isDefined } base from "./base";
 * |  || let a1 = { a:"1234" };
 * |  || 
 * |  || //return false
 * |  || isDefined(a1?.a);
 * |  || 
 * |  || //return true
 * |  || isDefined(a1?.b);
 * |  || 
 */
export function isDefined(value :any) :boolean{
    return value !== undefined;
}

/*
 * |-------------------------------------------------------------------
 * | About:
 * |  define database user list data.
 * |  
 * |  * user   : user name for auth system
 * |  * atuh   : using auth system sha,get auth code(if database auth is false, it will be "")
 * |  * timeUp : also in auth system defined, but it will be user and Admin konw who auth is timeup
 * |  
 * | Example:
 * |  ||===============================================================
 * |  || import { userListType } base from "./base";
 * |  || let newUser :userListType = {
 * |  ||    user   : "ィア_N0123",
 * |  ||    atuh   : "62bbbae23b04bb2d606f80dcc0652b8a931ba5ab1e4f77446edd62d239934582",
 * |  ||    timeUp : "2038-01-19",
 * |  || }
 * |  || 
 */
export type userListType = {
    user   : string,
    auth   : string,
    timeUp : string,
}

/*
 * |-------------------------------------------------------------------
 * | About:
 * |  define database.json config architecture, it will be using in any database function.
 * |  
 * |  * database  : database name
 * |  * about     : meat database info, but text length will small than limit.databaseAboutLength
 * |  * date      : database create date
 * |  * time      : database create date of time
 * |  * auth      : the database is follow auth system (level2+)
 * |  * userList  : user data show to user/admin
 * |  * tableList : which table in this database
 * |  * limit     : some data input limit, using for security
 * |      * databaseNameLength  : this "database" text input limit
 * |      * databaseAboutLength : this "about" text input limit
 * |
 * | Example:
 * |  ||===============================================================
 * |  || import { databaseJsonType } base from "./base";
 * |  || let newDatabase :databaseJsonType = {
 * |  ||    database   : "testDatabase001",
 * |  ||    about      : "it is a new test database...."
 * |  ||    date       : "2020-01-01",
 * |  ||    time       : "23:59:00",
 * |  ||    auth       : true,
 * |  ||    userList   :[ 
 * |  ||        {
 * |  ||            user   : "ィア_N0123",
 * |  ||            atuh   : "62bbbae23b04bb2d606f80dcc0652b8a931ba5ab1e4f77446edd62d239934582",
 * |  ||            timeUp : "2038-01-19",
 * |  ||        }
 * |  ||    ],
 * |  ||    tableList  : [
 * |  ||        "log",    
 * |  ||        "user",
 * |  ||        "service",
 * |  ||    ],
 * |  ||    limit      : {
 * |  ||        databaseNameLength : 20,
 * |  ||        databaseAboutLength: 100,
 * |  ||    } 
 */
export type databaseJsonType = {
    database?      : string,
    about?         : string,
    date?          : string,
    time?          : string,
    auth?          : boolean,
    userList?      : Array<userListType>,
    tableList?     : Array<string>,
    limit?         : {
        databaseNameLength?  : number,
        databaseAboutLength? : number,
    }
};

/*
 * |-------------------------------------------------------------------
 * | About:
 * |  define table.json config architecture, it will be using in any database table function.
 * |  
 * |  * table   : table name
 * |  * about   : meat table info, but text length will small than limit.tableNameLength
 * |  * forDB   : the table if from which database
 * |  * date    : table create date
 * |  * time    : table create date of time
 * |  * fileSize : the table of row data is save
 * |  * limit   : some data input limit, using for security
 * |      * tableNameLength  : this "database" text input limit
 * |      * tableAboutLength : this "about" text input limit
 * |
 * | * fileSize Example:
 * |  * if we have a 12 row data, just like:
 * |    [
 * |        {id:0,  data:"test_000", about:"it is NoSQL"},
 * |        {id:1,  data:"test_001"},
 * |        {id:2,  data:"test_002"},
 * |        {id:3,  data:"test_003"},
 * |        {id:4,  data:"test_004"},
 * |        {id:5,  data:"test_005"},
 * |        {id:6,  data:"test_006"},
 * |        {id:7,  data:"test_007"},
 * |        {id:8,  data:"test_008"},
 * |        {id:9,  data:"test_009"},
 * |        {id:10, data:"test_010"},
 * |        {id:11, data:"haachama chama"},
 * |    ]
 * |
 * | * when table fileSize was set 3, it will be save 4 file:
 * |
 * |  |-----       |-----       |-----       |-----       
 * |  |      \     |      \     |      \     |      \     
 * |  |      |     |      |     |      |     |      |     
 * |  |      |     |      |     |      |     |      |     
 * |   ------|      ------|      ------|      ------|     
 * |   0.json       1.json       2.json       3.json      
 * |  
 * |    * 0.json: save id 0,1,2
 * |    * 1.json: save id 3,4,5
 * |    * 2.json: save id 6,7,8
 * |    * 3.json: save id 9,10,11
 * |   
 * | * but when table fileSize was set 4,  it will be save 3 file:
 * |
 * |  |-----       |-----       |-----        
 * |  |      \     |      \     |      \     
 * |  |      |     |      |     |      |     
 * |  |      |     |      |     |      |     
 * |   ------|      ------|      ------|     
 * |   0.json       1.json       2.json      
 * |  
 * |    * 0.json: save id 0,1,2,3
 * |    * 1.json: save id 4,5,6,7
 * |    * 2.json: save id 8,9,11,12
 * |
 * | * so if we have a big data, set a we think best fileSize number, just like os frame
 * | * btw, if we have a best fileSize number, we can uesing mult data control with worker can Improve performance
 * |
 * | Example:
 * |  ||===============================================================
 * |  || import { databaseJsonType } base from "./base";
 * |  || let newTable :databaseJsonType = {
 * |  ||    table   : "testTable001",
 * |  ||    about   : "it is a test table",
 * |  ||    forDB   : "testDatabase001",
 * |  ||    date    : "2020-01-02",
 * |  ||    time    : "00:12:11",
 * |  ||    fileSize : 20
 * |  ||    limit      : {
 * |  ||        tableNameLength : 20,
 * |  ||        tableAboutLength: 50,
 * |  ||    } 
 */
export type TableJsonType = {
    table?    : string,
    about?    : string,
    forDB?    : string,
    date?     : string,
    time?     : string,
    fileSize?  : number,
    limit? : {
        tableNameLength?     : number,
        tableAboutLength?    : number,
    }
};

/*
 * |-------------------------------------------------------------------
 * | About:
 * |  define databaseCreate.ts function option, the databaseCreate function like:
 * |  || function databaseCreate(databaseName :string,option? :databaseCreateOption){
 * |  ||   //TODO: database create event
 * |  || }
 * |  
 * |  * dbConfig   : setting database option
 * |    * about     : database about text, default is ""
 * |    * auth      : the database is using auth system, default is false
 * |    * userList  : add user to database, it is a Array<Object>, just follow auth is true, default is []
 * |      * user   : user name (it will in auth system)
 * |      * timeup : a option for user using database, when nowtime > timeup, it will be not auth by user, setting is save in auth system, default is "99999-12-31"
 * |    * tableList : fast add table to database, default is []
 * |      * table  : table name
 * |      * option : a option for fast add, please follow the "type tableCreateOption", default is {}
 * |    * limit     : some of limit setting
 * |      * databaseNameLength  : "database name" text input limit, it will work in edit database time, default is 1024
 * |      * databaseAboutLength : "database about" text input limit, it will work in edit database time, default is 1024
 * |  * regexpWall : a regex as wall, any create name will follow regex can be run, default is new RegExp(/^\s*$/)
 * |  * fsOption   : the database.json is write by fs model, so you can setting fs.mkdirSync and fs.writeFile option
 * |    * mkdirSyncOption     : follow fs.mkdirSync option
 * |    * writeFileSyncOption : follow fs.writeFileSync option
 * |
 * |  * Btw, timeup setting in POSIX X86 UNIX/UNIX-Like system 2038 after, will let system all auth be error, 2038 after plase using x86-64
 * |
 * | Example:
 * |  ||===============================================================
 * |  || import { databaseCreate } from "./databaseCreate";
 * |  || 
 * |  || databaseCreate("testDatabase001",{
 * |  ||    dbConfig  : {
 * |  ||        about     : "it is a new test database....",
 * |  ||        auth      : true,
 * |  ||        userList  : [
 * |  ||            {
 * |  ||                user   : "ィア_N0123",
 * |  ||                timeUp : "2038-01-19"
 * |  ||            },
 * |  ||        ],
 * |  ||        tableList : [
 * |  ||            {
 * |  ||                table: "testTable001"
 * |  ||            },
 * |  ||            {
 * |  ||                table  : "testTable002",
 * |  ||                option : {
 * |  ||                    //TODO
 * |  ||                }
 * |  ||            }
 * |  ||        ],
 * |  ||        limit : {
 * |  ||            databaseNameLength  : 20,
 * |  ||            databaseAboutLength : 100
 * |  ||        }
 * |  ||    },
 * |  || });
 */
export type databaseCreateOption = {
    dbConfig? : {
        about?     : string,
        auth?      : boolean,
        userList?  : Array<{user  :string ,timeup? :string}>,
        tableList? : Array<{table :string ,option? :tableCreateOption}>,
        limit?     : {
            databaseNameLength?  : number,
            databaseAboutLength? : number,
        }
    } ,
    regexpWall? : RegExp,
    fsOption? : {
        mkdirSyncOption?     : fs.MakeDirectoryOptions
        writeFileSyncOption? : fs.WriteFileOptions
    }
};

/*
 * |-------------------------------------------------------------------
 * | About:
 * |  define databaseRename.ts function option, the databaseRename function like:
 * |  || function databaseRename(fromDatabase :string, toDatabase :string, option? :databaseRenameOption){
 * |  ||   //TODO: database rename event
 * |  || }
 * |
 * |  * regexpWall : a regex as wall, any rename name will follow regex can be run, default is new RegExp(/^\s*$/)
 * |  * fsOption   : the database.json is write by fs model, so you can setting fs.writeFile option
 * |    * writeFileSyncOption : follow fs.writeFileSync option
 * |  
 * | Example:
 * |  ||===============================================================
 * |  || import { databaseRename } from "./databaseRename";
 * |  || 
 * |  || databaseCreate("testDatabase001",{
 * |  ||    //we let user can't rename be "admin" "user" "config",we can set the wall, we will be used in level3
 * |  ||    regexWall : new RegExp(/^(admin|user|config)$/),
 * |  || });
 */
export type databaseRenameOption = {
    regexWall?  : RegExp,
    fsOption?   : {
        writeFileSyncOption? : fs.WriteFileOptions
    }
};

/*
 * |-------------------------------------------------------------------
 * | About:
 * |  define databaseRemove.ts function option, the databaseRemove function like:
 * |  || function databaseRemove(database :string, option? :databaseRemoveOption){
 * |  ||   //TODO: database remove event
 * |  || }
 * |
 * |  * dataWall      : a string array as wall, just like we get info from database.json and not show some data
 * |  * cleanFileLock : it is a protect flag, when database has anyone table, it can't be remove, however cleanFileLock === ture, it will do
 * |  * fsOption      : the database.json is write by fs model, so you can setting fs.writeFile option
 * |    * rmSyncOption : follow fs.RmOptions option
 * |  
 * | Example:
 * |  ||===============================================================
 * |  || import { databaseRemove } from "./databaseRemove";
 * |  || 
 * |  || databaseRemove("testDatabase001",{
 * |  ||    //we let user can't reomve be "admin" "config",we can set the wall, we will be used in level3
 * |  ||    regexWall     : new RegExp(/^(admin|config)$/),
 * |  ||    cleanFileLock : true,
 * |  || });
 */
export type databaseRemoveOption = {
    regexWall?     : RegExp,
    cleanFileLock? : boolean, 
    fsOption?      : {
        rmSyncOption? : fs.RmOptions
    }
}

/*
 * |-------------------------------------------------------------------
 * | About:
 * |  define databaseGet.ts function option, the databaseGet function like:
 * |  || function databaseGet(database :string, option? :databaseGetOption){
 * |  ||   //TODO: database get data event
 * |  || }
 * |
 * |  * dataWall   : a string array as wall, just like we get info from database.json and not show some data
 * |  
 * | Example:
 * |  ||===============================================================
 * |  || import { databaseGet } from "./databaseGet";
 * |  || 
 * |  || databaseGet("testDatabase001",{
 * |  ||    //we let user can't get database.json of "about" "userList" "limit", we can set the wall, we will be used in level3
 * |  ||    regexWall : new RegExp(/^(about|userList|limit)$/),
 * |  || });
 * |  ||
 * |  || // user will be get 
 * |  || // {
 * |  || //   database   : "testDatabase001",
 * |  || //   date       : "2020-01-01",
 * |  || //   time       : "23:59:00",
 * |  || //   auth       : true,
 * |  || //   tableList  : [
 * |  || //       "log",    
 * |  || //       "user",
 * |  || //       "service",
 * |  || //   ]
 * |  || // }
 */
export type databaseGetOption = {
    dataWall?  : Array<String>,
};

/*
 * |-------------------------------------------------------------------
 * | About:
 * |  define databaseSet.ts function option, the databaseSet function like:
 * |  || function databaseSet(database :string, databaseConfig: databaseSetConfig, option? :databaseSetOption){
 * |  ||   //TODO: database set data event
 * |  || }
 * |  it just follow databaseCreate.option, but this setting will be replace, so please don't replcae ohter member, just like asign "" or 0
 * | 
 * |  * about : change database.json about text input, default is not be change
 * |  * auth  : change database.json about text input, default is not be change
 * |  * limit : database.json some mumber limit
 * |    * databaseNameLength  : change database.json name text can input max size, default is not be change 
 * |    * databaseAboutLength : change database.json about text can input max size, but it will change after this procese, default is not be change
 * | 
 * |  * before time:
 * |    * about is "AAAAAAAAAA" and databaseAboutLength is 15
 * |
 * |  * when we change the about text and change databaseAboutLength:
 * |    databaseSet("testDatabase001",{about:"12345678901234567890",limit:{databaseAboutLength:30});
 * |
 * |  * this time about new text length is 20, 20 > databaseAboutLength(15), so it will throw error
 * |
 * | Example:
 * |  ||===============================================================
 * |  || import { databaseSetConfig } base from "./base";
 * |  || import { databaseSet } from "./databaseSet";
 * |  || 
 * |  || let newConfig :databaseSetConfig = {
 * |  ||    about : "it is new about text",
 * |  || });
 * |  ||
 * |  || databaseSet("testDatabase001",newConfig);
 * |  ||
 * |  || //now the testDatabase001 database of database.json about member will be replace to "it is new about text"
 */
export type databaseSetConfig = {
    about?     : string,
    auth?      : boolean,
    limit?     : {
        databaseNameLength?  : number,
        databaseAboutLength? : number,
    }
};

/*
 * |-------------------------------------------------------------------
 * | About:
 * |  define databaesSet.ts function option, the databaseSet function like:
 * |  || function databaseSet(database :string, databaseConfig: databaseSetConfig, option? :databaseSetOption){
 * |  ||   //TODO: database set data event
 * |  || }
 * | 
 * |  
 * | Example:
 * |  ||===============================================================
 * |  || import { databaseSet } from "./databaseSet";
 * |  || 
 * |  || let newConfig :databaseSetConfig = {
 * |  ||    about : "it is new about text",
 * |  || });
 * |  ||
 * |  || //When we using auth string in dataWall, now about will replace as "", but auth assign true can't be assign
 * |  || databaseSet("testDatabase001",{about:"",auth:ture},{dataWall:["auth"]});
 * |  ||
 */
export type databaseSetOption = {
    dataWall?  : Array<string>,
};

/*
 * |-------------------------------------------------------------------
 * | About:
 * |  define databaseCopy.ts function option, the databaseCopy function like:
 * |  || function databaseCopy(fromDatabase :string, toDatabase :string, option? :databaseCopyOption){
 * |  ||   //TODO: database copy event
 * |  || }
 * |
 * |  * fsOption  : the database.json is write by fs model, so you can setting fs.mkdirSync and fs.writeFile option
 * |    * mkdirSyncOption     : follow fs.mkdirSync option
 * |    * writeFileSyncOption : follow fs.writeFileSync option
 * |
 * | Example:
 * |  ||===============================================================
 * |  || import { databaseCopy } from "./databaseCopy";
 * |  || 
 * |  || databaseCopyOption("testDatabase001","testDatabase001-Copy",{
 * |  ||    fsOption : { writeFileSyncOption: { recursive: true } }
 * |  || });
 */
export type databaseCopyOption = {
    fsOption?  : {
        mkdirSyncOption?     : fs.MakeDirectoryOptions,
        writeFileSyncOption? : fs.WriteFileOptions
    }
};

/*
 * |-------------------------------------------------------------------
 * | About:
 * |  define tableCreate.ts function option, the tableCreate function like:
 * |  || function tableCreate(database :string, table :string, option? :tableCreateOption){
 * |  ||   //TODO: table create event
 * |  || }
 * | 
 * |  * tableConfig : setting table option
 * |    * about   : table about text, default is ""
 * |    * fileSize : one frame can save number of row data(one file to save "fileSize" row data), fileSize default is 50
 * |    * limit   : the table.json "table" "about" text length limit
 * |      * tableNameLength : the table name text length limit, tableNameLength default is 1024
 * |      * tableAboutLength : the table about text length limit, tableAboutLength default is 1024
 * |  * fsOption   : the database.json is write by fs model, so you can setting fs.mkdirSync and fs.writeFile option
 * |    * mkdirSyncOption     : follow fs.mkdirSync option
 * |    * writeFileSyncOption : follow fs.writeFileSync option
 * |
 * | Example:
 * |  ||===============================================================
 * |  || import { tableCreate } from "./tableCreate";
 * |  || 
 * |  || tableCreate("testDatabase001","testTable001",{
 * |  ||    {
 * |  ||        about   : "it is table about",
 * |  ||        fileSize : 500,
 * |  ||        limit   : {
 * |  ||            tableNameLength  : 30,
 * |  ||            tableAboutLength : 30,
 * |  ||        }
 * |  ||    }
 * |  || });
 * |  ||
 */
export type tableCreateOption = {
    tableConfig?  : {
        about?   : string,
        fileSize? : number,
        limit?   : {
            tableNameLength?  : number,
            tableAboutLength? : number
        }
    },
    fsOption?    : {
        mkdirSyncOption?     : fs.MakeDirectoryOptions
        writeFileSyncOption? : fs.WriteFileOptions
    }
};

/*
 * |-------------------------------------------------------------------
 * | About:
 * |  define tableRename.ts function option, the tableRename function like:
 * |  || function tableRename(database :string, fromTable :string, toTable :string, option? :tableRenameOption){
 * |  ||   //TODO: table rename event
 * |  || }
 * |
 * |  * regexpWall : a regex as wall, any rename name will follow regex can be run, default is new RegExp(/^\s*$/)
 * |  * fsOption   : the database.json is write by fs model, so you can setting fs.writeFile option
 * |    * writeFileSyncOption : follow fs.writeFileSync option
 * |  
 * | Example:
 * |  ||===============================================================
 * |  || import { tableRename } from "./tableRename";
 * |  || 
 * |  || tableRename("testDatabase001", "testTable001", "testTable002", {
 * |  ||    //we let user can't rename be "priate001" "priate002", we can set the wall, we will be used in level3
 * |  ||    regexWall : new RegExp(/^(priate001|priate002)$/),
 * |  || });
 */
export type tableRenameOption = {
    regexWall?  : RegExp,
    fsOption?   : {
        writeFileSyncOption? : fs.WriteFileOptions
    }
};

/*
 * |-------------------------------------------------------------------
 * | About:
 * |  define tableRemove.ts function option, the tableRemove function like:
 * |  || function tableRemove(database :string, table :string, option? :tableRemoveOption){
 * |  ||   //TODO: table remove event
 * |  || }
 * |
 * |  * dataWall      : a string array as wall, just like we get info from table.json and not show some data
 * |  * cleanFileLock : it is a protect flag, when database has anyone table, it can't be remove, however cleanFileLock === ture, it will do
 * |  * fsOption      : the database.json is write by fs model, so you can setting fs.writeFile option
 * |    * rmSyncOption : follow fs.RmOptions option
 * |  
 * | Example:
 * |  ||===============================================================
 * |  || import { tableRemove } from "./tableRemove";
 * |  || 
 * |  || databaseRemove("testDatabase001","testTable001",{
 * |  ||    //we let user can't reomve be "priate001" "priate002",we can set the wall, we will be used in level3
 * |  ||    regexWall     : new RegExp(/^(priate001|priate002)$/),
 * |  ||    cleanFileLock : true,
 * |  || });
 */
export type tableRemoveOption = {
    dataWall?     : Array<String>,
    cleanFileLock : boolean, 
    fsOption      : {
        rmdirSyncOption?     : fs.RmDirOptions
        writeFileSyncOption? : fs.WriteFileOptions
    }
};

/*
 * |-------------------------------------------------------------------
 * | About:
 * |  define tableGet.ts function option, the tableGet function like:
 * |  || function tableGet(database :string, table :string, option? :tableGetOption){
 * |  ||   //TODO: database get data event
 * |  || }
 * |
 * |  * dataWall   : a string array as wall, just like we get info from table.json and not show some data
 * |  
 * | Example:
 * |  ||===============================================================
 * |  || import { tableGet } from "./tableGet";
 * |  || 
 * |  || tableGet("testDatabase001", "testTable001"{
 * |  ||    //we let user can't get database.json of "about" "userList" "limit", we can set the wall, we will be used in level3
 * |  ||    regexWall : new RegExp(/^(date|time|limit)$/),
 * |  || });
 * |  ||
 * |  || // user will be get 
 * |  || // {
 * |  || //   table   : "testDatabase001",
 * |  || //   forDB   : true,
 * |  || //   fileSize : 50,
 * |  || // }
 */
export type tableGetOption = {
    dataWall?  : Array<String>,
};

/*
 * |-------------------------------------------------------------------
 * | About:
 * |  define tableSet.ts function option, the tableSet function like:
 * |  || function tableSet(database :string, table :string, setConfig :tableSetConfig, option? :tableSetOption){
 * |  ||   //TODO: table set data event
 * |  || }
 * |  it just follow tableCreate.option, but this setting will be replace, so please don't replcae ohter member, just like asign "" or 0
 * |
 * |  * about : change table.json about text input, default is not be change
 * |  * limit : table.json some mumber limit
 * |    * tableNameLength  : change table.json name text can input max size, default is not be change 
 * |    * tableAboutLength : change table.json about text can input max size, but it will change after this procese, default is not be change
 * | 
 * |  * before time:
 * |    * about is "AAAAAAAAAA" and tableAboutLength is 15
 * |
 * |  * when we change the about text and change tableAboutLength:
 * |    databaseSet("testDatabase001","testTable001",{about:"12345678901234567890",limit:{tableAboutLength:30});
 * |
 * |  * this time about new text length is 20, 20 > tableAboutLength(15), so it will throw error
 * |
 * | Example:
 * |  ||===============================================================
 * |  || import { tableSetConfig } base from "./base";
 * |  || import { tableSet } from "./tableSet";
 * |  || 
 * |  || let newConfig :tableSetConfig = {
 * |  ||    about : "it is new about text",
 * |  || });
 * |  ||
 * |  || tableSet("testDatabase001","testTable001",newConfig);
 * |  ||
 * |  || //now the testDatabase001 of testTable001 of table.json about member will be replace to "it is new about text"
 */
export type tableSetConfig = {
    about?     : string,
    limit?     : {
        tableNameLength?  : number,
        tableAboutLength? : number,
    }
};

/*
 * |-------------------------------------------------------------------
 * | About:
 * |  define tableSet.ts function option, the tableSet function like:
 * |  || function tableSet(database :string, table :string, setConfig :tableSetConfig, option? :tableSetOption){
 * |  ||   //TODO: table set data event
 * |  || }
 * |
 * |  * dataWall  : a string array as wall, just like we get info from table.json and not show some data
 * |  
 * | Example:
 * |  ||===============================================================
 * |  || import { tableGet } from "./tableGet";
 * |  || 
 * |  || tableGet("testDatabase001", "testTable001"{
 * |  ||    //we let user can't get table.json of "about" "userList" "limit", we can set the wall, we will be used in level3
 * |  ||    regexWall : new RegExp(/^(date|time|limit)$/),
 * |  || });
 * |  ||
 * |  || // user will be get 
 * |  || // {
 * |  || //   table   : "testDatabase001",
 * |  || //   forDB   : true,
 * |  || //   fileSize : 50,
 * |  || // }
 */
export type tableSetOption = {
    dataWall?  : Array<string>
};

export type tableCopyOption = {
    
};

export type tableCopyToDatabaseOption = {
    
};

export type tableConcatOption = {
    
};

export type tableReSizeOption = {
    maxMax?  : number,
    minSize? : number,
};

export type dataInsertOption = {

};

export type dataMultInsertOption = {
    
};

export type dataDeleteOption = {
    
};

export type dataMultDeleteOption = {
    
};

export type dataSearchOption = {
    
};

export type dataMultSearchOption = {
    
};

export type dataUpdateOption = {
    
};

export type dataMultUpdateOption = {
    
};

export type dataSortOption = {
    
};

export type dataMultSortOption = {
    
};

export type dataMaxMinOption = {
    
};

export type dataMaxMinSortOption = {
    
};

export type dataCountOption = {
    
};

export type dataJoinOption = {
    
};