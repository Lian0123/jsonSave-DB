import { config } from "../../global/config";
import { databaseJsonType, databaseGetOption } from "./base";
import * as path from "path";
import * as fs from "fs";

export function databaseGet(databaseName:string, option?:databaseGetOption) :databaseJsonType{
    let databaseJson :databaseJsonType   = {};
 

    /* ----------------- Start Test Is Formate Database ----------------- */
    if(!fs.existsSync(path.join(config.path.savePath,databaseName))){
        throw new Error(`The Database Name \"`+databaseName+`\" Was Not Created`);
    }

    databaseJson = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,databaseName,`database.json`))));
    if(databaseJson.database !== databaseName){
        throw new Error(`Not Found Select Database Of \"`+databaseName+`\" Of database.json`);
    }
    /* ----------------- End   Test Is Formate Database ----------------- */


    /* ----------------- Start Read Option ----------------- */
    if(option){
        option.dataWall?.forEach(element => {
            if(element === "database")  delete(databaseJson.database);
            if(element === "about")     delete(databaseJson.about);
            if(element === "date")      delete(databaseJson.date);
            if(element === "time")      delete(databaseJson.time);
            if(element === "auth")      delete(databaseJson.auth);         
            if(element === "userList")  delete(databaseJson.userList);
            if(element === "tableList") delete(databaseJson.tableList);
            if(element === "limit")     delete(databaseJson.limit);
        });
    }
    /* ----------------- End   Read Option ----------------- */


    return databaseJson;
}