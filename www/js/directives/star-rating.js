ang
.directive("starRating", function() {
    return {
        templateUrl: "html/directives/star-rating.html",
        scope: {
          onRatingSelected : "&"
        },
        link : function(scope, elem, attrs) {

          var classes = ['foundicon-remove', 'foundicon-star']

          updateStars()
          function updateStars() {
            scope.stars = [];
            for (var i = 0; i <= classes.length; i++) {
              var item = {
                filled : (i == scope.ratingIndex)
              }
              item[classes[i]] = true
              scope.stars.push(item)
            }
          }

          scope.toggle = function(index) {
              scope.ratingIndex = index;
              var ratingValues = [-100, 100];
              scope.ratingValue = ratingValues[index];
              scope.onRatingSelected({
                  rating : scope.ratingValue
              });
          };
          scope.$watch("ratingIndex", function(newVal, oldVal) {
              if (newVal !== undefined) { updateStars(); }
          });
        }
    };
});