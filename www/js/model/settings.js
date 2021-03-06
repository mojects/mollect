var settings = { client_version: null, client_code: null }

ang
    .service('settingsManager', settingsManager)

settingsManager.prototype = new ActiveRecord();
function settingsManager() {

    var self = this;

    this.getClientSettings = function(callback) {
        self.db.query(
            "SELECT key, value FROM settings;"
        ).then(function (rows) {
                rows.forEach(function(row){
                    settings[row['key']] = row['value'];
                });

                callback(null, true);
            });
    };

    this.setClientSetting = function(setting, value) {
        settings[setting] = value;
        self.db.query(
            "UPDATE settings SET value='"+value+"' WHERE key='"+setting+"';"
        ).then(function () {
                return true;
            });
    }
}
