import * as fs    from "fs";
import * as path  from "path";
import * as fDate from "./formateDate";
import * as config from "./config.js";
import * as LowLevelDB from "./jsonSaveDB";
import { Worker } from "worker_threads";

const coreDB :LowLevelDB.coreDB = new LowLevelDB.coreDB(config);

type databaseTableType = {
    databaseName: string,
    tableName: string
};

class jsonSaveDB {

    constructor() {
    
    }

    public use(dbName:string):dbView{
        return new dbView(dbName);
    }

    public create(dbName:string,option?:LowLevelDB.dbCreateOption){
        coreDB.createDB(dbName);
    }

    public rename(dbOldName:string, dbNewName:string) {
        coreDB.renameDB(dbOldName,dbNewName);
    }

    public remove(dbName:string,option:object,level?:string){
        if(level === `first`|| level === `base` || level === `last`){
            coreDB.setPool(level, `removeDB`,dbName);
        }else{
            coreDB.setPool(`base`,`removeDB`,dbName);
        }
    }

    public getInfo(dbName :string,dbInfoOption){
        coreDB.getDBInfo(dbName,dbInfoOption);
    }

    public setInfo(dbName :string, setConfig :LowLevelDB.dbJsonType){
        coreDB.setDBInfo(dbName,setConfig);
    }

    public list(){
        //get all db list
    }

    public join(databaseTableList :Array<databaseTableType>){

    }
}

class dbView {
    constructor(parameters) {
        
    }

    private dbName :string;

    public getInfo(tableName :string, option :object){
        coreDB.getTableInfo(this.dbName,tableName,option)
    }

    public setInfo(tableName :string, setConfig :object){
        coreDB.setTableInfo(this.dbName,tableName,setConfig);
    }

    public resetInfo(tableName :string){

    }

    public table(tableName:string):tableView{
        return new tableView(tableName);
    }

    public create(tableName:string,option:LowLevelDB.tableCreateOption){
        coreDB.createTable(this.dbName,tableName,option);
    }
    
    public rename(tableOldName:string, tableNewName:string) {
        coreDB.renameTable(this.dbName, tableOldName, tableNewName);
    }

    public delete(tableName :string, option :object){
        coreDB.removeTable(this.dbName,tableName,option)
    }

    public move(dbNextName:string,tableName:string){

    }

    public copy(dbNextName:string,tableName:string){

    }

    public list(){

    }

}

class tableView {
    constructor(parameters) {
        
    }

    private dbName    :string;
    private tableName :string;


    public getInfo(){
        coreDB.getTableInfo(this.dbName,this.tableName);
    }

    public setInfo(setConfig:object){
        coreDB.setTableInfo(this.dbName, this.tableName, setConfig);
    }

    public list(){

    }

    public insert(data:any, option?:LowLevelDB.insertTableDataOption) :boolean{
        coreDB.insertTableData(this.dbName,this.tableName,data,option);
        return true;
    }

    public multInsert(data:any, option?:LowLevelDB.insertTableDataOption){
        coreDB.multInsertTableData(this.dbName,this.tableName,data,option);
    }

    public update(oldData:any, newData:any, option?:LowLevelDB.updateTableDataOption) :boolean{
        coreDB.updateTableData(this.dbName,this.tableName,oldData,newData,option);
        return true;
    }

    public updateByRegex() :boolean{
        return true;
    }

    public delete(data:any,option?:LowLevelDB.deleteTableDataOption) :boolean{
        coreDB.deleteTableData(this.dbName,this.tableName,data,option);
        return true;
    }

    public deleteByRegex(regex :RegExp, option?:object) :boolean{
        return true;
    }

    public search(data:any, option?:LowLevelDB.searchTableDataOption) :any{
        coreDB.searchTableData(this.dbName, this.tableName, data, option);
        return [];
    }
    
    public searchByRegex(regex :RegExp, option?:object) :any{

    }

    public join(tableList :Array<string>){

    }

    public sort(){

    }

}


var a  = new jsonSaveDB().use(`db1`).table(`table1`).insert({a:`123`,b:321});
var b  = new jsonSaveDB().use(`db1`).table(`table1`).search({a:`123`,b:321});