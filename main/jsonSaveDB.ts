import * as fs    from "fs";
import * as path  from "path";
import * as fDate from "./formateDate";
import * as config from "./config.js";
import Worker from "worker_threads";


export type dbLink                = fs.PathLike;
    
export type dbCreateOption        = fs.Mode;

export type dbRemoveOption        = fs.RmDirOptions;

export type tableCreateOption     = object;

export type tableRemoveOption     = object;

export type tableInfoOption       = object;

export type tableConfig            = object;

export type insertTableDataOption = object;

export type updateTableDataOption = object;

export type deleteTableDataOption = object;

export type searchTableDataOption = object;

export type dbInfoOption          = {
    onlyInfo?: object,
    onlyUser?: object,
};

export type userListType          = {
    user?   : string,
    auth?   : string,
    timeUp? : string,
}
export type dbJsonType            = {
    database?      : string,
    about?         : string,
    date?          : string,
    time?          : string,
    hash?          : boolean,
    auth?          : boolean,
    userList?      : Array<userListType>,
    tableList?     : Array<string>,
    limit?         : {
        databaseNameLength?  : number,
        databaseAboutLength? : number,
    }
};

export type TableJsonType         = {
    table?    : string,
    about?    : string,
    forDB?    : string,
    fileSize?  : number,
    hashRow?  : Array<string>,
    limit? : {
        tableNameLength?     : number,
        tableAboutLength?    : number,
    }
};


export type DataJsonType         = {
    data    :  Array<string>,
};


export type dbCoreInterface       = {
    function : string,
    input    : object,
    initTime : string,
    execTime : string,
    output   : any,
    error    : Error | null,      
};

export type dbProcess            = {
    pid      : number,
    command  : string,
    initTime : string,
    execTime : string,
    output   : any,
    error    : Error | null,      
};

export class coreDB {
    private dbPath    : string;
    private idCounter : number;
    private idPool    : Array<number>;
    private pool      : object;
    private date      : fDate.formateDate;
    private initTime  : string;

    constructor(dbPath){
        this.dbPath = dbPath;
        this.idCounter = 0;

        this.pool = {
            first: [],
            base: [],
            last: [],
        };

        this.date = new fDate.formateDate();
        this.initTime = this.date.getDateTime();
    }

    public createDB(dbName:string, option?:dbCreateOption) :void {
        let dbJson :dbJsonType = {
            database      : dbName,
            about         : ``,
            date          : this.date.getDate(),
            time          : this.date.getTime(),
            hash          : false,
            auth          : false,
            userList      : [],
            tableList     : [],
            limit         :{
                databaseNameLength  : 1024,
                databaseAboutLength : 1024,
            }
        };

        /* ----------------- Start Test Is Formate Database ----------------- */
        if(fs.existsSync(config.path.savePath+dbName)){
            throw new Error(`The Database Name \"`+dbName+`\" Is Be Used`);
        }
        /* ----------------- End   Test Is Formate Database ----------------- */


        /* ----------------- Start Read Option----------------- */

        /* ----------------- End   Read Option----------------- */


        /* ----------------- Start Create Database ----------------- */
        fs.mkdirSync(config.path.savePath+dbName);
        fs.writeFileSync(config.path.savePath+dbName+`/db.json`,JSON.stringify(dbJson, null, 4));
        /* ----------------- Start Create Database ----------------- */
    }

