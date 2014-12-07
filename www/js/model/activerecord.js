function ActiveRecord () {

    this.db = $.WebSQL('mollect');

    this.find_or_create_by = function (obj, callback) {
        var fields = [];
        var values = [];
        var placeholders = [];
        var whereCondition = "WHERE 1";
        var self = this;

        $.map(obj, function(value, key) {
            fields.push(key);
            values.push(value);
            placeholders.push("?");
            whereCondition += " AND "+self.table+"."+key+"=?";
        });

        this.sql(
            "SELECT id FROM "+this.table+" "+ whereCondition,
            values
        ).done(function (result) {
            if (result.length>0)  {
                self.id = result[0].id;
                if (callback) callback();
            } else {
                insertNewRecord();
            }
        });

        function insertNewRecord() {
            self.sql(
                "INSERT INTO " + self.table + " (" + fields + ", sync) " +
                "VALUES (" + placeholders + ",'new');",
                values
            ).done(function (result) {
                self.id = result.insertId;
                if (callback) callback();
            });
        }
    };

    this.sql = function(sql, params) {
        console.log(sql + params);
        if (typeof params != 'array') params = [params];
        return this.db.query(
            sql, params
        ).fail(function dbErrorHandler (tx, err) {
                throw new Error(err.message + " In sql: " + sql);
            });
    }


    this.test = function () {
        console.log("table is : "+ this.table);
    }
};

