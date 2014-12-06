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
