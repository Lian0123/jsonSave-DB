import { config } from "../../global/config";
import { formateDate } from "../../global/dateTimeFromate";
import { isDefined, databaseJsonType, databaseRenameOption } from "./base";
import * as path from "path";
import * as fs from "fs";

export function databaseRename(databaseOldName:string, databaseNewName:string, option?:databaseRenameOption) :void{
    let databaseJson     :databaseJsonType     = {};

    
    /* ----------------- Start Test Is Formate Database ----------------- */
    if(option?.regexWall?.test(databaseNewName)){
        throw new Error(`The Wall is block \"`+databaseNewName+`\" Name as databaseName`);
    }

    if(!fs.existsSync(path.join(config.path.savePath,databaseOldName))){
        throw new Error(`The Database Name \"`+databaseNewName+`\" Was Not Created`);
    }

    if(fs.existsSync(path.join(config.path.savePath,databaseNewName))){
        throw new Error(`The Database Name \"`+databaseNewName+`\" Is Be Used`);
    }
    
    databaseJson = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,databaseOldName,`database.json`))));
    if(databaseJson.database !== databaseOldName){
        throw new Error(`Not Found Select Database Of \"`+databaseOldName+`\" Of database.json`);
    }
    /* ----------------- End   Test Is Formate Database ----------------- */

    
    /* ----------------- Start Update Database ----------------- */
    fs.renameSync(path.join(config.path.savePath,databaseOldName), path.join(config.path.savePath,databaseNewName));
    databaseJson.database = databaseNewName;        
    fs.writeFileSync(path.join(config.path.savePath,databaseNewName,`database.json`), JSON.stringify(databaseJson, null, 4), option?.fsOption?.writeFileSyncOption);
    /* ----------------- End   Update Database ----------------- */

}