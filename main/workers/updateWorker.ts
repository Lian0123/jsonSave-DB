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
        for (let i = 0; i < info.length; i++) {
            objectMember = Object.getOwnPropertyNames(newData);
            if(typeof(rowData[info[i].rowId]) ===`object` && typeof(newData) ===`object`){
                for (let j = 0; j < objectMember.length; j++) {
                    rowData[info[i].rowId][objectMember[j]] = deepUpdateRecursion(rowData[info[i].rowId][objectMember[j]],newData[objectMember[j]]);
                }
            }else{
                rowData[info[i].rowId] = newData;
            }
        }
    }else if(option.type === `clearData`){
        for (let i = 0; i < info.length; i++) {
            rowData[info[i].rowId] = null;
        }
    }else if(option.type === `deleteData`){
        for (let i = 0; i < info.length; i++) {
            rowData.splice(info[i].rowId,1);
        }
    }

    fs.writeFileSync(path.join(config.path.savePath,dbName,tableName,`data_`+frameId+`.json`), JSON.stringify({data:rowData}, null, 4));
    parentPort.postMessage({});
});

function deepUpdateRecursion(objectGet:any, newData:any) :any{
    let objectMember  :any = Object.getOwnPropertyNames(newData);

    if(typeof(newData) ===`object`&&typeof(objectGet) ===`object`){
        for (let i = 0; i < objectMember.length; i++) {
            objectGet[objectMember[i]] = deepUpdateRecursion(objectGet[objectMember[i]],newData[objectMember[i]]);
        }
        return objectGet;
    }else{
        return newData;
    }

}