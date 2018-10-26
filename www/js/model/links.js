"use strict";

ang

    .factory('Link', function() {
        return Link;
    });

extend(Link, ActiveRecord);
function Link (linkId) {
  this.table = "links"
  this.fields = ["id", "weight"]
}

