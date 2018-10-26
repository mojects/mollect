ang.service('sync',
function($http, nodes, settingsManager, desk) {

  var self = this

  this.run = function(callback) {
    self.pingServer()
    .then(self.retrievePrerequisites)
    .then(self.syncWithServer)
    .then(self.saveNewDataToDB)
    .then(Weights.updateAvgWeights)
    .then(self.refreshLoadedData)
    .then(self.rebuildLoops)
    .then(() => callback())
    .catch(callback)
  };

  this.pingServer = () => {
    desk.info('1/3 ping server...')
    var req = {
        method: 'OPTIONS',
        url: settings.server+'/sync'
    }
    return $http(req)
      .catch((response) => {
        throw response.data || 'Server ping error'
      })
  }

  this.retrievePrerequisites = () =>
    Promise.all([
      self.retrieveEntriesForUpdate("nodes"),
      self.retrieveEntriesForUpdate("links")
    ])

  this.retrieveEntriesForUpdate = (table) =>
    $$db.multiQuery(
      "UPDATE "+table+" SET sync='sent' WHERE sync='new';",
      "SELECT * FROM "+table+" WHERE NOT sync IN ('original', 'new', 'temp');"
    )

  this.syncWithServer = (tables) => {
      desk.info('2/3 sync data...')
      var req = {
        method: 'POST',
        url: settings.server+'/sync.json',
        data: self.buildDataForServer(tables)
      }

      return $http(req).catch((response) => {
        throw response.data || 'Sync error'
      })
  }

  this.saveNewDataToDB = (response) => {

    // Check for possible conflicts on local storage
    // ToDO:
    // Те записи, что успели стать new, убираем из очереди обновления и

    let data = response.data
    if (data.client_code)
      settingsManager.setClientSetting("client_code", data.client_code)

    return Promise.all([saveNodes(), saveLinks()])

    function saveNodes() {
      // Transform to array which SQL will like
      var rows = []
      data.nodes.forEach((node) =>
        rows.push([node.id, node.name, node.description, node.category, to01(node.is_deleted)])
      )
      if (rows.length == 0) return
      //
      return $$db.query(`
        INSERT OR REPLACE INTO nodes (id, name, description, category, is_deleted, sync)
        VALUES (?, ?, ?, ?, ?, 'original')`,
        rows
      )
    }

    function saveLinks() {
      // Transform to array which SQL will like
      var links = [];
      data.links.forEach((link) =>
        links.push([link.id, link.parent_id, link.child_id, link.weight, to01(link.is_deleted)])
      )
      if (links.length == 0) return

      return $$db.query(
        `INSERT OR REPLACE INTO links (id, parent_id, child_id, weight, is_deleted, sync)
        VALUES (?, ?, ?, ?, ?, 'original')`,
        links
      )
    }
  }

  this.refreshLoadedData = () => {
    nodes.getIndexNodes()
  }

  this.rebuildLoops = () => {
    desk.info('3/3 optimize data...')
    return newClass(Loops).rebuildLoops()
  }

  this.buildDataForServer = (tables) => {
    var data = {}
    data.client_version = settings.client_version
    data.client_code = settings.client_code
    data.nodes = tables[0]
    data.links = tables[1]
    return data
  }

  this.cleanLocal = (callback) => {
    $$db.multiQuery(
      "drop table nodes;",
      "drop table links;"
    ).catch(callback)
    .then(callback)
  }

})
