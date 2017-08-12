var $$db = new DB();

function DB() {

  var mollectDB = $.WebSQL('mollect');

  this.query = (sql, params) => {
    //console.log(sql + params);

    if (typeof params == 'undefined')
      return this.multiQuery(sql);

    if (params.constructor !== Array) params = [params];
    return this.multiQuery(sql, params);
  };

  this.multiQuery = function() {
    var args = Array.from(arguments);
    return new Promise((resolve, reject) => {
      mollectDB.query(...args)
      .fail((tx, err) => {
          console.log(args);
        err = err.message+"\n"+args;
        reject(err);
      })
      .done(resolve);
    });
  };

}