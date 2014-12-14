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
        ).done(function (result) {
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
        model.sql(
            "INSERT INTO " + model.table + " (" + self.insertFields + ", sync, is_deleted) " +
            "VALUES (" + self.insertPlaceholders + ",'"+self.sync+"', 0);",
            self.insertValues
        ).done(function () {
                model.id = self.lastId;
                if (callback) callback();
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
        ).done(function () {
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

    this.sql = function(sql, params) {
        console.log(sql + params);
        if (typeof params != 'array' && typeof params != 'undefined') params = [params];
        return this.db.query(sql, params)
            .fail(function dbErrorHandler (tx, err) {
                throw new Error(err.message + " In sql: " + sql);
            });
    };


    this.test = function () {
        console.log("table is : "+ this.table);
    };
}

