function ActiveRecord () {

    var self = this;
    this.isTemp = false;
    this.db = $.WebSQL('mollect');

    this.all = function() {
        return self.query(
            "SELECT * FROM "+self.table+";"
        );
    };

    this.create = function(obj, callback) {
        var wiz = newClass(sqlWiz);
        wiz.setData(obj, this);
        wiz.insertNewRecord(callback);
    }

  this.update = function(data) {
    var wiz = newClass(sqlWiz)
    if (!this.id) throw 'id field missing'
    data.id = this.id
    wiz.setData(data, this)
    return wiz.update()
  }

  this.save = function() {
    var wiz = newClass(sqlWiz)
    console.log(self);
    if (!this.id) throw 'id field missing'
    const data = {}
    this.fields.each((field) => {
      data[field] = this[field]
    })
    wiz.setData(data, this)
    return wiz.update()
  }

    this.update_or_create = function (obj, callback) {
        var wiz = newClass(sqlWiz);
        wiz.setData(obj, this);
        wiz.preSearch(
            function found() {
              wiz.update().then((d) => callback(null, d))
            },
            function notFound() {
                wiz.insertNewRecord(callback);
            });
    };

    this.findOrCreateBy = function (obj) {
      return $$q((resolve) => {
        var wiz = newClass(sqlWiz);
        wiz.setData(obj, this);
        wiz.preSearch(() => resolve(this),
          function notFound() {
            wiz.insertNewRecord(() => resolve(this));
          })
      })
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