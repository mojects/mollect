/**
 *
 * CLASS utils
 *
 */

function newClass(klass, param1) {
  var instance = new klass(param1);

  for (var key in instance) {
    let value = instance[key]
    if (typeof  value == "function")
      instance[key] = value.bind(instance)
  }

  return instance
}

function extend(subClass, parentClass) {
    var parent = new parentClass();

    for (var prop in parent) {
      subClass.prototype[prop] = parent[prop]
    }
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

Array.prototype.each = Array.prototype.forEach

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
