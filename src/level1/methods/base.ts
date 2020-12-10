import * as fs       from "fs";
import * as path     from "path";

/*
 * |-------------------------------------------------------------------
 * | About:
 * |  test value is undefined.
 * |
 * | Example:
 * |  ||===============================================================
 * |  || import * as base from "./base";
 * |  || let a1 = { a:"1234" };
 * |  || 
 * |  || //return true
 * |  || base.isUndefined(a1?.a);
 * |  || 
 * |  || //return false
 * |  || base.isUndefined(a1?.b);
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
 * |  || import * as base from "./base";
 * |  || let a1 = { a:"1234" };
 * |  || 
 * |  || //return false
 * |  || base.isUndefined(a1?.a);
 * |  || 
 * |  || //return true
 * |  || base.isUndefined(a1?.b);
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
 * |  || import * as base from "./base";
 * |  || let newUser :base.userListType = {
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
 * |  * userList  : user data show to user/admin
 * |  * tableList : which table in this database
 * |  * limit     : some data input limit, using for security
 * |      * databaseNameLength  : this "database" text input limit
 * |      * databaseAboutLength : this "about" text input limit
 * |
 * | Example:
 * |  ||===============================================================
 * |  || import * as base from "./base";
 * |  || let newDatabase :base.dbJsonType = {
 * |  ||    database   : "testDatabase001",
 * |  ||    about      : "it is a new test database...."
 * |  ||    date       : "2020-01-01",
 * |  ||    time       : "23:59:00",
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
export type dbJsonType = {
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
 * |  || import * as base from "./TableJsonType";
 * |  || let newTable :base.dbJsonType = {
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
 * |  define databaseCreate.ts function option.
 * |  
 */
export type dbCreateOption = {
    dbConfig  : {
        database  : string,
        about     : string,
        auth      : boolean,
        userList  : Array<{user :string,timeup :string}>,
        tableList : Array<string>,
    } ,
    execLimit? : number,
    fsOption? : {
        mkdirSyncOption?     : fs.Mode | (fs.MakeDirectoryOptions & { recursive?: false; }) | null
        writeFileSyncOption? : fs.WriteFileOptions
    }
};
