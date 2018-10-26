ang
.directive("customTag", function() {
    return {
        templateUrl : "js/components/custom-tag.html",
        scope : {
            url: "=",
            tagClass: "="
        },
        transclude: true
    };
});