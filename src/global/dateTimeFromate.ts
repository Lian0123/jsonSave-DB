
export class formateDate{
    offset :number = 0;

    constructor(utcLocateOffset:number){
        this.offset = utcLocateOffset;

        //test UTC locate offset 
        if(utcLocateOffset === undefined){
            this.offset = 0;
        }

        //test UTC locate offset is real locate
        if(utcLocateOffset < -12 || utcLocateOffset > 12){
            this.offset = 0;
        }

    }

    //get date By `YYYY-MM-DD`
    getDate() :string{
        let tmpdate    :Date   = new Date(+new Date()+(this.offset * 3600000));
        let returnDate :string = `` + tmpdate.getFullYear(); 
        
        returnDate += `-`;

        if((tmpdate.getMonth()+1) < 10){
            returnDate += `0` + (tmpdate.getMonth()+1);
        }else{
            returnDate += (tmpdate.getMonth()+1);
        }

        returnDate += `-`;

        if(tmpdate.getDate() < 10){
            returnDate += `0` + tmpdate.getDate();
        }else{
            returnDate += tmpdate.getDate();
        }

        return returnDate;
    }

    //get time By `hh:mm:ss`
    getTime() :string{
        let tmpdate    :Date   = new Date(+new Date()+(this.offset * 3600000));
        let returnDate :string = ``; 

        if(tmpdate.getHours() < 10){
            returnDate += `0` + tmpdate.getHours();
        }else{
            returnDate += tmpdate.getHours();
        }

        returnDate += `:`;

        if(tmpdate.getMinutes() < 10){
            returnDate += `0` + tmpdate.getMinutes();
        }else{
            returnDate += tmpdate.getMinutes();
        }
        
        returnDate += `:`;

        if(tmpdate.getSeconds() < 10){
            returnDate += `0` + tmpdate.getSeconds();
        }else{
            returnDate += tmpdate.getSeconds();
        }

        return returnDate;
    }

    //get datetime By `YYYY-MM-DD hh:mm:ss`
    getDateTime() :string{
        let tmpdate    :Date   = new Date(+new Date()+(this.offset * 3600000));
        let returnDate :string = `` + tmpdate.getFullYear(); 
        
        returnDate += `-`;

        if((tmpdate.getMonth()+1) < 10){
            returnDate += `0` + (tmpdate.getMonth()+1);
        }else{
            returnDate += (tmpdate.getMonth()+1);
        }

        returnDate += `-`;

        if(tmpdate.getDate() < 10){
            returnDate += `0` + tmpdate.getDate();
        }else{
            returnDate += tmpdate.getDate();
        }

        returnDate += ` `;

        if(tmpdate.getHours() < 10){
            returnDate += `0` + tmpdate.getHours();
        }else{
            returnDate += tmpdate.getHours();
        }

        returnDate += `:`;

        if(tmpdate.getMinutes() < 10){
            returnDate += `0` + tmpdate.getMinutes();
        }else{
            returnDate += tmpdate.getMinutes();
        }
        
        returnDate += `:`;

        if(tmpdate.getSeconds() < 10){
            returnDate += `0` + tmpdate.getSeconds();
        }else{
            returnDate += tmpdate.getSeconds();
        }

        return returnDate;
    }

}