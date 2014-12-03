angular.module('mollect')

.controller('NewCtrl', function($scope, $location, Nodes) {

    $scope.thing = {category: "thing"};
    // Tags:
    var tags_objects = Nodes.tags(function() {
        tags_array = [];
        angular.forEach(tags_objects, function(tag) {
            this.push(String(tag.name));
        }, tags_array);
        $scope.tags_list = tags_array;
    });
    $scope.tags = [];

    $scope.save = function() {

        $scope.thing.tags = $scope.tags;

        $scope.info = "";
        $scope.alert = "";

        async.series([
            async.apply(Nodes.insertNode, $scope.thing)
            ],
            function(err, results){
                if (err) {
                    $scope.alert = err;
                    $scope.$apply();
                }else {

                }
            });

        return;

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