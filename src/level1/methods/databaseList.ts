import { config } from "../../global/config";
import { databaseListOption } from "./base";
import * as path from "path";
import * as fs from "fs";

export function databaseList(option?: databaseListOption) :Array<string>{
    /* ----------------- Start Test Is Formate Database ----------------- */
    if(!fs.existsSync(path.join(config.path.savePath))){
        throw new Error(`The Config Of \"savePath\" : \"`+path.join(config.path.savePath)+`\" Was Not Directory`);
    }
    /* ----------------- End   Test Is Formate Database ----------------- */
        
    return fs.readdirSync(config.path.savePath);
}