function ActiveRecord () {

    this.db = $.WebSQL('mollect');

    this.find_or_create_by = function (obj, callback) {
        var fields = [];
        var values = [];
        var placeholders = [];
        var self = this;

        $.map(obj, function(value, key) {
            fields.push(key);
            values.push(value);
            placeholders.push("?");
        });

        this.db.query(
            "INSERT INTO "+this.table+" ("+fields+", sync) "+
            "VALUES ("+placeholders+",'new');",
            values
        ).fail(dbErrorHandler)
            .done(function (result) {
                self.id = result.insertId;
                callback();
            });
    }

    this.test = function () {
        console.log("table is : "+ this.table);
    }
};