function ActiveRecord () {

    var self = this;
    this.isTemp = false;
    this.db = $.WebSQL('mollect');

    this.all = function() {
        return self.query(
            "SELECT * FROM "+self.table+";"
        );
    };

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

    // todo: replace with $$db
    this.sqlSafe = function(sql, params) {
        var deferred = $$q.defer();

        //console.log(sql + params);
        if (typeof params != 'object' && typeof params != 'undefined') params = [params];

        var call;
        if (typeof params == 'undefined')
             call = this.db.query(sql);
        else
            call = this.db.query(sql, params);

        call
            .fail(function(tx, err) {
                deferred.reject(err.message + " In sql: " + sql);
            })
            .done(function (result) {
                deferred.resolve(result);
            });

        return deferred.promise;
    };

    this.query = function(sql, params) {
        return self.sqlSafe(sql, params)
            .catch((err) => {
                throw new Error(err)
            })
    };

}