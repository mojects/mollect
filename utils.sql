SELECT n.name, p.name, l.depth
FROM nodes n JOIN loops l ON (n.id=l.child_id)
  JOIN nodes p ON (l.parent_id=p.id)  ;


UPDATE links SET child_id='i3nxt5zo-ini',parent_id='avg_score',weight=81,sync='new',is_deleted=0
WHERE is_deleted=0 AND links.child_id='i3nxt5zo-ini' AND links.parent_id='avg_score'


SELECT n.*, parents.parent_id parent_id FROM nodes n
  JOIN (SELECT l.child_id, l.parent_id
    FROM links l JOIN nodes p ON (l.parent_id=p.id AND l.is_deleted=0 )
    LEFT JOIN links h ON (p.id=h.child_id AND h.is_deleted=0 AND h.parent_id='home')
    WHERE (h.child_id IS NOT NULL OR p.id='home') AND  p.is_deleted=0 AND p.category='tag'
  ) parents ON (n.id=child_id)
WHERE n.is_deleted=0 AND category='tag';


SELECT n.*, parents.parent_id parent_id FROM nodes n
  JOIN (SELECT child_id, parent_id
    FROM links l JOIN nodes p ON (parent_id=p.id)
    WHERE l.is_deleted=0 and p.is_deleted=0 AND p.category='tag'
  ) parents ON (n.id=child_id)
WHERE n.is_deleted=0 AND category='tag';

INSERT INTO `heroku_4513d805c9c6cbd`.`nodes` (`id`, `name`, `category`, `version`) VALUES ('scores', 'scores', 'system', '4');
INSERT INTO `heroku_4513d805c9c6cbd`.`nodes` (`id`, `name`, `category`, `version`) VALUES ('avg_score', 'avg_score', 'system', '4');


SELECT DISTINCT *
                FROM links
                WHERE is_deleted=0 AND parent_id='obstacles'
                AND child_id IN ('i454nx7r-ini')

                SELECT children.* FROM links l JOIN nodes children ON
                 (l.child_id=children.id) WHERE l.is_deleted=0 AND children.is_deleted=0
                 AND l.parent_id IN ('i3nu0be9-ini')
                 GROUP BY children.id
                  HAVING  MAX(l.parent_id IN ('i3nxzq33-ini'))=0;




                SELECT children.name
                FROM links l
                 JOIN nodes children ON
                   (l.child_id=children.id AND l.is_deleted=0 AND l.parent_id IN ('i3nu0be9-ini'))
                 LEFT JOIN links negative ON
                   (negative.child_id=children.id AND negative.is_deleted=0 AND negative.parent_id IN ())
                WHERE  children.is_deleted=0
                GROUP BY children.id
                HAVING  MIN(negative.child_id IS NULL)=1;