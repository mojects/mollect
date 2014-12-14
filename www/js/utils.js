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

Array.prototype.removeByName = function(name) {
    var self = this;
    this.forEach(function(item, i){
         if(item['name'] == name)
             self.splice(i, 1);
    });
    return this;
};

Array.prototype.pushUnique = function(item) {
    var skip = false;
    if (typeof item == "object") {
        this.forEach(function(i){
            if(i['name'] == item.name)
                skip = true;
        });
        if (!skip)
            this.push(item);
    } else {
        if (this.indexOf(item) == -1)
            this.push(item);
    }
    return this;
};

Array.prototype.merge = function(chunk) {
    this.push.apply(this, chunk);
}

Array.prototype.byID = function(id) {
    var result = null;
    this.some(function(item){
        if(item['id'] == id) {
            return result = item;
        }
    });
    return result;
};

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

// ---
function to01(x) {
    if (x == true)
        return 1
    else
        return 0
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

function stickyFooter() {
    var footer = $("#footer");
    var content = $("#content");
    var pos = footer.position();
    var height = $(window).height();
    height = height - pos.top;
    height = height - footer.height();
    if (height > 0) {
        footer.css({
            'margin-top': height + 'px'
        });
        content.css({
            'min-height': $(window).height() + 'px'
        });
    }
}

$(window).bind("resize", stickyFooter);
$(window).bind("load", stickyFooter);

phonegap.initialize();
