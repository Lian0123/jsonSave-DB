# API 規格書
---
## 共用通訊界面
#### 說明：
* [Object] : 共用通訊界面架構(infoInterface)
    * function [string] : function名稱
    * input    [object] : 輸入參數
    * initTime [formateDate] : 其成員生成時間
    * execTime [formateDate] : 函數執行時間
    * output   [any] : 輸出回傳值(未指派)
    * error    [error] : 錯誤訊息/null
#### 範例：
* 正常返回：
```
> let test = add(120,20); // 正常返回：
{
    function : "add",
    input    : {x:"120", y:"50"},
    initTime : "2020-02-03 12:00:21",
    execTime : "2020-02-03 12:10:11",
    output   : 170,
    error    : null
}

> test.output; // 返回：
170
```
* 錯誤返回
```
> let test = add(120,20); // 錯誤返回：
{
    function : "add",
    input    : {x:"120", y:"20"},
    initTime : "2020-02-03 12:00:21",
    execTime : "2020-02-03 12:07:03",
    output   : null,
    error    : new error("a is not defined value")
}
```
---

## jsonSaveDB API
#### 說明：
資料庫管理API，主要為新增資料庫、重新明資料庫、移除資料庫等資料庫層操作。

#### API：
* 建立新資料庫
    * 函數：createDB(dbName,option)
    * 輸入：
        * dbName： [string]欲新增的資料庫名稱
        * option： [object]設定檔
    * 返回：
        * [object] : 溝通界面物件(infoInterface)
    * 說明：
        * 建立新資料庫之函數。
    * 範例：
        * 正常返回：
        ```
            > //使用預設option建立
            > const jsonSaveDB = new jsonSaveDB();
            >
            > //使用預設option建立資料庫
            > jsonSaveDB.createDB("test");
            > //正常返回：
            {
                function : "createDB",
                input    : {dbName:"test",option:undefined},
                initTime : "2020-02-05 11:10:54",
                execTime : "2020-02-05 11:11:32",
                output   : true,
                error    : null
            }
        ```

        * 錯誤返回：
        ```
            > //使用預設option建立
            > const jsonSaveDB = new jsonSaveDB();
            >
            > //使用預設option建立資料庫
            > jsonSaveDB.createDB("test");
            > //錯誤返回：
            {
                function : "createDB",
                input    : {dbName:"test",option:undefined},
                initTime : "2020-02-05 11:10:54",
                execTime : "2020-02-05 11:11:32",
                output   : false,
                error    : new error("test was defined database")
            }
        ```
        

* 重新命名指定資料庫
    * 函數：renameDB(dbName,dbNewName)
    * 輸入：
        * dbName   ： [string]欲重新命名的資料庫名稱
        * dbNewName： [string]欲新命名的資料庫名稱
    * 返回：
        * [object] : 溝通界面物件(infoInterface)
    * 說明：
        * 重新命名資料庫之函數。
    * 範例：
        * 正常返回：
        ```
            > //使用預設option建立
            > const jsonSaveDB = new jsonSaveDB();
            >
            > //在此更新"test"資料庫名稱改為"test2"資料庫
            > jsonSaveDB.renameDB("test","test2");
            > //正常返回：
            {
                function : "renameDB",
                input    : {dbName:"test",dbNewName：:"test2"},
                initTime : "2020-02-05 11:10:54",
                execTime : "2020-02-05 11:11:32",
                output   : ture,
                error    : null
            }
        ```
        * 錯誤返回：
        ```
            > //使用預設option建立
            > const jsonSaveDB = new jsonSaveDB();
            >
            > //在此更新"test4"資料庫名稱改為"test3"資料庫
            > jsonSaveDB.renameDB("test4","test3");
            > //正常返回：
            {
                function : "renameDB",
                input    : [{dbName:"test4",dbNewName：:"test3"},
                initTime : "2020-02-05 11:10:54",
                execTime : "2020-02-05 11:11:32",
                output   : false,
                error    : new error("test4 was not defined database")
            }
        ```

* 移除指定資料庫
    * 函數：removeDB(dbName,option)
    * 輸入：
        * dbName： [string]欲移除的資料庫名稱
        * option： [object]設定檔
    * 返回：
        * [object] : 溝通界面物件(infoInterface)
    * 說明：
        * 移除指令新資料庫之函數。

* 取得所有資料庫
    * 函數：dbList(dbName,option)
    * 輸入：
        * dbName： [string]欲取得的資料庫名稱
        * option ： [object]設定檔
    * 返回：
        * [object] : 溝通界面物件(infoInterface)
    * 說明：
        * 取得所有資料庫料表函數。
        
