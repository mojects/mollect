angular.module('mollect')

.controller('NewCtrl', function($scope, $location, Nodes, Case, $routeParams) {

    if ($routeParams.isReaction) {
        $scope.info = Case.currentCaseNode;
    }

    $scope.thing = {category: "thing"};
    // Tags:
    var tags_objects = Nodes.tags().then(function(tags) {
        $scope.tags_list = tags;
    });
    $scope.tags = [];

    $scope.error = function(err) {
        $scope.alert = err;
        $scope.$apply();
    }

    $scope.save = function() {
        $scope.thing.tags = $scope.tags;

        $scope.info = "";
        $scope.alert = "";

        Nodes.insertNode($scope.thing)
            .then(function(nodeId){
                $scope.info = "Saved!";
                location.href = "#/node/" + nodeId;
            });

                /*
        def self.save_node_with_tags (params)
        node = Node.find_or_initialize_by(name: params[:node][:name],
        category: params[:node][:category])
        node.description = params[:node][:description]
        node.save()
        node.link_tags(params[:tags])
        node
        end

        def link_tags(tags)
        tags.each do |tag|
        tag_record = Node.find_or_create_by(name: tag, category: "tag")
        Link.find_or_create_by(parent_id: tag_record.id, child_id: self.id)
        end
        end

        node.$save().then(
            function(data) {
                $scope.info = "Saved";
                // $location.path('/');
            },
            function(data) {
                $scope.alert = data;
            });                     */
    };


})