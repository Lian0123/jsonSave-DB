# 架構規格書
```
/usr/share/jsonSaveDB/           : 設定檔目錄
   ./node_modules/               : 相依檔案
   ./config.json                 : 低優先序設定檔
   ./doc/                        : 說明文件
   ./core/                       : 核心模組
      ./coreDB.js                : 實際執行器
      ./autoUpdate.js            : 自動更新模組
      ./log.js                   : 日誌模組
      ./formateDate.js           : 日期格式模組
      ./auth.js                  : 帳號驗證模組
   ./main.js                     : 主程式
   ./start.sh                    : 啟動用腳本

~/.jsonSave/                     : 專案資料夾
   ./auth/                       : 操作權限資料夾
      ./config.json              : 帳戶權限設定檔
   ./db/                         : 預設資料庫資料夾
      ./{db}/db.json             : 資料庫資訊
      ./{db}/lock                : 資料庫操作鎖定檔
      ./{db}/{table}/table.json  : 資料表資訊
      ./{db}/{table}/lock        : 資料表操作鎖定檔
      ./{db}/{table}/{1..n}.json : 資料表值計資料
   ./backup/                     : 預設備份檔案資料夾 
   ./log/                        : 預設日誌檔案資料夾
   ./config.json                 : 高優先序設定檔
   
```