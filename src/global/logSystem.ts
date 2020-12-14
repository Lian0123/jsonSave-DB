import {formateDate} from "./dateTimeFromate"
import * as fs from "fs"
class log{
    constructor(configFile){
        this.formateDate = new formateDate();

        if(configFile === undefined){
            this.showDate  = true;
            this.writeFile = true;
            this.logPath   = "./log/";
        }

        if(configFile.showDate === undefined){
            this.showDate = true;
        }else{
            this.showDate = configFile.showDate;
        }

        if(configFile.showDate === undefined){
            this.showDate = true;
        }else{
            this.showDate = configFile.showDate;
        }
        
        if(configFile.logPath === undefined){
            this.logPath = "./log/";
        }else{
            this.logPath = configFile.logPath;
        }

    }

    addLog(data){
        let tmpdata = data;

        if(this.showDate){
            tmpdata = this.formateDate.getDate() + tmpdata
        }
        
        if(this.writeFile){
            fs.writeFileSync(this.logPath, data);
        }
        
        console.log(tmpdata);
    }
    
    addError(data){
        let tmpdata = data;

        if(this.showDate){
            tmpdata = this.formateDate.getDate() + tmpdata
        }
        
        if(this.writeFile){
            fs.writeFileSync(this.logPath, data);
        }
        
        console.error(tmpdata);
    }

    addWarn(data){
        let tmpdata = data;

        if(this.showDate){
            tmpdata = this.formateDate.getDate() + tmpdata
        }
        
        if(this.writeFile){
            fs.writeFileSync(this.logPath, data);
        }
        
        console.warn(tmpdata);
    }

    addInfo(data){
        let tmpdata = data;

        if(this.showDate){
            tmpdata = this.formateDate.getDate() + tmpdata
        }
        
        if(this.writeFile){
            fs.writeFileSync(this.logPath, data);
        }

        console.info(tmpdata);
    }

    addDebug(data){
        let tmpdata = data;

        if(this.showDate){
            tmpdata = this.formateDate.getDate() + tmpdata
        }
        
        if(this.writeFile){
            fs.writeFileSync(this.logPath, data);
        }

        console.debug(tmpdata);
    }
    
}