* 取得單一資料庫資訊
    * 函數：getInfoDB(dbName,option)
    * 輸入：
        * dbName： [string]資料庫名稱
        * option ： [object]設定檔
    * 返回：
        * [object] : 溝通界面物件(infoInterface)
    * 說明：
        * 取得單一一筆的資料庫資訊檔函數，該檔案為db.json之內容。

* 測試資料庫是否合法存在
    * 函數：testDB(dbName)
    * 輸入：
        * dbName： [string]資料庫名稱
    * 返回：
        * [bool] : 資料庫是否存在
    * 說明：
        * 測試資料庫是否合法存在，該檢查範圍涵蓋資料夾是否存在與db.json之重點內容（資料庫名、日期與時間資訊、資料庫設定）以確定是否合法。
        
* 使用資料庫
    * 函數：use(dbName)
    * 輸入：
        * dbName： [string]資料庫名稱
    * 返回：
        * db ： [object]單一資料庫管理物件，錯誤回傳null
    * 說明：
        * 回傳資料庫控制class物件，以對於資料庫進行操作。

## db API
#### 說明：
資料庫管理API，主要為新增資料庫、重新明資料庫、移除資料庫等資料庫層操作。

#### API：
* 取得此資料庫資訊
    * 函數：getInfo(option)
    * 輸入：
        * option    ： [object]設定檔
* 建立於此資料庫下的新資料表
    * 函數：createTable(tableName,option)
    * 輸入：
        * tableName： [string]資料表名稱
        * option    ： [object]設定檔
* 重新命名此資料庫下的指定資料表
    * 函數：renameTable(tableName,tableNewName)
    * 輸入：
        * tableName： [string]欲重新命名的資料表名稱
        * tableNewName： [string]欲新命名的資料表名稱
* 移除指定資料表
    * 函數：removeTable(tableName,option)
    * 輸入：
        * tableName： [string]資料表名稱
        * option    ： [object]設定檔
* 取得所有資料表
    * 函數：tableList(tableName,option)
    * 輸入：
        * tableName： [string]資料表名稱
        * option    ： [object]設定檔
* 取得單一資料表資訊
    * 函數：getTableInfo(tableName,option)
    * 輸入：
        * tableName： [string]資料表名稱
        * option    ： [object]設定檔
* 測試指定資料表是否合法存在
    * 函數：testTable(tableName)
    * 輸入：
        * tableName： [string]資料表名稱
    * 返回：
        * [bool] : 資料庫是否存在

## table API
#### 說明：
為實際的資料控制，對於指定Table進行管理與操作。

#### API：
* 新增一筆資料
    * 函數：insert(data,option)
* 移除一筆資料
    * 函數：delete(data,option)
* 更新一筆資料
    * 函數：update(data,option)
* 查詢一筆資料
    * 函數：search(data,option)
* 合併聯集資料
    * 函數：join(dataArray,option)
* 計算行數
    * 函數：count()
* 排序資料
    * 函數：sort(type)
* 取得表格最大值
    * 函數：max(sum)
* 取得表格最小值
    * 函數：min(sum)
* 取得表格平均值
    * 函數：agv(sum)
* 取得單一筆資訊(第一筆)
    * 函數：frist(sum)
* 取得單一筆資訊(最後筆)
    * 函數：last(sum)

---
## 底層核心操作 coreDB API
#### 說明：
在此操作API為資料庫功能操作之真實實現。

#### API：
* 建立資料庫
    * 名稱：_createDatabase(dbName, option)
    * 輸入：
        * dbName [string] : 資料庫的名稱
        * option [object] : 操作選項
    * 執行：
    ```
    1. test select "database" was not create in "db/".
    2. mkdir of "database".
    3. create "database" lock file.
    4. create "database" of db.json.
    5. remove "database" lock file.
    ```

* 重新命名資料庫
    * 名稱：_renameDatabase(dbName, dbNewName)
    * 輸入：
        * dbName    [string] : 資料庫的原始名稱
        * dbNewName [string] : 資料庫的新名稱
    * 執行：
    ```
    1. test select "database" was create in "db/".
    2. test select "database" of lock file.
    3. test rename "database" not in "db/".
    4. create "database" of lock file.
    5. rename "database" of db.json.
    6. rename "database" of directory.
    7. remove rename "database" of lock file.
    ```

* 移除資料庫
    * 名稱：_removeDatabase(dbName, option)
    * 輸入：
        * dbName [string] : 資料庫的名稱
        * option [object] : 操作選項
    * 執行：
    ```
    1. test select "database" was create in in "db/".
    2. test select "database" of lock file.
    3. create "database" of lock file.
    4. test condition of remove option.
    5. remove "database" of lock file.
    ```

