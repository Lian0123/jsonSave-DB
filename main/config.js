const config = {
    thread     : 1,
    utcLocate  : 0,
    procLimit  : 2000  ,
    encode     : `utf8`,
    debug      : false ,
    writeLog   : false ,
    path       : {
        //savePath   : `~/.jsonSaveDB/db/`,
        //backupPath : `~/.jsonSaveDB/backup/`,
        //logPath    : "~/.jsonSaveDB/log/",
        savePath   : `/home/lian/git/jsonSave-DB/test/db/`,
        backupPath : `/home/lian/git/jsonSave-DB/test/backup/`,
        logPath    : `/home/lian/git/jsonSave-DB/test/log/`,
    },
    backup     : {
        use        : false,
        backupTime : 84600000, //Date Back up
    },
    hash       : {
        use    : false,
        key    : `21312312312321`,
        split  : 0,
    },
    defaultLimit: {
        databaseNameLength  : 1024,
        tableNameLength     : 1024,
        tableMetaNameLength : 1024,
        tableAboutLength    : 1024
    },
    logConfig: {
        use       : false, 
        showDate  : true,
    },
    db:[
        { dbName: "", InitTime : "2020-01-12 00:00:00" }
    ],
    admin:[
        {id : "root", password : "1234"}
    ]
};

module.exports = config;