ang
.directive("starRating", function() {
    return {
        restrict : "A",
        template : "<ul class='rating'>" +
        "  <li ng-repeat='star in stars' ng-class='star' ng-click='toggle($index)'>" +
        "    <i class=''></i>" + //&#9733
        "  </li>" +
        "</ul>",
        scope : {
            ratingValue : "=",
            max : "=",
            onRatingSelected : "&"
        },
        link : function(scope, elem, attrs) {

            var classes = ['foundicon-remove', 'foundicon-remove', 'foundicon-checkmark', 'foundicon-star', 'foundicon-star'];
            var updateStars = function() {
                scope.stars = [];
                var r = scope.ratingValue;
                for ( var i = 0; i < scope.max; i++) {
                    var item = {
                        filled : (i == r - 1) || (i==1 && r==1) || (i==3 && r==5)
                    };
                    item[classes[i]] = true;
                    scope.stars.push(item);
                }
            };
            scope.toggle = function(index) {
                scope.ratingValue = index + 1;
                var ratingValues = [-2, -1, 0, 50, 100];
                scope.onRatingSelected({
                    rating : ratingValues[index]
                });
            };
            scope.$watch("ratingValue", function(oldVal, newVal) {
                if (newVal) { updateStars(); }
            });
        }
    };
});