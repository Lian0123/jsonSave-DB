import * as fs    from "fs";
import * as path  from "path";
import * as fDate from "./formateDate";
import * as config from "./config.js";
import { Worker } from "worker_threads";

export type dbLink                = fs.PathLike;
    
export type dbCreateOption        = fs.Mode;

export type dbRemoveOption        = fs.RmDirOptions;

export type tableCreateOption     = object;

export type tableRemoveOption     = object;

export type tableInfoOption       = object;

export type tableConfig            = object;

export type insertTableDataOption = object;

export type updateTableDataOption = {
    type :string, 
};

export type deleteTableDataOption = {
    type :string, 
};

export type searchTableDataOption = {
    type :string, 
};

export type dbInfoOption          = {
    onlyInfo?: object,
    onlyUser?: object,
};

type retrunSearchType = {
    frameId :number,
    info    :Array<{rowId:number,data:any}>,
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
    level    : number,
    command  : string,
    data     : any,
    initTime : string,
    execTime : string,
    output   : any,
    error    : Error | null,      
};

export class coreDB {
    private dbPath    : string;
    private idPool    : Array<number>;
    private pool      : {
        first:  Array<dbProcess>,
        base:  Array<dbProcess>,
        last:  Array<dbProcess>,
    };
    private date      : fDate.formateDate;
    private initTime  : string;

    constructor(dbPath){
        this.dbPath = dbPath;
        this.idPool = [];
        this.pool = {
            first: [],
            base: [],
            last: [],
        };

        for (let i = 0; i < this.idPool.length; i++) {
            this.idPool.push(i);
        }

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
        if(fs.existsSync(path.join(config.path.savePath,dbName))){
            throw new Error(`The Database Name \"`+dbName+`\" Is Be Used`);
        }
        /* ----------------- End   Test Is Formate Database ----------------- */


        /* ----------------- Start Read Option----------------- */

        /* ----------------- End   Read Option----------------- */


        /* ----------------- Start Create Database ----------------- */
        fs.mkdirSync(path.join(config.path.savePath,dbName));
        fs.writeFileSync(path.join(config.path.savePath,dbName,`db.json`),JSON.stringify(dbJson, null, 4));
        /* ----------------- Start Create Database ----------------- */
    }

