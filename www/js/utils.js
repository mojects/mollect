function log(msg) {
    $("#msg").prepend(msg+"<br/>");
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
