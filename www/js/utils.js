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

function sleep(miliseconds) {
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {
    }
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

function merge_into(into, chunk) {
    into.push.apply(into, chunk);
}


// For todays date;
Date.prototype.today = function () {
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

function currentDateTime() {
    return new Date().today() + " " + new Date().timeNow();
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

jQuery( document ).ready(function( $ ) {
   log("Document ready");

});

phonegap.initialize();
