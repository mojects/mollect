"use strict";

ang

    .factory('Link', function($q) {
        Link.prototype.$q = $q;
        return Link;
    });

extend(Link, ActiveRecord);
function Link (linkId) {
    this.table = "links";
}

