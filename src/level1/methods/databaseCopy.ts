import { config } from "../../global/config";
import { databaseJsonType, TableJsonType, databaseCopyOption } from "./base";
import * as path from "path";
import * as fs from "fs";
import * as fse from "fs-extra";

export function databaseCopy(fromDatabase :string, toDatabase :string, option? :databaseCopyOption){
    /* ----------------- Start Test Is Formate Database ----------------- */
    if(!fs.existsSync(path.join(config.path.savePath,fromDatabase))){
        throw new Error(`The Database Name \"`+fromDatabase+`\" Was Not Created`);
    }
    /* ----------------- End   Test Is Formate Database ----------------- */

    /* ----------------- Start Copy Database ----------------- */
    fse.copySync(path.join(config.path.savePath,fromDatabase),path.join(config.path.savePath,toDatabase));
    let tableArray :Array<string> = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,toDatabase,`db.json`)))).tableList;
    let tableJson  :TableJsonType = {};
   
    for (let i = 0; i < tableArray.length; i++) {
        tableJson = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,toDatabase,tableArray[i],`table.json`))))
        tableJson.forDB = toDatabase;
        fs.writeFileSync(path.join(config.path.savePath,toDatabase,tableArray[i],`table.json`), JSON.stringify(tableJson, null, 4));
    }
    /* ----------------- End   Copy Database ----------------- */
}
