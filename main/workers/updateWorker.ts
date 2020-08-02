import * as fs    from "fs";
import * as path  from "path";
import * as config from "../config.js";
import { parentPort } from "worker_threads";

type updateOption = {
    type :string,
};

parentPort.on('message', function(dbName:string, tableName:string, newData:any, frameId:number, info:Array<{rowId:number,data:any}>, option:updateOption) {
    let rowData       :Array<any>    = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,dbName,tableName,`data_`+frameId+`.json`)))).data;
    let objectMember  :any;
    if(option.type === `forData`){
        for (let i = 0; i < info.length; i++) {
            rowData[info[i].rowId] = newData;
        }
    }else if(option.type === `forMember`){
        for (let i = 0; i < info.length; i++) {
            objectMember = Object.getOwnPropertyNames(newData);
            for (let j = 0; j < objectMember.length; j++) {
                rowData[info[i].rowId][objectMember[j]] = newData[objectMember[j]];
            }
        }
    }else if(option.type === `forDeepMember`){
        //deepUpdateRecursion(objectMember,newData);
    }

    parentPort.postMessage({});
});

function deepUpdateRecursion(objectGet:any, newData:object):void{

}