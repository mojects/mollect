function sqlWiz(){

    var self = this;
    var model = null;

    this.generatePK = function() {
        sleep(1);
        var time = Date.now().toString(36);
        return time + "-" + settings.client_code;
    }

    this.lastId = this.generatePK();
    this.insertFields = [ 'id' ];
    this.insertValues = [ this.lastId ];
    this.insertPlaceholders = [ '?' ];
    this.updateFields = [];
    this.updateValues = [];
    this.whereCondition = "WHERE is_deleted=0";
    this.whereValues = [];
    this.objID = null;

    this.setData = function(obj, m){
        model = m;

        $.map(obj, function(value, key) {
            self.insertFields.push(key);
            self.insertValues.push(value);
            self.insertPlaceholders.push("?");
            if (key != 'id') {
                self.addUpdateField(key, value);
            }
            if (!obj.hasOwnProperty('id') || key == 'id') {
                self.whereCondition += " AND " + model.table + "." + key + "=?";
                self.whereValues.push(value);
                self.objID = value;
            }
        });
    };

    this.preSearch = function (callbackSuccess, callbackError) {
        model.sql(
            "SELECT id FROM "+model.table+" "+ self.whereCondition,
            self.whereValues
        ).then(function (result) {
                if (result.length>0)  {
                    model.id = result[0].id;
                    if (callbackSuccess) callbackSuccess();
                } else {
                    if (callbackError) callbackError();

                }
            });
    };

    this.insertNewRecord = function (callback) {
        var sync = (model.isTemp ? "temp" : "new");
        model.sqlSafe(
            "INSERT INTO " + model.table + " (" + self.insertFields + ", sync, is_deleted) " +
            "VALUES (" + self.insertPlaceholders + ",'"+sync+"', 0);",
            self.insertValues
        ).catch(callback)
            .then(function(){
                model.id = self.lastId;
                callback(null, model.id)
            });
    };

    this.update = function (callback) {
        var sync = (model.isTemp ? "temp" : "new");
        self.addUpdateField("sync", sync);
        self.addUpdateField("is_deleted", 0);
        self.updateValues.push(self.objID);

        model.sql(
            "UPDATE " + model.table +
            " SET " + self.updateFields.join(",") +
            " WHERE id=?;",
            self.updateValues
        ).then(function () {
                if (callback) callback();
            });
    };

    this.addUpdateField = function(field, value) {
        self.updateFields.push(field + "=?");
        self.updateValues.push(value);
    }

}

function ActiveRecord () {

    var self = this;
    this.isTemp = false;
    this.db = $.WebSQL('mollect');

    this.all = function() {
        return self.sql(
            "SELECT * FROM "+self.table+";"
        );
    }

    this.create = function (obj, callback) {
        var wiz = newClass(sqlWiz);
        wiz.setData(obj, this);
        wiz.insertNewRecord(callback);
    };

    this.update_or_create = function (obj, callback) {
        var wiz = newClass(sqlWiz);
        wiz.setData(obj, this);
        wiz.preSearch(
            function found() {
                wiz.update(callback);
            },
            function notFound() {
                wiz.insertNewRecord(callback);
            });
    };

    this.find_or_create_by = function (obj, callback) {
        var wiz = newClass(sqlWiz);
        wiz.setData(obj, this);
        wiz.preSearch(callback,
            function notFound() {
                wiz.insertNewRecord(callback);
            });
    };

    this.sqlSafe = function(sql, params) {
        var deferred = $$q.defer();

        console.log(sql + params);
        if (typeof params != 'array' && typeof params != 'undefined') params = [params];

        var call;
        if (typeof params == 'undefined')
             call = this.db.query(sql);
        else
            call = this.db.query(sql, params);

        call
            .fail(function dbErrorHandler (tx, err) {
                deferred.reject(err.message + " In sql: " + sql);
            })
            .done(function (result) {
                deferred.resolve(result);
            });

        return deferred.promise;
    };

    this.sql = function(sql, params) {
        return self.sqlSafe(sql, params)
            .catch(function (err) {
                throw new Error(err);
            });
    };

    this.getPlaceholdersFor = function(arr) {
        if (arr.length == 0) return "";
        return (new Array(arr.length)).join("?,") + "?";
    };


    this.test = function () {
        console.log("table is : "+ this.table);
    };
}