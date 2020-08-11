import * as fs    from "fs";
import * as path  from "path";
import * as config from "../config.js";
import { parentPort, workerData } from "worker_threads";

type searchOption = {
    type :string,
};

type retrunSearchType = {
    frameId :number,
    info    :Array<{rowId:number,data:any}>,
};

let rowData    :Array<any> = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath, workerData.dbName,workerData.tableName, `data_`+workerData.frameId+`.json`)))).data;
let searchGet  :Array<{rowId:number,data:any}> = [];
let searchNeed :Array<string> = [];
let dataHave   :Array<string> = [];
let searchTest :boolean = false;


if(workerData.option.type === `fullData`){
    for (let i = 0; i < rowData.length; i++) {
        if(rowData[i] === workerData.search){
            console.log(`??`+rowData[i]);
            
            searchGet.push({rowId:i,data:rowData[i]});
        }
        
    }
}else if(workerData.option.type === `fullMember`){
    searchNeed = Object.getOwnPropertyNames(workerData.search);
    for (let i = 0; i < rowData.length; i++) {
        searchTest = true;
        for (let j = 0; j < searchNeed.length; j++) {
            if(rowData[i][searchNeed[j]] !== workerData.search[searchNeed[j]] || rowData[i][searchNeed[j]] === undefined){
                searchTest = false;
            }
        }

        if(searchTest){
            searchGet.push({rowId:i,data:rowData[i]});
        }
    }
}else if(workerData.option.type === `onlyMember`){
    searchNeed = Object.getOwnPropertyNames(workerData.search);
    for (let i = 0; i < rowData.length; i++) {
        searchTest = false;
        for (let j = 0; j < searchNeed.length; j++) {
            if(rowData[i][searchNeed[j]] === workerData.search[searchNeed[j]] && rowData[i][searchNeed[j]] !== undefined){
                searchTest = true;
            }
        }

        if(searchTest){
            searchGet.push({rowId:i,data:rowData[i]});
        }
    }
}else if(workerData.option.type === `onlydeepMember`){
    searchNeed = Object.getOwnPropertyNames(workerData.search);
    for (let i = 0; i < rowData.length; i++) {
        searchTest = false;
        for (let j = 0; j < searchNeed.length; j++) {
            if(typeof(rowData[i][searchNeed[j]]) === `object`){
                searchTest = deepSearchRecursion(rowData[i][searchNeed[j]],workerData.search);
            }else if(rowData[i][searchNeed[j]] === workerData.search[searchNeed[j]] && rowData[i][searchNeed[j]] !== undefined){
                searchTest = true;
            }
        }

        if(searchTest){
            searchGet.push({rowId:i,data:rowData[i]});
        }
    }
}


function deepSearchRecursion(objectGet:any, search:object):boolean{
    let objectMember :any = Object.getOwnPropertyNames(objectGet);
    let searchNeed :any = Object.getOwnPropertyNames(search);

    for (let i = 0; i < objectMember.length; i++) {
        if(typeof(objectGet[objectMember[i]]) === `object`){
            if(deepSearchRecursion(objectGet[objectMember[i]],search)){
                return true;
            }
        }
    }

    for (let i = 0; i < searchNeed.length; i++) {
        if(objectGet[searchNeed[i]] === search[searchNeed[i]] && objectGet[searchNeed[i]] !== undefined){
            return true;
        }
    }

    return false;
}

parentPort.postMessage({frameId: workerData.frameId, info:searchGet });
/*
parentPort.on('message', function(dbName:string, tableName:string, search:any, frameId:number, option:searchOption) {
    let rowData    :Array<any> = JSON.parse(String(fs.readFileSync(path.join(config.path.savePath,dbName,tableName,`data_`+frameId+`.json`)))).data;
    let searchGet  :Array<{rowId:number,data:any}> = [];
    let searchNeed :Array<string> = [];
    let dataHave   :Array<string> = [];
    let searchTest :boolean = false;
    
    if(option.type === `fullData`){
        for (let i = 0; i < rowData.length; i++) {
            if(rowData[i] === search){
                searchGet.push({rowId:i,data:rowData[i]});
            }
            
        }
    }else if(option.type === `fullMember`){
        searchNeed = Object.getOwnPropertyNames(search);
        for (let i = 0; i < rowData.length; i++) {
            searchTest = false;
            for (let j = 0; j < searchNeed.length; j++) {
                if(rowData[i][searchNeed[j]] === search[searchNeed[j]] && rowData[i][searchNeed[j]] !== undefined){
                    searchTest = true;
                }else{
                    searchTest = false;
                }
            }

            if(searchTest){
                searchGet.push({rowId:i,data:rowData[i]});
            }
        }
    }else if(option.type === `onlyMember`){
        searchNeed = Object.getOwnPropertyNames(search);
        for (let i = 0; i < rowData.length; i++) {
            searchTest = false;
            for (let j = 0; j < searchNeed.length; j++) {
                if(rowData[i][searchNeed[j]] === search[searchNeed[j]] && rowData[i][searchNeed[j]] !== undefined){
                    searchTest = true;
                }
            }

            if(searchTest){
                searchGet.push({rowId:i,data:rowData[i]});
            }
        }
    }else if(option.type === `onlydeepMember`){
        searchNeed = Object.getOwnPropertyNames(search);
        for (let i = 0; i < rowData.length; i++) {
            searchTest = false;
            for (let j = 0; j < searchNeed.length; j++) {
                if(typeof(rowData[i][searchNeed[j]]) === `object`){
                    searchTest = deepSearchRecursion(rowData[i][searchNeed[j]],search);
                }else if(rowData[i][searchNeed[j]] === search[searchNeed[j]] && rowData[i][searchNeed[j]] !== undefined){
                    searchTest = true;
                }
            }

            if(searchTest){
                searchGet.push({rowId:i,data:rowData[i]});
            }
        }
    }
    parentPort.postMessage({frameId: frameId, info:searchGet });
});


function deepSearchRecursion(objectGet:any, search:object):boolean{
    let objectMember :any = Object.getOwnPropertyNames(objectGet);
    let searchNeed :any = Object.getOwnPropertyNames(search);

    for (let i = 0; i < objectMember.length; i++) {
        if(typeof(objectGet[objectMember[i]]) === `object`){
            if(deepSearchRecursion(objectGet[objectMember[i]],search)){
                return true;
            }
        }
    }

    for (let i = 0; i < searchNeed.length; i++) {
        if(objectGet[searchNeed[i]] === search[searchNeed[i]] && objectGet[searchNeed[i]] !== undefined){
            return true;
        }
    }

    return false;
}*/

