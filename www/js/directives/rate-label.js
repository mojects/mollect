ang
.directive("rateLabel", function() {
    return {
        restrict : "A",
        template : "<span class='label' ng-class='labelClass'>{{ratingValue}}</span>",
        scope : {
            ratingValue : "="
        },
        link : function(scope, elem, attrs) {

            scope.$watch("ratingValue", function(oldVal, newVal) {
                if (newVal) { updateClasses(); }
            });

            function updateClasses() {

                var v = scope.ratingValue;
                if (v > 80)
                    scope.labelClass = "success";
                else if (v > 0)
                    scope.labelClass = "";
                else if (v == 0)
                    scope.labelClass = "secondary";
                else if (v < 0)
                    scope.labelClass = "alert";

            };


        }
    };
});