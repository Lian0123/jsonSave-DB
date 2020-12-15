import { config } from "../../global/config";
import { formateDate } from "../../global/dateTimeFromate";
import { databaseJsonType, databaseCreateOption } from "./base";
import * as path from "path";
import * as fs from "fs";

const dateTimer = new formateDate(config.utcLocate);

export function databaseCreate(databaseName:string, option?:databaseCreateOption){
    let databaseJson :databaseJsonType = {
        database      : databaseName,
        about         : ``,
        date          : dateTimer.getDate(),
        time          : dateTimer.getTime(),
        auth          : false,
        userList      : [],
        tableList     : [],
        limit         :{
            databaseNameLength  : 1024,
            databaseAboutLength : 1024,
        }
    };


    /* ----------------- Start Test Is Formate Database ----------------- */
    if(fs.existsSync(path.join(config.path.savePath,databaseName))){
        throw new Error(`The Database Name \"`+databaseName+`\" Is Be Used`);
    }
    /* ----------------- End   Test Is Formate Database ----------------- */


    /* ----------------- Start Read Option----------------- */
    if(option?.regexpWall?.test(databaseName)){
        throw new Error(`The Wall is block \"`+databaseName+`\" Name as databaseName`);
    }

    if(option?.dbConfig){
        if(option?.dbConfig?.about){
            databaseJson.about = option?.dbConfig?.about;
        }

        if(option?.dbConfig?.auth){
            databaseJson.auth = option?.dbConfig?.auth;
        }

        if(option?.dbConfig?.userList){
            //Call Auth System
        }
        
    }
    /* ----------------- End   Read Option----------------- */


    /* ----------------- Start Create Database ----------------- */
    fs.mkdirSync(path.join(config.path.savePath,databaseName),option?.fsOption?.mkdirSyncOption);
    fs.writeFileSync(path.join(config.path.savePath,databaseName,`db.json`),JSON.stringify(databaseJson, null, 4),option?.fsOption?.writeFileSyncOption);
    /* ----------------- End   Create Database ----------------- */


    /* ----------------- Start After Create Database Run Table Create ----------------- */
    if(option?.dbConfig?.tableList){
        option?.dbConfig?.tableList.forEach(element => {

        });
    }
    /* ----------------- End After Create Database Run Table Create ----------------- */
}