    public renameDB(dbOldName:string, dbNewName:string) :void{
        let dbJson :dbJsonType = {};

        /* ----------------- Start Test Is Formate Database ----------------- */
        if(!fs.existsSync(config.path.savePath+dbOldName)){
            throw new Error(`The Database Name \"`+dbNewName+`\" Was Not Created`);
        }

        if(fs.existsSync(config.path.savePath+dbNewName)){
            throw new Error(`The Database Name \"`+dbNewName+`\" Is Be Used`);
        }
        
        dbJson = JSON.parse(String(fs.readFileSync(config.path.savePath+dbOldName+`/db.json`)));
        if(dbJson.database !== dbOldName){
            throw new Error(`Not Found Select Database Of \"`+dbOldName+`\" Of db.json`);
        }
        /* ----------------- End   Test Is Formate Database ----------------- */

        
        /* ----------------- Start Update Database ----------------- */
        fs.renameSync(config.path.savePath+dbOldName, config.path.savePath+dbNewName);
        dbJson.database = dbNewName;        
        fs.writeFileSync(config.path.savePath+dbNewName+`/db.json`, JSON.stringify(dbJson, null, 4));
        /* ----------------- End   Update Database ----------------- */

    }

    public removeDB(dbName:string, options?:dbRemoveOption){
        let dbJson   :dbJsonType      = {};
        let fsOption :fs.RmDirOptions = {};

        /* ----------------- Start Test Is Formate Database ----------------- */
        if(fs.existsSync(config.path.savePath+dbName)){
            throw new Error(`The Database Name \"`+dbName+`\" Is Be Used`);
        }

        dbJson = JSON.parse(String(fs.readFileSync(config.path.savePath+dbName+`/db.json`)));
        if(dbJson.database !== dbName){
            throw new Error(`Not Found Select Database Of \"`+dbName+`\" Of db.json`);
        }
        /* ----------------- End   Test Is Formate Database ----------------- */


        /* ----------------- Start Read Option ----------------- */
        /* ----------------- End   Read Option ----------------- */


        /* ----------------- Start Remove Database ----------------- */
        if(fsOption === {}){
            fs.unlinkSync(config.path.savePath+dbName+"/db.json");
            fs.rmdirSync(config.path.savePath+dbName);
        }else{
            fs.rmdirSync(config.path.savePath+dbName,fsOption);
        }
        /* ----------------- End   Remove Database ----------------- */
    }

    public getDBInfo(dbName:string, options?:dbInfoOption) :dbJsonType{
        let dbJson :dbJsonType = {};

        /* ----------------- Start Test Is Formate Database ----------------- */
        if(fs.existsSync(config.path.savePath+dbName)){
            throw new Error(`The Database Name \"`+dbName+`\" Is Be Used`);
        }

        dbJson = JSON.parse(String(fs.readFileSync(config.path.savePath+dbName+`/db.json`)));
        if(dbJson.database !== dbName){
            throw new Error(`Not Found Select Database Of \"`+dbName+`\" Of db.json`);
        }
        /* ----------------- End   Test Is Formate Database ----------------- */


        /* ----------------- Start Read Option ----------------- */
        /* ----------------- End   Read Option ----------------- */


        return dbJson;
    }

    public setDBInfo(dbName:string, setConfig?:dbJsonType) :void{
        let dbJson :dbJsonType = {};
        
        /* ----------------- Start Test Is Formate Database ----------------- */
        if(fs.existsSync(config.path.savePath+dbName)){
            throw new Error(`The Database Name \"`+dbName+`\" Is Be Used`);
        }

        dbJson = JSON.parse(String(fs.readFileSync(config.path.savePath+dbName+`/db.json`)));
        if(dbJson.database !== dbName){
            throw new Error(`Not Found Select Database Of \"`+dbName+`\" Of db.json`);
        }
        /* ----------------- End   Test Is Formate Database ----------------- */


        /* ----------------- Start Read Option ----------------- */
        if(setConfig !== undefined){
            if(setConfig.about !== undefined){
                dbJson.about = setConfig.about;
            }

            if(setConfig.limit !== undefined){
                if(setConfig.limit.databaseNameLength !== undefined){
                    dbJson.limit.databaseNameLength = setConfig.limit.databaseNameLength;
                }
            }
        }
        /* ----------------- End   Read Option ----------------- */


        /* ----------------- Start Rewrite Database db.json----------------- */
        fs.writeFileSync(config.path.savePath+dbName+`/db.json`, JSON.stringify(dbJson, null, 4));
        /* ----------------- End   Rewrite Database db.json----------------- */
    }

