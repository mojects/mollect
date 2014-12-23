ang
.directive("nodeButton", function() {
    return {
        restrict : "A",
        template : "<a ng-href='#/node/{{node.id}}'>"+
                    "<span class='radius label big' ng-class='labelClass'>"+
                   "{{node.name}}"+
                "</span></a>",
        scope : {
            node : "="
        },
        link : function(scope, elem, attrs) {

            scope.$watch("node", function(oldVal, newVal) {
                if (newVal) { updateClass(); }
            });

            function updateClass() {

                var c = scope.node.category;
                if (c == "thing")
                    scope.labelClass = "success";
                else if (c == "tag")
                    scope.labelClass = "";
                else
                    scope.labelClass = "alert";

            };


        }
    };
});