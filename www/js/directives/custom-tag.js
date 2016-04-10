ang
.directive("customTag", function() {
    return {
        templateUrl : "js/directives/custom-tag.html",
        scope : {
            url: "=",
            tagClass: "="
        },
        transclude: true
    };
});