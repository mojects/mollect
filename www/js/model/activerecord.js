var ActiveRecord = speculoos.Class({
    find_or_create_by: function (obj, callback) {
        var fields = [];
        var values = [];
        var placeholders = [];

        console.log("tabel: " + this.table);

        $.map(obj, function(value, key) {
            fields.push(key);
            values.push(value);
            placeholders.push("?");
        });

        this.db.query(
            "INSERT INTO "+self.table+" ("+fields+", sync) "+
            "VALUES ("+placeholders+",'new');",
            values
        ).fail(dbErrorHandler)
            .done(function (result) {
                console.log("resulotO: "+result);
                self.id = result.insertId;
                callback();
            });
    },

    test: function () {
        console.log("table is : "+ this.table);
    }
});