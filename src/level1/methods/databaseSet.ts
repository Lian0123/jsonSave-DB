import { config } from "../../global/config";
import { databaseJsonType, databaseSetConfig, databaseSetOption } from "./base";
import * as path from "path";
import * as fs from "fs";


export function databaseSet(databaseName :string, databaseConfig: databaseSetConfig, option? :databaseSetOption){
    let databaseJson   :databaseJsonType = {};

        /* ----------------- Start Test Is Formate Database ----------------- */
        if(fs.existsSync(path.join(config.path.savePath,databaseName))){
            throw new Error(`The Database Name \"`+databaseName+`\" Is Be Used`);
        }

        databaseJson = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,databaseName,`database.json`))));
        if(databaseJson.database !== databaseName){
            throw new Error(`Not Found Select Database Of \"`+databaseName+`\" Of database.json`);
        }
        /* ----------------- End   Test Is Formate Database ----------------- */


        /* ----------------- Start Read Option ----------------- */
        if(databaseConfig?.auth){
            databaseJson.auth = databaseConfig?.auth;
        }

        if(databaseConfig){
            if(databaseConfig?.auth){
                databaseJson.auth = databaseConfig?.auth;
            }

            if(databaseConfig?.about){
                databaseJson.about = databaseConfig?.about;
            }
            
            if(databaseConfig?.limit && databaseJson.limit){
                if(databaseConfig.limit.databaseNameLength){
                    databaseJson.limit.databaseNameLength = databaseConfig.limit.databaseNameLength;
                }

                if(databaseConfig.limit.databaseAboutLength){
                    databaseJson.limit.databaseAboutLength = databaseConfig.limit.databaseAboutLength;
                }
            }

        }
        /* ----------------- End   Read Option ----------------- */


        /* ----------------- Start Rewrite Database database.json----------------- */
        fs.writeFileSync(path.join(config.path.savePath,databaseName,`database.json`), JSON.stringify(databaseJson, null, 4));
        /* ----------------- End   Rewrite Database database.json----------------- */
}