    public createTable(dbName:string, tableName:string, option?:tableCreateOption) :void{
        let dbJson    :dbJsonType    = {};
        let tableJson :TableJsonType = {
            table    : tableName,
            about    : "",
            forDB    : dbName,
            fileSize  : 50,
            hashRow  : [
                //{fileName: "...."}
            ],
            limit : {
                tableNameLength     : 1024,
                tableAboutLength    : 1024,
            }
        };


        /* ----------------- Start Test Is Formate Database ----------------- */
        if(!fs.existsSync(config.path.savePath+dbName)){
            throw new Error(`Not Found Select Database Of \"`+dbName+`\"`);
        }

        dbJson = JSON.parse(String(fs.readFileSync(config.path.savePath+dbName+`/db.json`)));
        if(dbJson.database !== dbName){
            throw new Error(`Not Found Select Database Of \"`+dbName+`\" Of db.json`);
        }
        /* ----------------- End   Test Is Formate Database ----------------- */
        

        /* ----------------- Start Test Is Formate Table ----------------- */
        if(fs.existsSync(config.path.savePath+dbName+`/`+tableName)){
            throw new Error(`Not Found Select Table Of \"`+tableName+`\"`);
        }else if(dbJson.tableList.indexOf(tableName) > -1){
            throw new Error(`The Table Was Created in \"`+dbName+`\" Of db.json`);
        }
        /* ----------------- End   Test Is Formate Table ----------------- */


        /* ----------------- Start Read Option ----------------- */
        /* ----------------- End   Read Option ----------------- */


        /* ----------------- Start Create Table ----------------- */
        fs.mkdirSync(config.path.savePath+dbName+"/"+tableName);
        fs.writeFileSync(config.path.savePath+dbName+"/"+tableName+`/table.json`,JSON.stringify(tableJson, null, 4));
        /* ----------------- End   Create Table ----------------- */


        /* ----------------- Start Update db.json ----------------- */
        dbJson.tableList.push(tableName);
        fs.writeFileSync(config.path.savePath+dbName+`/db.json`, JSON.stringify(dbJson, null, 4));
        /* ----------------- End   Update db.json ----------------- */
    }

    public renameTable(dbName:string, tableOldName:string, tableNewName:string) :void{
        let dbJson    :dbJsonType    = {};
        let tableJson :TableJsonType = {};

        /* ----------------- Start Test Is Formate Database ----------------- */
        if(!fs.existsSync(config.path.savePath+dbName)){
            throw new Error(`Not Found Select Database Of \"`+dbName+`\".`);
        }

        dbJson = JSON.parse(String(fs.readFileSync(config.path.savePath+dbName+`/db.json`)));
        if(dbJson.database !== dbName){
            throw new Error(`Not Found Select Database Of \"`+dbName+`\" Of db.json`);
        }
        /* ----------------- Start Test Is Formate Database ----------------- */


        /* ----------------- Start Test Is Formate Table ----------------- */
        if(!fs.existsSync(config.path.savePath+dbName+"/"+tableOldName)){
            throw new Error(`The Database \"`+dbName+`\" Of Table Name \"`+tableOldName+`\" Was Not Created`);
        }

        if(fs.existsSync(config.path.savePath+dbName+"/"+tableNewName)){
            throw new Error(`The Database \"`+dbName+`\" Of Table Name \"`+tableNewName+`\" Is Be Used`);
        }

        tableJson = JSON.parse(String(fs.readFileSync(config.path.savePath+dbName+`/`+tableOldName+`/table.json`)));
        if(tableJson.table !== tableOldName){
            throw new Error(`Not Found Select Database \"`+dbName+`\" Table Of \"`+tableOldName+`\" in table.json`);
        }else if(dbJson.tableList.indexOf(tableOldName) < 0){
            throw new Error(`Not Found Select Database \"`+dbName+`\" Table Of \"`+tableOldName+`\" Wasn't Link db.json`);
        }else if(dbJson.tableList.indexOf(tableNewName) > 0){
            throw new Error(`The New Table "`+tableNewName+`" Was Created in \"`+dbName+`\" Of db.json`);
        }
        /* ----------------- End   Test Is Formate Table ----------------- */



        /* ----------------- Start Update Table ----------------- */
        fs.renameSync(config.path.savePath+dbName+`/`+tableOldName,config.path.savePath+dbName+`/`+tableNewName);
        tableJson.table = tableNewName;
        fs.writeFileSync(config.path.savePath+dbName+`/`+tableNewName,JSON.stringify(tableJson, null, 4));
        /* ----------------- End   Update Table ----------------- */
        

        /* ----------------- Start Update db.json ----------------- */
        dbJson.tableList[dbJson.tableList.indexOf(tableOldName)] = tableNewName;
        fs.writeFileSync(config.path.savePath+dbName,JSON.stringify(dbJson, null, 4));
        /* ----------------- End   Update db.json ----------------- */
    }