* 取得資料庫資訊
    * 名稱：_getDatabaseInfo(dbName)
    * 輸入：
        * dbName [string] : 資料庫的名稱
    * 執行：
    ```
    1. test select "database" was create in in "db/".
    2. test select "database" of lock file.
    3. return info of "database".
    ```

* 設定資料庫資訊
    * 名稱：_setDatabaseInfo(dbName,setConfig)
    * 輸入：
        * dbName   [string] : 資料庫的名稱
        * setConfig [object] : 設定資訊內容
    * 執行：
    ```
    1. test select "database" was create in in "db/".
    2. test select "database" of lock file.
    3. return info of "database".
    ```

* 新增資料表
    * 名稱：_createTable(dbName, tableName, option)
    * 輸入：
        * dbName    [string] : 資料庫的名稱
        * tableName [string] : 資料表的名稱
        * option    [object] : 操作選項
    * 執行：
    ```
    1. test select "database" was create in in "db/".
    2. test select "database" of lock file.
    3. test select "database/table" was not create in in "db/database".
    4. create "database" of lock file.
    5. mkdir "database/table".
    6. create "database/table" of lock file.
    7. create "database/table" of table.json.
    8. remove "database/table" of lock file.
    9. update "database" of db.json.
    A. remove "database" of lock file.
    ```

* 重新命名資料表
    * 名稱：_renameTable(dbName, tableName, tableNewName)
    * 輸入：
        * dbName       [string] : 資料庫的名稱
        * tableName    [string] : 資料表的名稱
        * tableNewName [string] : 資料表的新名稱
    * 執行：
    ```
    1. test select "database" was create in in "db/".
    2. test select "database" of lock file.
    3. test select "database/table" was create in in "db/database".
    4. create "database" of lock file.
    5. create "database/table" of lock file.
    6. rename "database/table".
    7. update "database/table" of table.json.
    8. remove "database/table" of lock file.
    9. update "database" of db.json.
    A. remove "database" of lock file.
    ```
* 移除資料表
    * 名稱：_removeTable(dbName, tableName, option)
    * 輸入：
        * dbName    [string] : 資料庫的名稱
        * tableName [string] : 資料表的名稱
        * option    [object] : 操作選項
    * 執行：
    ```
    1. test select "database" was create in in "db/".
    2. test select "database" of lock file.
    3. test select "database/table" was create in in "db/database".
    4. create "database" of lock file.
    5. create "database/table" of lock file.
    6. test condition of remove option.
    7. remove "database/table".
    8. update "database" of db.json.
    9. remove "database" of lock file.
    ```
* 取得資料表資訊
    * 名稱：_getTableInfo(dbName, tableName)
    * 輸入：
        * dbName    [string] : 資料庫的名稱
        * tableName [string] : 資料表的名稱
    * 執行：
    ```
    1. test select "database" was create in in "db/".
    2. test select "database" of lock file.
    3. test select "database/table" was create in in "db/".
    4. test select "database/table" of lock file.
    5. return info of "database".
    ```

* 設定資料表資訊
    * 名稱：_setTableInfo(dbName, tableName, setConfig)
    * 輸入：
        * dbName    [string] : 資料庫的名稱
        * tableName [string] : 資料表的名稱
        * setConfig  [string] : 設定資訊內容
    * 執行：
    ```
    1. test select "database" was create in in "db/".
    2. test select "database" of lock file.
    3. test select "database/table" was create in in "db/".
    4. test select "database/table" of lock file.
    5. return info of "database".
    ```

* 資料表新增資料
    * 名稱：_insertTableData(dbName, tableName, data, option)
    * 輸入：
        * dbName    [string] : 資料庫的名稱
        * tableName [string] : 資料表的名稱
        * data      [any]    : 新增資料
        * option    [object] : 操作選項
    * 執行：
    ```
    1. test select "database" was create in in "db/".
    2. test select "database" of lock file.
    3. test select "database/table" was create in in "db/".
    4. test select "database/table" of lock file.
    5. create select "database/table" of lock file.
    6. if is insert to some line, wait the relocate file. 
    7. insert data to this table.
    8. update counter.json.
    9. remove "database/table" of lock file.
    ```
    
* 資料表更新資料
    * 名稱：_updateTableData(dbName, tableName, data, option)
    * 輸入：
        * dbName    [string] : 資料庫的名稱
        * tableName [string] : 資料表的名稱
        * data      [any]    : 新增資料
        * option    [object] : 操作選項
    * 執行：
    ```
    1. test select "database" was create in in "db/".
    2. test select "database" of lock file.
    3. test select "database/table" was create in in "db/".
    4. test select "database/table" of lock file.
    5. create select "database/table" of lock file.
    6. test "id" by counter.json.
    7. search table to get id list.
    8. update table by id list.
    9. update counter.json.
    A. remove "database/table" of lock file.
    ```
