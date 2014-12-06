ang

    .factory('Link', function($q) {
        Link.prototype.$q = $q;
        return Link;
    });


Link.prototype = new ActiveRecord();
function Link (linkId) {
    this.table = "links";
}


var n = new Link();
n.test();