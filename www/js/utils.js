/**
 *
 * CLASS utils
 *
 */

function newClass(klass, param1) {
    var obj = new klass(param1);

    $.map(obj, function(value, key) {
        if (typeof  value == "function") {
            obj[key] = value.bind(obj);
        }
    });

    return obj;
}

function extend(subClass, superClass) {
    var inst = new superClass();

    for (var prop in inst)
        subClass.prototype[prop] = inst[prop]
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

function sleep(miliseconds) {
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {
    }
}

// ------------------

$(document).foundation({
    offcanvas : {
        // Sets method in which offcanvas opens.
        // [ move | overlap_single | overlap ]
        open_method: 'move',
        close_on_click : true
    }
});

phonegap.initialize();