* 資料表移除資料
    * 名稱：_deleteTableData(dbName, tableName, data, option)
    * 輸入：
        * dbName    [string] : 資料庫的名稱
        * tableName [string] : 資料表的名稱
        * data      [any]    : 新增資料
        * option    [object] : 操作選項
    * 執行：
    ```
    1. test select "database" was create in in "db/".
    2. test select "database" of lock file.
    3. test select "database/table" was create in in "db/".
    4. test select "database/table" of lock file.
    5. create select "database/table" of lock file.
    6. test "id" by counter.json.
    7. search table to get id list.
    8. remove table by id list.
    9. update counter.json.
    A. remove "database/table" of lock file.
    ```

* 資料表查詢資料
    * 名稱：_searchTableData(dbName, tableName, data, option)
    * 輸入：
        * dbName    [string] : 資料庫的名稱
        * tableName [string] : 資料表的名稱
        * data      [any]    : 新增資料
        * option    [object] : 操作選項
    * 執行：
    ```
    /* --------- 下版本新增 --------- */
    ```

* 資料表JOIN資料
    * 名稱：_getJoinTableData(dbTableArrays, option)
    * 輸入：
        * dbTableArrays   [array<object>] : 資料庫與資料表的名稱組合之物件
        * option [object] : 操作選項
    * 執行：
    ```
    /* --------- 下版本新增 --------- */
    ```

* 資料表計數資料
    * 名稱：_getCountTableData(dbName, tableName,option)
    * 輸入：
        * dbName    [string] : 資料庫的名稱
        * tableName [string] : 資料表的名稱
        * option    [object] : 操作選項
    * 執行：
    ```
    1. test select "database" was create in in "db/".
    2. test select "database" of lock file.
    3. test select "database/table" was create in in "db/".
    4. test select "database/table" of lock file.
    5. create select "database/table" of lock file.
    6. get count by counter.json.
    7. remove "database/table" of lock file.
    ```
* 資料表排序資料
    * 名稱：_getSortTableData(dbName, tableName, option)
    * 輸入：
        * dbName    [string] : 資料庫的名稱
        * tableName [string] : 資料表的名稱
        * option    [object] : 操作選項
    * 執行：
    ```
    1. test select "database" was create in in "db/".
    2. test select "database" of lock file.
    3. test select "database/table" was create in in "db/".
    4. test select "database/table" of lock file.
    5. create select "database/table" of lock file.
    6. get all table list to tmp.
    7. remove "database/table" of lock file.
    6. sort tmp by outside-sort.
    ```

* 取得最大資料
    * 名稱：_getMaxTableData(dbName, tableName, option)
    * 輸入：
        * dbName    [string] : 資料庫的名稱
        * tableName [string] : 資料表的名稱
        * option    [object] : 操作選項
    * 執行：
    ```
    /* --------- 下版本新增 --------- */
    ```

* 取得最小資料
    * 名稱：_getMinTableData(dbName, tableName, option)
    * 輸入：
        * dbName    [string] : 資料庫的名稱
        * tableName [string] : 資料表的名稱
        * option    [object] : 操作選項
    * 執行：
    ```
    /* --------- 下版本新增 --------- */
    ```

* 取得平均資料
    * 名稱：_getAgvTableData(dbName, tableName, option)
    * 輸入：
        * dbName    [string] : 資料庫的名稱
        * tableName [string] : 資料表的名稱
        * option    [object] : 操作選項
    * 執行：
    ```
    /* --------- 下版本新增 --------- */
    ```

* 取得首筆資料
    * 名稱：_getFristTableData(dbName, tableName, option)
    * 輸入：
        * dbName    [string] : 資料庫的名稱
        * tableName [string] : 資料表的名稱
        * option    [object] : 操作選項
    * 執行：
    ```
    /* --------- 下版本新增 --------- */
    ```

* 取得最後資料
    * 名稱：_getLastTableData(dbName, tableName, option)
    * 輸入：
        * dbName    [string] : 資料庫的名稱
        * tableName [string] : 資料表的名稱
        * option    [object] : 操作選項
    * 執行：
    ```
    /* --------- 下版本新增 --------- */
    ```

* 備份檔案
    * 名稱：BackupDatabase(databaseArray, path)
    * 輸入： 
        * databaseArray [string] : 要備份的資料庫名單
        * path [string] : 路徑
    * 返回：
        * [object] : 溝通界面物件
    * 執行：
    ```
    1. cp "db/" to "backup/" 
    ```

