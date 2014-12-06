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
 * @param msg
 */

function log(msg) {
    $("#msg").prepend(msg+"<br/>");
}

function dbErrorHandler (tx, err) {
    throw new Error(err.message);

}

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
