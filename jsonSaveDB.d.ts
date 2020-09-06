declare module "CoreDB" {
    import * as fs from "fs";
    
    export type dbLink                = fs.PathLike;
    
    export type dbCreateOption        = fs.Mode;
    
    export type dbRemoveOption        = fs.RmDirOptions;
    
    export type dbInfoOption          = {
        onlyInfo?: object,
        onlyUser?: object,
    }

    export type dbConfig               = object;

    export type tableLink             = fs.PathLike;

    export type tableCreateOption     = fs.Mode;

    export type tableRemoveOption     = fs.RmDirOptions;

    export type tableInfoOption       = object;

    export type tableConfig            = object;

    export type insertTableDataOption = object;

    export type updateTableDataOption = object;

    export type deleteTableDataOption = object;
    
    export type searchTableDataOption = object;

    export type countTableDataOption  = object;

    export type sortTableDataOption   = object;

    export type joinTableOption       = object;

    export type dbCoreInterface       = {
        function : string,
        input    : object,
        initTime : string,
        execTime : string,
        output   : any,
        error    : Error | null,      
    }

    export type dbProcess            = {
        pid      : number,
        command  : string,
        initTime : string,
        execTime : string,
        output   : any,
        error    : Error | null,      
    }

    export class coreDB {
        private dbPath    : string;
        private idCounter : number;
        private pool      : object;

        public createDB(        dbName:dbLink   , option?:dbCreateOption   ) :dbCoreInterface;
        public renameDB(        dbOldName:dbLink, dbNewName:dbLink         ) :dbCoreInterface;
        public removeDB(        dbName:dbLink   , options?:dbRemoveOption  ) :dbCoreInterface;
        public getDBInfo(       dbName:dbLink   , options?:dbInfoOption    ) :dbCoreInterface;
        public setDBInfo(       dbName:dbLink   , config?:dbConfig           ) :dbCoreInterface;
        public createTable(     dbName:dbLink   , tableName:tableLink    , option?:tableCreateOption ) :dbCoreInterface;
        public renameTable(     dbName:dbLink   , tableOldName:tableLink , tableNewName:tableLink    ) :dbCoreInterface;
        public removeTable(     dbName:dbLink   , tableName:tableLink    , option?:tableRemoveOption ) :dbCoreInterface;
        public getTableInfo(    dbName:dbLink   , tableName:tableLink    , options?:tableInfoOption    ) :dbCoreInterface;
        public setTableInfo(    dbName:dbLink   , tableName:tableLink    , config?:tableConfig           ) :dbCoreInterface;
        public insertTableData( dbName:dbLink   , tableName:tableLink    , data:any   , option?:insertTableDataOption) :dbCoreInterface;
        public updateTableData( dbName:dbLink   , tableName:tableLink    , oldData:any, newData:any, option?:updateTableDataOption) :dbCoreInterface;
        public deleteTableData( dbName:dbLink   , tableName:tableLink    , data:any   , option?:deleteTableDataOption) :dbCoreInterface;
        public searchTableData( dbName:dbLink   , tableName:tableLink    , data:any   , option?:searchTableDataOption) :dbCoreInterface;
        public joinTableData(   dbTableArray:Array<Object> , option?:joinTableOption) :dbCoreInterface;
        public countTableData(  dbName:dbLink   , tableName:tableLink    , option?:countTableDataOption) :dbCoreInterface;
        public sortTableData(   dbName:dbLink   , tableName:tableLink    , option?:sortTableDataOption) :dbCoreInterface;
        public reConfig()  :dbCoreInterface;
        public setPool()  :boolean;
        public execPool() :boolean;
        public execComand(process:dbProcess) :boolean;
        public testIsLock()   :boolean;
        public addLock()      :boolean;
        public clearLock()    :boolean;
        public createPID() :number;
        public removePID(pid:number) :boolean;

        public deepCopyTable(dbFrom:dbLink,dbTo:dbLink,tableName:tableLink) :boolean;
    }
}
