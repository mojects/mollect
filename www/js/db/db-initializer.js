ang.service('dbInitializer', function(sync, settingsManager, desk) {

  this.init = () => {
    initStructure()
    .done(() => {
      async.series([
        settingsManager.getClientSettings,
        sync.run
      ], (err) => {
        if (err) desk.error(err)
        else desk.clear()
      });
    })
  }

  function initStructure() {
    var db = $.WebSQL('mollect');
    return db.query(
      `CREATE TABLE IF NOT EXISTS 
        nodes (id VARCHAR(15) PRIMARY KEY, name VARCHAR, description TEXT, category VARCHAR(10),
        avg_weight INT, sync VARCHAR(10), is_deleted INT);`,

      'CREATE TABLE IF NOT EXISTS ' +
      ' links (id VARCHAR(15) PRIMARY KEY, parent_id VARCHAR(15), child_id VARCHAR(15), weight INT,'+
      '  sync VARCHAR(10), is_deleted INT);',

      'CREATE TABLE IF NOT EXISTS ' +
      ' loops (parent_id VARCHAR(15), child_id VARCHAR(15), weight INT, depth INT,'+
      '  PRIMARY KEY (parent_id, child_id));',

      'CREATE TABLE IF NOT EXISTS settings (key VARCHAR, value VARCHAR);',

      'INSERT INTO settings (key, value) '+
      'SELECT "client_version", 1 '+
      'WHERE (SELECT count(0) FROM settings WHERE key="client_version")=0;',

      'INSERT INTO settings (key, value) '+
      'SELECT "client_code", null '+
      'WHERE (SELECT count(0) FROM settings WHERE key="client_code")=0;',

      'INSERT INTO settings (key, value) '+
      'SELECT "server", "http://mollect-server.herokuapp.com" '+
      'WHERE (SELECT count(0) FROM settings WHERE key="server")=0;'
    ).fail(function (tx, err) {
      desk.error(err.message)
    })
  }
})


/*
 To clean DB:
 DROP TABLE IF EXISTS nodes;
 DROP TABLE IF EXISTS links;
 DROP TABLE IF EXISTS  client_version
 */
