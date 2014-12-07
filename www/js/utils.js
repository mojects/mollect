/**
 *
 * CLASS utils
 *
 */

function newClass(klass) {
    var obj = new klass;

    $.map(obj, function(value, key) {
        if (typeof  value == "function") {
            obj[key] = value.bind(obj);
        }
    });

    return obj;
}

function extend(subClass, superClass) {
    subClass.prototype = new superClass();
}


function PrintProperties(obj) {
    console.log("----Object:---");

    $.map(obj, function(value, key) {
        console.log(key + ": " + typeof  value);
        if (key == "find_or_create_by")
            console.log( value);
    });
}

/**
 *
 *
 */

function log(msg) {
    $("#msg").prepend(msg+"<br/>");
}

function dbErrorHandler (tx, err) {
    throw new Error(err.message);

}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

$(document).foundation({
    offcanvas : {
        // Sets method in which offcanvas opens.
        // [ move | overlap_single | overlap ]
        open_method: 'move',
        close_on_click : true
    }
});

jQuery( document ).ready(function( $ ) {
   log("Document ready");

});

phonegap.initialize();
