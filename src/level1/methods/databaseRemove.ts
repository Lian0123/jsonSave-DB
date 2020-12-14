import { config } from "../../global/config";
import { databaseJsonType, databaseRemoveOption } from "./base";
import * as path from "path";
import * as fs from "fs";

export function databaseRename(databaseName:string, option?:databaseRemoveOption) :void{
    let databaseJson   :databaseJsonType      = {};


    /* ----------------- Start Test Is Formate Database ----------------- */
    if(!fs.existsSync(path.join(config.path.savePath,databaseName))){
        throw new Error(`The Database Name \"`+databaseName+`\" Was Not Created`);
    }

    databaseJson = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,databaseName,`database.json`))));
    if(databaseJson.database !== databaseName){
        throw new Error(`Not Found Select Database Of \"`+databaseName+`\" Of database.json`);
    }
    /* ----------------- End   Test Is Formate Database ----------------- */
   

    /* ----------------- Start Remove Database ----------------- */
    if(option?.fsOption?.rmSyncOption?.recursive === true){
        if(option?.cleanFileLock){
            throw new Error(`The cleanFileLock flag is \"Lock\", it can't be recursive delete, please let the cleanFileLock be \"false\".`)
        }else{
            fs.rmSync(path.join(config.path.savePath,databaseName),option?.fsOption?.rmSyncOption);
        }
    }else{
        if(databaseJson.tableList){
            if(databaseJson.tableList?.length > 0 && fs.readdirSync(path.join(config.path.savePath,databaseName)).length > 1){
                throw new Error(`The database have table, please after remove the all table, use the \"databaseRemove\". Btw if you need remove all file please use the \"fsOption\" and close \"cleanFileLock\".`)
            }else{
                fs.unlinkSync(path.join(config.path.savePath,databaseName,"database.json"));
                fs.rmSync(path.join(config.path.savePath,databaseName));
            }
        }else{
            throw new Error(`The database loss table member.`)
        }
        
    }
    /* ----------------- End   Remove Database ----------------- */
}