    public renameDB(dbOldName:string, dbNewName:string) :void{
        let dbJson :dbJsonType = {};

        /* ----------------- Start Test Is Formate Database ----------------- */
        if(!fs.existsSync(path.join(config.path.savePath,dbOldName))){
            throw new Error(`The Database Name \"`+dbNewName+`\" Was Not Created`);
        }

        if(fs.existsSync(path.join(config.path.savePath,dbNewName))){
            throw new Error(`The Database Name \"`+dbNewName+`\" Is Be Used`);
        }
        
        dbJson = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,dbOldName,`db.json`))));
        if(dbJson.database !== dbOldName){
            throw new Error(`Not Found Select Database Of \"`+dbOldName+`\" Of db.json`);
        }
        /* ----------------- End   Test Is Formate Database ----------------- */

        
        /* ----------------- Start Update Database ----------------- */
        fs.renameSync(path.join(config.path.savePath,dbOldName), path.join(config.path.savePath,dbNewName));
        dbJson.database = dbNewName;        
        fs.writeFileSync(path.join(config.path.savePath,dbNewName,`db.json`), JSON.stringify(dbJson, null, 4));
        /* ----------------- End   Update Database ----------------- */

    }

    public removeDB(dbName:string, options?:dbRemoveOption){
        let dbJson   :dbJsonType      = {};
        let fsOption :fs.RmDirOptions = {};

        /* ----------------- Start Test Is Formate Database ----------------- */
        if(!fs.existsSync(path.join(config.path.savePath,dbName))){
            throw new Error(`The Database Name \"`+dbName+`\" Was Not Created`);
        }

        dbJson = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,dbName,`db.json`))));
        if(dbJson.database !== dbName){
            throw new Error(`Not Found Select Database Of \"`+dbName+`\" Of db.json`);
        }
        /* ----------------- End   Test Is Formate Database ----------------- */


        /* ----------------- Start Read Option ----------------- */
        /* ----------------- End   Read Option ----------------- */


        /* ----------------- Start Remove Database ----------------- */
        if(options === {} || options === undefined ){
            fs.unlinkSync(path.join(config.path.savePath,dbName,"db.json"));
            fs.rmdirSync(path.join(config.path.savePath,dbName));
        }else{
            fs.rmdirSync(path.join(config.path.savePath,dbName),options);
        }
        /* ----------------- End   Remove Database ----------------- */
    }

    public getDBInfo(dbName:string, options?:dbInfoOption) :dbJsonType{
        let dbJson :dbJsonType = {};

        /* ----------------- Start Test Is Formate Database ----------------- */
        if(fs.existsSync(path.join(config.path.savePath,dbName))){
            throw new Error(`The Database Name \"`+dbName+`\" Is Be Used`);
        }

        dbJson = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,dbName,`db.json`))));
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
        if(fs.existsSync(path.join(config.path.savePath,dbName))){
            throw new Error(`The Database Name \"`+dbName+`\" Is Be Used`);
        }

        dbJson = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,dbName,`db.json`))));
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
        fs.writeFileSync(path.join(config.path.savePath,dbName,`db.json`), JSON.stringify(dbJson, null, 4));
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
        if(!fs.existsSync(path.join(config.path.savePath,dbName))){
            throw new Error(`Not Found Select Database Of \"`+dbName+`\"`);
        }

        dbJson = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,dbName,`db.json`))));
        if(dbJson.database !== dbName){
            throw new Error(`Not Found Select Database Of \"`+dbName+`\" Of db.json`);
        }
        /* ----------------- End   Test Is Formate Database ----------------- */
        

        /* ----------------- Start Test Is Formate Table ----------------- */
        if(
            fs.existsSync(path.join(config.path.savePath,dbName,tableName))){
            throw new Error(`Not Found Select Table \"`+tableName+`\" Was Created`);
        }else if(dbJson.tableList.indexOf(tableName) > -1){
            throw new Error(`The Table Was Created in \"`+dbName+`\" Of db.json`);
        }
        /* ----------------- End   Test Is Formate Table ----------------- */


        /* ----------------- Start Read Option ----------------- */
        /* ----------------- End   Read Option ----------------- */


        /* ----------------- Start Create Table ----------------- */
        fs.mkdirSync(path.join(config.path.savePath,dbName,tableName));
        fs.writeFileSync(path.join(config.path.savePath,dbName,tableName,`table.json`),JSON.stringify(tableJson, null, 4));
        /* ----------------- End   Create Table ----------------- */


        /* ----------------- Start Update db.json ----------------- */
        dbJson.tableList.push(tableName);
        fs.writeFileSync(path.join(config.path.savePath,dbName,`db.json`), JSON.stringify(dbJson, null, 4));
        /* ----------------- End   Update db.json ----------------- */
    }

    public renameTable(dbName:string, tableOldName:string, tableNewName:string) :void{
        let dbJson    :dbJsonType    = {};
        let tableJson :TableJsonType = {};

        /* ----------------- Start Test Is Formate Database ----------------- */
        if(!fs.existsSync(path.join(config.path.savePath,dbName))){
            throw new Error(`Not Found Select Database Of \"`+dbName+`\".`);
        }

        dbJson = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,dbName,`db.json`))));
        if(dbJson.database !== dbName){
            throw new Error(`Not Found Select Database Of \"`+dbName+`\" Of db.json`);
        }
        /* ----------------- Start Test Is Formate Database ----------------- */


        /* ----------------- Start Test Is Formate Table ----------------- */
        if(!fs.existsSync(path.join(config.path.savePath,dbName,tableOldName))){
            throw new Error(`The Database \"`+dbName+`\" Of Table Name \"`+tableOldName+`\" Was Not Created`);
        }

        if(fs.existsSync(path.join(config.path.savePath,dbName,tableNewName))){
            throw new Error(`The Database \"`+dbName+`\" Of Table Name \"`+tableNewName+`\" Is Be Used`);
        }

        tableJson = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,dbName,tableOldName,`table.json`))));
        if(tableJson.table !== tableOldName){
            throw new Error(`Not Found Select Database \"`+dbName+`\" Table Of \"`+tableOldName+`\" in table.json`);
        }else if(dbJson.tableList.indexOf(tableOldName) < 0){
            throw new Error(`Not Found Select Database \"`+dbName+`\" Table Of \"`+tableOldName+`\" Wasn't Link db.json`);
        }else if(dbJson.tableList.indexOf(tableNewName) > 0){
            throw new Error(`The New Table "`+tableNewName+`" Was Created in \"`+dbName+`\" Of db.json`);
        }
        /* ----------------- End   Test Is Formate Table ----------------- */



        /* ----------------- Start Update Table ----------------- */
        fs.renameSync(path.join(config.path.savePath,dbName,tableOldName),path.join(config.path.savePath,dbName,tableNewName));
        tableJson.table = tableNewName;
        fs.writeFileSync(path.join(config.path.savePath,dbName,tableNewName),JSON.stringify(tableJson, null, 4));
        /* ----------------- End   Update Table ----------------- */
        

        /* ----------------- Start Update db.json ----------------- */
        dbJson.tableList[dbJson.tableList.indexOf(tableOldName)] = tableNewName;
        fs.writeFileSync(path.join(config.path.savePath,dbName),JSON.stringify(dbJson, null, 4));
        /* ----------------- End   Update db.json ----------------- */
    }

    public removeTable(dbName:string, tableName:string, option?:tableRemoveOption) :void{
        let dbJson    :dbJsonType      = {};
        let tableJson :TableJsonType   = {};
        let fsOption  :fs.RmDirOptions = {};


        /* ----------------- Start Test Is Formate Database ----------------- */
        if(!fs.existsSync(path.join(config.path.savePath,dbName))){
            throw new Error(`Not Found Select Database Of \"`+dbName+`\".`);
        }

        dbJson = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,dbName,`db.json`))));
        if(dbJson.database !== dbName){
            throw new Error(`Not Found Select Database Of \"`+dbName+`\" Of db.json`);
        }
        /* ----------------- Start Test Is Formate Database ----------------- */


        /* ----------------- Start Test Is Formate Table ----------------- */
        if(!fs.existsSync(path.join(config.path.savePath,dbName,tableName))){
            throw new Error(`The Database \"`+dbName+`\" Of Table Name \"`+tableName+`\" Was Not Created`);
        }

        tableJson = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,dbName,tableName,`table.json`))));
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
            fs.unlinkSync(path.join(config.path.savePath,dbName,tableName,`table.json`));
            fs.rmdirSync(path.join(config.path.savePath,dbName,tableName));
        }else{
            fs.rmdirSync(path.join(config.path.savePath,dbName),fsOption);
        }
        /* ----------------- End   Remove Database ----------------- */
    }

    public getTableInfo(dbName:string, tableName:string, options?:tableInfoOption) :void{
        let dbJson    :dbJsonType      = {};
        let tableJson :TableJsonType   = {};
        let fsOption  :fs.RmDirOptions = {};

        /* ----------------- Start Test Is Formate Database ----------------- */
        if(!fs.existsSync(path.join(config.path.savePath,dbName))){
            throw new Error(`Not Found Select Database Of \"`+dbName+`\".`);
        }

        dbJson = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,dbName,`db.json`))));
        if(dbJson.database !== dbName){
            throw new Error(`Not Found Select Database Of \"`+dbName+`\" Of db.json`);
        }
        /* ----------------- Start Test Is Formate Database ----------------- */
    }
    
    public setTableInfo(dbName:string, tableName:string, config?:tableConfig) :void{

    }

    public insertTableData(dbName:string, tableName:string, data:any, option?:insertTableDataOption) :void{
        let tableFrame :Array<string> = this.getTableFrame(path.join(config.path.savePath,dbName,tableName));
        let FrameCount :number        = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,dbName,tableName,`table.json`)))).fileSize;
        let rowData    :Array<any>    = [];

        if(tableFrame.length > 0){
            rowData = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,dbName,tableName,tableFrame[tableFrame.length-1])))).data;
            if(rowData.length <= FrameCount){
                rowData.push(data);
                fs.writeFileSync(path.join(config.path.savePath,dbName,tableName,`data_`+(tableFrame.length-1)+`.json`), JSON.stringify({data:rowData}, null, 4));
            }else{
                fs.writeFileSync(path.join(config.path.savePath,dbName,tableName,`data_`+tableFrame.length+`.json`), JSON.stringify({data:[data]}, null, 4));
            }
        }else{
            fs.writeFileSync(path.join(config.path.savePath,dbName,tableName,`data_0.json`), JSON.stringify({data:[data]}, null, 4));
        }
    }

    public multInsertTableData(dbName:string, tableName:string, dataArray:Array<any>) :void{
        let tableFrame :Array<string> = this.getTableFrame(path.join(config.path.savePath,dbName,tableName));
        let FrameCount :number        = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,dbName,tableName,`table.json`)))).fileSize;
        let rowData    :Array<any>    = [];
        let cutSum     :number        = 0;
        let offset     :number        = 0;

        if(tableFrame.length > 0){ 
            rowData = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,dbName,tableName,tableFrame[tableFrame.length-1])))).data;
            offset  = FrameCount-rowData.length;

            if(offset>0){
                rowData = rowData.concat(dataArray.slice(0,offset));
                cutSum  = Math.ceil((dataArray.length-offset)/FrameCount);
                fs.writeFileSync(path.join(config.path.savePath,dbName,tableName,`data_`+(tableFrame.length-1)+`.json`), JSON.stringify({data:rowData}, null, 4));
                for (let i = 0; i < cutSum; i++) {
                    fs.writeFileSync(path.join(config.path.savePath,dbName,tableName,`data_`+(tableFrame.length+i)+`.json`), JSON.stringify({data:dataArray.slice(offset+i*FrameCount,offset+(i+1)*FrameCount)}, null, 4));
                }
            }else{
                rowData = rowData.concat(dataArray);
                fs.writeFileSync(path.join(config.path.savePath,dbName,tableName,`data_`+tableFrame.length+`.json`), JSON.stringify({data:rowData}, null, 4));
                for (let i = 0; i < cutSum; i++) {
                    fs.writeFileSync(path.join(config.path.savePath,dbName,tableName,`data_`+i+`.json`), JSON.stringify({data:dataArray.slice(i*FrameCount,(i+1)*FrameCount)}, null, 4));
                }
            }
        }else{
            cutSum  = Math.ceil((dataArray.length-offset)/FrameCount);
            for (let i = 0; i < cutSum; i++) {
                fs.writeFileSync(path.join(config.path.savePath,dbName,tableName,`data_`+i+`.json`), JSON.stringify({data:dataArray.slice(i*FrameCount,(i+1)*FrameCount)}, null, 4));
            }
        }
    }

    public async updateTableData(dbName:string, tableName:string, oldData:any, newData:any, option?:updateTableDataOption) :Promise<void>{
        
        let MatchList :Array<retrunSearchType> = await this.searchTableData(dbName,tableName,oldData);
        
        for (let i = 0; i < MatchList.length; i++) {
            let worker :Worker = new Worker(path.join(__dirname,`workers`,`updateWorker.js`));

            await worker.on('message', function(message){});

            worker.postMessage({dbName:dbName, tableName:tableName, newData:newData, frameId:i, option:option.type});
        }


    }
    
    public async deleteTableData(dbName:string, tableName:string, data:any, option?:deleteTableDataOption) :Promise<void>{
        let MatchList = await this.searchTableData(dbName,tableName,data);
        for (let i = 0; i < MatchList.length; i++) {
            let worker :Worker = new Worker(path.join(__dirname,`workers`,`updateWorker.js`));

            await worker.on('message', function(message){});

            worker.postMessage({dbName:dbName, tableName:tableName, newData:{}, frameId:i, option:option.type});
        }
        this.resizeTable(path.join(config.path.savePath,dbName,tableName));
    }
    
    public async searchTableData(dbName:string, tableName:string, data:any, option?:searchTableDataOption) :Promise<Array<retrunSearchType>>{
        let MatchList    :Array<retrunSearchType> = [];
        let tableFrame   :Array<string>           = this.getTableFrame(path.join(config.path.savePath,dbName,tableName));
        let searchOption :string                  = `fullData`;

        if(option !== undefined){
            searchOption = option.type;
        }
        
        for (let i = 0; i < tableFrame.length; i++) {
            let worker :Worker = new Worker(path.join(__dirname,`workers`,`searchWorker.js`), { workerData: {dbName:dbName, tableName:tableName, data:data, frameId:i, option:searchOption} });

            await worker.on('message', function(message){
                MatchList = MatchList.concat(message);
                //console.log(MatchList);
            });
            
        }

        //console.log(MatchList);
        
        return MatchList;
    }

    /*
    public joinTableData(dbTableArray:Array<Object> , option?:joinTableOption){

    }

    public countTableData(dbName:string, tableName:string, option?:countTableDataOption){
        
    }

    public sortTableData(dbName:string, tableName:string, option?:sortTableDataOption){

    }
    
    public reConfig(){

    }
    */

    public setPool(selectPool:string, command:string, data:any) :boolean{
        if(selectPool === `first`){
            this.pool.first.push({
                pid      : this.createPID(),
                level    : 0,
                command  : command,
                data     : data,
                initTime : this.date.getDateTime(),
                execTime : ``,
                output   : null,
                error    : null,
            });
        }else if(selectPool === `base`){
            this.pool.base.push({
                pid      : this.createPID(),
                level    : 0,
                command  : command,
                data     : data,
                initTime : this.date.getDateTime(),
                execTime : ``,
                output   : null,
                error    : null,
            });
        }else if(selectPool === `last`){
            this.pool.last.push({
                pid      : this.createPID(),
                level    : 0,
                command  : command,
                data     : data,
                initTime : this.date.getDateTime(),
                execTime : ``,
                output   : null,
                error    : null,
            });
        }else{
            return false;
        }

        return true;
    }

    public execPool() :boolean{

        if(this.pool.first.length > 0){
            let process :dbProcess = this.pool.first[0];
            if(!this.testIsLock(process)){
                this.addLock(process);
                if(this.execComand(process)){
                    this.clearLock(process);
                    this.removePID(process);
                }
            }
        }else if(this.pool.base.length > 0){
            while(this.pool.base.length > 0){
                /* Stop form new command in first pool */
                if(this.pool.first.length > 0){
                    break;
                }
                let process = this.pool.base[0];
                this.execComand(process);
            }

        }else if(this.pool.first.length === 0 && this.pool.base.length === 0 && this.pool.last.length > 0){
            while(this.pool.last.length > 0){
                /* Stop form new command in first pool */
                if(this.pool.first.length > 0){
                    break;
                }
                let process = this.pool.last[0];
                if(!this.testIsLock(process)){
                    this.pool.last.shift();
                    this.execComand(process);
                }
            }
        }else{
            return false;
        }

        return true;
    }

    public execComand(process:dbProcess) :boolean{/*
        if(process.command === `createDB`){
            this.createDB(process.data.dbName,process.data.option);
        }else if(process.command === `renameDB`){
            this.renameDB(process.data.dbOldName, process.data.dbNewName);
        }else if(process.command === `removeDB`){
            this.removeDB(process.data.dbName,process.data.option);
        }else if(process.command === `getDBInfo`){
            this.getDBInfo(process.data.dbName,process.data.option);
        }else if(process.command === `setDBInfo`){
            this.setDBInfo(process.data.dbName,process.data.config);
        }else if(process.command === `createTable`){
            this.createTable(process.data.dbName,process.data.tableName,process.data.option);
        }else if(process.command === `renameTable`){
            this.renameTable(process.data.dbName,process.data.tableOldName,process.data.tableNewName);
        }else if(process.command === `removeTable`){
            this.removeDB(process.data.dbName,process.data.option);
        }else if(process.command === `getTableInfo`){
            this.getTableInfo(process.data.dbName,process.data.tableName,process.data.option);
        }else if(process.command === `setTableInfo`){
            this.setTableInfo(process.data.dbName,process.data.tableName,process.data.config);
        }else if(process.command === `insertTableData`){
            this.insertTableData(process.data.dbName,process.data.tableName,process.data.data,process.data.option);
        }else if(process.command === `updateTableData`){
            this.updateTableData(process.data.dbName,process.data.tableName,process.data.oldData,process.data.newData,process.data.option);
        }else if(process.command === `deleteTableData`){
            this.deleteTableData(process.data.dbName,process.data.tableName,process.data.mainData,process.data.option);
        }else if(process.command === `searchTableData`){
            this.searchTableData(process.data.dbName,process.data.tableName,process.data.data,process.data.config);
        }
*/
        return true;
    }

    public testIsLock(process:dbProcess) :boolean{/*
        if(process.command === `createDB`){
            if(fs.existsSync(path.join(config.path.savePath,process.data.dbName,`.lock`))){
                return true;
            }else{
                return false;
            }
        }else if(process.command === `renameDB`){
            if(fs.existsSync(path.join(config.path.savePath,process.data.dbOldName,`.lock`))){
                //Update Process
                return true;
            }else{
                return false;
            }
        }else if(process.command === `removeDB`){
            if(fs.existsSync(path.join(config.path.savePath,process.data.dbName,`.lock`))){
                return true;
            }else{
                return false;
            }
        }else if(process.command === `getDBInfo`){
            if(fs.existsSync(path.join(config.path.savePath,process.data.dbName,`.lock`))){
                return true;
            }else{
                return false;
            }
        }else if(process.command === `setDBInfo`){
            if(fs.existsSync(path.join(config.path.savePath,process.data.dbName,`.lock`))){
                return true;
            }else{
                return false;
            }
        }else if(process.command === `createTable`){
            if(fs.existsSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`))){
                return true;
            }else{
                return false;
            }
        }else if(process.command === `renameTable`){
            if(fs.existsSync(path.join(config.path.savePath,process.data.dbName,process.data.tableOldName,`.lock`))){
                //Update Process
                return true;
            }else{
                return false;
            }
        }else if(process.command === `removeTable`){
            if(fs.existsSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`))){
                return true;
            }else{
                return false;
            }
        }else if(process.command === `getTableInfo`){
            if(fs.existsSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`))){
                return true;
            }else{
                return false;
            }
        }else if(process.command === `setTableInfo`){
            if(fs.existsSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`))){
                return true;
            }else{
                return false;
            }
        }else if(process.command === `insertTableData`){
            if(fs.existsSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`))){
                return true;
            }else{
                return false;
            }
        }else if(process.command === `updateTableData`){
            if(fs.existsSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`))){
                return true;
            }else{
                return false;
            }
        }else if(process.command === `deleteTableData`){
            if(fs.existsSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`))){
                return true;
            }else{
                return false;
            }
        }else if(process.command === `searchTableData`){
            if(fs.existsSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`))){
                return true;
            }else{
                return false;
            }
        }*/

        return true;

    }

    public addLock(process:dbProcess) :boolean{/*
        if(process.command === `createDB`){
            //NOT TODO
        }else if(process.command === `renameDB`){
            fs.writeFileSync(path.join(config.path.savePath,process.data.dbOldName,`.lock`),String(process.pid));
        }else if(process.command === `removeDB`){
            fs.writeFileSync(path.join(config.path.savePath,process.data.dbName,`.lock`),String(process.pid));
        }else if(process.command === `getDBInfo`){
            //NOT TODO
        }else if(process.command === `setDBInfo`){
            fs.writeFileSync(path.join(config.path.savePath,process.data.dbName,`.lock`),String(process.pid));
        }else if(process.command === `createTable`){
            //NOT TODO
        }else if(process.command === `renameTable`){
            fs.writeFileSync(path.join(config.path.savePath,process.data.dbName,process.data.tableOldName,`.lock`),String(process.pid));
        }else if(process.command === `removeTable`){
            fs.writeFileSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`),String(process.pid));
        }else if(process.command === `getTableInfo`){
            //NOT TODO
        }else if(process.command === `setTableInfo`){
            fs.writeFileSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`),String(process.pid));
        }else if(process.command === `insertTableData`){
            fs.writeFileSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`),String(process.pid));
        }else if(process.command === `updateTableData`){
            fs.writeFileSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`),String(process.pid));
        }else if(process.command === `deleteTableData`){
            fs.writeFileSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`),String(process.pid));
        }else if(process.command === `searchTableData`){
            fs.writeFileSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`),String(process.pid));
        }else{
            return false;
        }
*/
        return true;
    }

    public clearLock(process:dbProcess) :boolean{/*
        if(process.command === `createDB`){
            //NOT TODO
        }else if(process.command === `renameDB`){
            fs.unlinkSync(path.join(config.path.savePath,process.data.dbNewName,`.lock`));
        }else if(process.command === `removeDB`){
            //NOT TODO
        }else if(process.command === `getDBInfo`){
            //NOT TODO
        }else if(process.command === `setDBInfo`){
            fs.unlinkSync(path.join(config.path.savePath,process.data.dbName,`.lock`));
        }else if(process.command === `createTable`){
            //NOT TODO
        }else if(process.command === `renameTable`){
            fs.unlinkSync(path.join(config.path.savePath,process.data.dbName,process.data.tableNewName,`.lock`));
        }else if(process.command === `removeTable`){
            //NOT TODO
        }else if(process.command === `getTableInfo`){
            //NOT TODO
        }else if(process.command === `setTableInfo`){
            fs.unlinkSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`));
        }else if(process.command === `insertTableData`){
            fs.unlinkSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`));
        }else if(process.command === `updateTableData`){
            fs.unlinkSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`));
        }else if(process.command === `deleteTableData`){
            fs.unlinkSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`));
        }else if(process.command === `searchTableData`){
            fs.unlinkSync(path.join(config.path.savePath,process.data.dbName,process.data.tableName,`.lock`));
        }
*/
        return true;
    }
    
    private createPID() :number{
        if(this.idPool.length > 0){
            return this.idPool.shift();
        }
        
        return -1;
    }

    private removePID(process:dbProcess) :boolean{
        if(this.pool.first.indexOf(process) < 0 && this.pool.base.indexOf(process) < 0 && this.pool.last.indexOf(process) < 0){
            this.idPool.push(process.pid);
            return true;
        }

        return false;
    }

    private getTableFrame(tablePath:string) :Array<string>{
        let TableFrame :Array<string> = fs.readdirSync(tablePath).filter(function(file :string) :Array<string>{
            return file.match(/^data_[0-9]+.json$/);
        });

        return TableFrame.sort(function(a :string, b :string) :number{
            return Number.parseInt(a.slice(5,a.length-5)) - Number.parseInt(b.slice(5,b.length-5));
        });
    }

    private resizeTable(tablePath:string) {
        let tableFrame :Array<string> = fs.readdirSync(tablePath).filter(function(file :string) :Array<string>{
            return file.match(/^data_[0-9]+.json$/);
        });
        let FrameCount  :number = JSON.parse(String(fs.readFileSync(path.join(tablePath,`table.json`)))).fileSize;
        let fromIndex   :number = tableFrame.length-1;
        let toIndex     :number = 0;
        let fromRowData :Array<any> =  JSON.parse(String(fs.readFileSync(path.join(tablePath,tableFrame[fromIndex])))).data;
        let toRowData   :Array<any> = JSON.parse(String(fs.readFileSync(path.join(tablePath,tableFrame[toIndex])))).data;

        while (1) {
            if(fromIndex === toIndex){
                break;
            }

            if(fromRowData.length === 0){
                fs.unlinkSync(path.join(tablePath,tableFrame[fromIndex]));
                fromIndex--;
                fromRowData = JSON.parse(String(fs.readFileSync(path.join(tablePath,tableFrame[fromIndex])))).data;
            }else if(toRowData.length === FrameCount){
                fs.writeFileSync(path.join(tablePath,tableFrame[toIndex]), JSON.stringify({data:toRowData}, null, 4));
                toIndex++;
                toRowData = JSON.parse(String(fs.readFileSync(path.join(tablePath,tableFrame[toIndex])))).data;
            }else{
                if(fromRowData.length+toRowData.length > FrameCount){
                    toRowData   = toRowData.concat(fromRowData.slice(0,FrameCount-toRowData.length));
                    fromRowData = fromRowData.slice(FrameCount-toRowData.length);
                }else{
                    toRowData   = toRowData.concat(fromRowData);
                    fromRowData = [];
                }
            }

        }

    }

    private testSerach(tablePath:string) :boolean{
        if(!fs.existsSync(tablePath+`/count.json`)){
            return false;
        }

        return false;
    }
}

