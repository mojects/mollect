function sqlWiz(){

  var self = this;
  var model = null;

  this.generatePK = function() {
    sleep(1);
    var time = Date.now().toString(36);
    return time + "-" + settings.client_code;
  };

  this.lastId = this.generatePK();
  this.insertFields = [ 'id' ];
  this.insertValues = [ this.lastId ];
  this.insertPlaceholders = [ '?' ];
  this.updateFields = [];
  this.updateValues = [];
  this.whereCondition = "WHERE is_deleted=0";
  this.whereValues = [];
  this.objID = null;
  this.nonComparableFields = ['weight', 'description', 'is_deleted', 'depth'];

  this.setData = function(obj, m){
    model = m;

    $.map(obj, function(value, key) {
      self.insertFields.push(key);
      self.insertValues.push(value);
      self.insertPlaceholders.push("?");
      if (key == 'id')
        self.objID = value;
      else
        self.addUpdateField(key, value);

      if (self.nonComparableFields.indexOf(key) != -1) return;
      if (!obj.hasOwnProperty('id') || key == 'id') {
        self.whereCondition += " AND " + model.table + "." + key + "=?";
        self.whereValues.push(value);
      }
    });
  };

  this.preSearch = function (callbackSuccess, callbackError) {
    model.query(
      "SELECT id FROM "+model.table+" "+ self.whereCondition,
      self.whereValues
    ).then(function (result) {
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
    model.sqlSafe(
      "INSERT INTO " + model.table + " (" + self.insertFields + ", sync, is_deleted) " +
      "VALUES (" + self.insertPlaceholders + ",'"+sync+"', 0);",
      self.insertValues
    ).catch(callback)
      .then(function(){
        model.id = self.lastId;
        callback(null, model.id)
      });
  };

  this.update = function(callback) {
    var sync = (model.isTemp ? "temp" : "new");
    self.addUpdateField("sync", sync);
    self.addUpdateField("is_deleted", 0);
    // self.updateValues.push(self.objID);

    model.query(
      "UPDATE " + model.table +
      " SET " + self.updateFields.join(",") + " " +
      self.whereCondition,
      self.updateValues.concat(self.whereValues)
    ).then(function () {
      if (callback) callback();
    });
  };

  this.addUpdateField = function(field, value) {
    self.updateFields.push(field + "=?");
    self.updateValues.push(value);
  }

}