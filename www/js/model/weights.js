class Weights {

  static updateAvgWeights() {
    return Weights.updateAvgWeight()
  }

  static updateAvgWeight(nodeId) {

    const where = nodeId ? 'WHERE nodes.id=?' : ''
    const params = nodeId ? [nodeId] : undefined
    const query =
      `UPDATE nodes SET avg_weight = (
          SELECT avg(weight)
          FROM links l
          WHERE l.child_id=nodes.id AND l.parent_id='scores'
        ) ${where}`

    return $$db.query(query, params)

    /* Can be used for REPLACE INTO: (better performance?)
        SELECT n.id, avg(weight) avg_weight
        FROM nodes n LEFT JOIN links l
          ON (n.id=l.child_id AND l.parent_id='scores')
        GROUP BY n.id
     */
  }

}
