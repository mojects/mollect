function ActiveRecord () {


    this.isTemp = false;
    this.db = $.WebSQL('mollect');

    this.create = function (obj, callback) {
        this.perform_search_and_creation(obj, false, callback);
    }

    this.find_or_create_by = function (obj, callback) {
        this.perform_search_and_creation(obj, true, callback);
    }

    this.perform_search_and_creation = function (obj, do_presearch, callback) {
        var self = this;

        var lastId = self.generatePK();
        var fields = [ 'id' ];
        var values = [ lastId ];
        var insertPlaceholders = [ '?' ];
        var whereCondition = "WHERE is_deleted=0";
        var whereValues = [];

        $.map(obj, function(value, key) {
            fields.push(key);
            values.push(value);
            insertPlaceholders.push("?");
            if (key != 'id') {
                whereCondition += " AND " + self.table + "." + key + "=?";
                whereValues.push(value);
            }
        });

        if (do_presearch)
            presearch();
        else
            insertNewRecord();

        function presearch() {
            self.sql(
                "SELECT id FROM "+self.table+" "+ whereCondition,
                whereValues
            ).done(function (result) {
                    if (result.length>0)  {
                        self.id = result[0].id;
                        if (callback) callback();
                    } else {
                        insertNewRecord();
                    }
                });
        }

        function insertNewRecord() {
            var sync = (self.isTemp ? "temp" : "new");
            self.sql(
                "INSERT INTO " + self.table + " (" + fields + ", sync) " +
                "VALUES (" + insertPlaceholders + ",'"+sync+"');",
                values
            ).done(function (result) {
                self.id = lastId;
                if (callback) callback();
            });
        }
    };

    this.generatePK = function() {
        sleep(1);
        var time = Date.now().toString(36);
        // time = time.split('').reverse().join('');
         return time + "-" + settings.client_code;
    }

    this.sql = function(sql, params) {
        console.log(sql + params);
        if (typeof params != 'array' && typeof params != 'undefined') params = [params];
        return this.db.query(sql, params)
            .fail(function dbErrorHandler (tx, err) {
                throw new Error(err.message + " In sql: " + sql);
            });
    }


    this.test = function () {
        console.log("table is : "+ this.table);
    }
};

