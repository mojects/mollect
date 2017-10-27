ang
.directive("starRating", function() {
    return {
        templateUrl: "/html/directives/star-rating.html",
        scope: {
          ratingIndex : "=",
          max : "=",
          onRatingSelected : "&"
        },
        link : function(scope, elem, attrs) {

            var classes = ['foundicon-remove', 'foundicon-star'];

            var updateStars = function() {
                scope.stars = [];
                var r = scope.ratingIndex;
                for ( var i = 0; i < scope.max; i++) {
                    var item = {
                        filled : (i == r - 1) || (i==1 && r==1) || (i==3 && r==5)
                    };
                    item[classes[i]] = true;
                    scope.stars.push(item);
                }
            }

            scope.toggle = function(index) {
                scope.ratingIndex = index + 1;
                var ratingValues = [-100, 100];
                scope.ratingValue = ratingValues[index];
                scope.onRatingSelected({
                    rating : scope.ratingValue
                });
            };
            scope.$watch("ratingIndex", function(newVal, oldVal) {
                if (newVal) { updateStars(); }
            });
        }
    };
});