    public removeTable(dbName:string, tableName:string, option?:tableRemoveOption) :void{
        let dbJson    :dbJsonType      = {};
        let tableJson :TableJsonType   = {};
        let fsOption  :fs.RmDirOptions = {};


        /* ----------------- Start Test Is Formate Database ----------------- */
        if(!fs.existsSync(config.path.savePath+dbName)){
            throw new Error(`Not Found Select Database Of \"`+dbName+`\".`);
        }

        dbJson = JSON.parse(String(fs.readFileSync(config.path.savePath+dbName+`/db.json`)));
        if(dbJson.database !== dbName){
            throw new Error(`Not Found Select Database Of \"`+dbName+`\" Of db.json`);
        }
        /* ----------------- Start Test Is Formate Database ----------------- */


        /* ----------------- Start Test Is Formate Table ----------------- */
        if(!fs.existsSync(config.path.savePath+dbName+"/"+tableName)){
            throw new Error(`The Database \"`+dbName+`\" Of Table Name \"`+tableName+`\" Was Not Created`);
        }

        tableJson = JSON.parse(String(fs.readFileSync(config.path.savePath+dbName+`/`+tableName+`/table.json`)));
        if(tableJson.table !== tableName){
            throw new Error(`Not Found Select Database \"`+dbName+`\" Table Of \"`+tableName+`\" in table.json`);
        }else if(dbJson.tableList.indexOf(tableName) < 0){
            throw new Error(`Not Found Select Database \"`+dbName+`\" Table Of \"`+tableName+`\" Wasn't Link db.json`);
        }
        /* ----------------- End   Test Is Formate Table ----------------- */


        /* ----------------- Start Read Option ----------------- */
        /* ----------------- End   Read Option ----------------- */


        /* ----------------- Start Remove table ----------------- */
        if(fsOption === {}){
            fs.unlinkSync(config.path.savePath+dbName+`/`+tableName+`/table.json`);
            fs.rmdirSync(config.path.savePath+dbName+`/`+tableName);
        }else{
            fs.rmdirSync(config.path.savePath+dbName,fsOption);
        }
        /* ----------------- End   Remove Database ----------------- */
    }

    public getTableInfo(dbName:string, tableName:string, options?:tableInfoOption) :void{

    }
    
    public setTableInfo(dbName:string, tableName:string, config?:tableConfig) :void{

    }

