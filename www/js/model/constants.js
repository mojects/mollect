ang
    .service('Constants', Constants)

Constants.prototype = new ActiveRecord();
function Constants() {

    this.sql(
        "SELECT id, name FROM nodes " +
        "WHERE id IN ('scores', 'avg_score') AND category='system';")
        .then(function(rows){
            rows.forEach(function(row) {
                this[row.name] = row.id;
            });
        });

}