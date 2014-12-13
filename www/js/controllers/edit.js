ang

.controller('EditCtrl', function($scope, $location, Nodes, Case, $routeParams) {

    // All possible tags:
    var tags_objects = Nodes.tags().then(function(tags) {
        $scope.tags_list = tags;
    });

   
    // New:
    $scope.initNew = function() {
        $scope.thing = {category: "thing"};
        $scope.tags = [];
        if ($routeParams.isReaction) {
            $scope.suggestedTags =  Case.getAttributesForNewReaction();
        }
    }

    // ERROR
    $scope.error = function(err) {
        $scope.alert = err;
        $scope.$apply();
    }

    $scope.$watch('selectedTag', function(newValue, oldValue) {
        if (newValue) {
            var tag = newValue.originalObject;
            if (typeof tag == 'object') tag = tag.name;
            console.log("New tag: " + tag);
            $scope.tags.push(tag);
        }
    });

    $scope.dropTag = function(tag) {
        console.log("Drop tag: " + tag);
        $scope.tags.remove(tag);
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