    public insertTableData(dbName:string, tableName:string, data:any, option?:insertTableDataOption) :void{
        let tableFrame :Array<string> = this.getTableFrame(config.path.savePath+dbName+`/`+tableName+`/`);
        let FrameCount :number        = JSON.parse(String(fs.readFileSync(config.path.savePath+dbName+`/`+tableName+`/table.json`))).fileSize;
        let rowData    :Array<any>    = [];

        if(tableFrame.length > 0){
            rowData = JSON.parse(String(fs.readFileSync(config.path.savePath+dbName+`/`+tableName+`/`+tableFrame[tableFrame.length-1]))).data;
            if(rowData.length <= FrameCount){
                rowData.push(data);
                fs.writeFileSync(config.path.savePath+dbName+`/`+tableName+`/data_`+(tableFrame.length-1)+`.json`, JSON.stringify(rowData, null, 4));
            }else{
                fs.writeFileSync(config.path.savePath+dbName+`/`+tableName+`/data_`+tableFrame.length+`.json`, JSON.stringify({data:[data]}, null, 4));
            }
        }else{
            fs.writeFileSync(config.path.savePath+dbName+`/`+tableName+`/data_0.json`, JSON.stringify({data:[data]}, null, 4));
        }
    }

    public multInsertTableData(dbName:string, tableName:string, dataArray:Array<any>) :void{
        let tableFrame :Array<string> = this.getTableFrame(config.path.savePath+dbName+`/`+tableName+`/`);
        let FrameCount :number        = JSON.parse(String(fs.readFileSync(config.path.savePath+dbName+`/`+tableName+`/table.json`))).fileSize;
        let rowData    :Array<any>    = [];
        let cutSum     :number        = 0;
        let offset     :number        = 0;
        if(tableFrame.length > 0){ 
            rowData = JSON.parse(String(fs.readFileSync(config.path.savePath+dbName+`/`+tableName+`/`+tableFrame[tableFrame.length-1]))).data;
            offset  = FrameCount-rowData.length;

            if(offset>0){
                rowData = rowData.concat(dataArray.slice(0,offset));
                cutSum  = Math.ceil((dataArray.length-offset)/FrameCount);
                fs.writeFileSync(config.path.savePath+dbName+`/`+tableName+`/data_`+(tableFrame.length-1)+`.json`, JSON.stringify({data:[rowData]}, null, 4));
                for (let i = 0; i < cutSum; i++) {
                    fs.writeFileSync(config.path.savePath+dbName+`/`+tableName+`/data_`+(dataArray.length+i)+`.json`, JSON.stringify({data:[dataArray.slice(offset+i*FrameCount,offset+(i+1)*FrameCount)]}, null, 4));
                }
            }else{
                rowData = rowData.concat(dataArray);
                fs.writeFileSync(config.path.savePath+dbName+`/`+tableName+`/data_`+tableFrame.length+`.json`, JSON.stringify({data:[rowData]}, null, 4));
                for (let i = 0; i < cutSum; i++) {
                    fs.writeFileSync(config.path.savePath+dbName+`/`+tableName+`/data_`+i+`.json`, JSON.stringify({data:[dataArray.slice(i*FrameCount,(i+1)*FrameCount)]}, null, 4));
                }
            }
        }else{
            for (let i = 0; i < cutSum; i++) {
                fs.writeFileSync(config.path.savePath+dbName+`/`+tableName+`/data_`+i+`.json`, JSON.stringify({data:[dataArray.slice(i*FrameCount,(i+1)*FrameCount)]}, null, 4));
            }
        }
    }

    public updateTableData(dbName:string, tableName:string, oldData:any, newData:any, option?:updateTableDataOption) :void{

    }
    
    public deleteTableData(dbName:string, tableName:string, data:any, option?:deleteTableDataOption) :void{

    }
    
    public searchTableData(dbName:string, tableName:string, data:any, option?:searchTableDataOption) :void{
        
    }


    private getTableFrame(tablePath:string) :Array<string>{
        let TableFrame :Array<string> = fs.readdirSync(tablePath).filter(function(file :string) :Array<string>{
            return file.match(/^data_[0-9]+.json$/);
        });

        return TableFrame.sort(function(a :string, b :string) :number{
            return Number.parseInt(a.slice(5,a.length-5)) - Number.parseInt(b.slice(5,b.length-5));
        });
    }

    private testSerach(tablePath:string) :boolean{
        if(!fs.existsSync(tablePath+`/count.json`)){
            return false;
        }

        return false;
    }
}

