const express = require('express');
const menusRouter = express.Router({ mergeParams: true });

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menusRouter.param('menuId', (req, res, next, menuId) => {
    const sql = 'SELECT * FROM Menu WHERE Menu.id = $menuId';
    const values = {$menuId: menuId};
    db.get(sql, values, (error, menu) => {
      if (error) {
        next(error);
      } else if (menu) {
        req.menu = menu;  //I need this explained to me
        next();
      } else {
        res.sendStatus(404);
      }
    });
});

menusRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Menu', (err, menus) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({menus: menus})
      }
    });
});

menusRouter.post('/', (req, res, next) => {
  const title = req.body.menu.title;
  if (!title) {
    return res.sendStatus(400);
  }
  const sql = 'INSERT INTO Menu (title) VALUES ($title)';
  const values = { $title: title };

  db.run(sql, values, function (error) {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Menu WHERE Menu.id = ${this.lastID}`,
        (error, menu) => {
          res.status(201).json({ menu: menu })
        });
    }
  });
});


menusRouter.get('/:menuId', (req, res, next) => {
  res.status(200).json({ menu: req.menu });
});

menusRouter.put('/:menuId', (req, res, next) => {
  const title = req.body.menu.title;
  if (!title) {
    return res.sendStatus(400);
  }
  const sql = 'UPDATE Menu SET title = $title WHERE Menu.id = $menuId';
  const values = {
    $menuId: req.params.menuId,
    $title: title
  };

  db.run(sql, values, function (error) {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Menu WHERE Menu.id = ${req.params.menuId}`,
        (error, menu) => {
          res.status(200).json({ menu: menu })
        });
    }
  });
});

menusRouter.delete('/:menuId', (req, res, next) => {
  const menuIdSql = 'SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuId';
  const menuIdValue = { $menuId: req.params.menuId };
  db.get(menuIdSql, menuIdValue, (error, menu) => {
    if (error) {
      next(error);
    } else if (menu) {
      res.sendStatus(400);
    } else {
      const deleteSql = 'DELETE FROM Menu WHERE Menu.id = $menuId';
      const deleteValues = { $menuId: req.params.menuId };
      db.run(deleteSql, deleteValues, (error) => {
        if (error) {
          next(error);
        } else {
          res.sendStatus(204);
        }
      });
    }
  });
});


menusRouter.get('/:menuId/menu-items', (req, res, next) => {
    const sql = 'SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuId';
    const values = {$menuId: req.params.menuId};
    db.all(sql, values, (error, menus) => {
        if (error) {
          next(error);
        } else {
          res.status(200).json({menuItems: menus});
        }
    });
});

menusRouter.post('/:menuId/menu-items', (req, res, next) => {
   const name = req.body.menuItem.name;
   const description = req.body.menuItem.description;
   const inventory = req.body.menuItem.inventory;
   const price = req.body.menuItem.price;
   if (!name || !description || !inventory || !price) {
      return res.sendStatus(400);
   }

      const sql = 'INSERT INTO MenuItem (name, description, inventory, price, menu_id) ' +
                'VALUES ($name, $description, $inventory, $price, $menuId)';
      const values = {
        $name: name,
        $description: description,
        $inventory: inventory,
        $price: price,
        $menuId: req.params.menuId
      };

      db.run(sql, values, function (error) {
          if (error) {
            next(error);
          } else {
            db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${this.lastID}`, 
            (error, menuItem) => {
              res.status(201).json({menuItem: menuItem});
            });
          }
      });
});

menusRouter.put('/:menuId/menu-items/:menuItemId', (req, res, next) => {
    const menuItem = req.body.menuItem      
    const name = menuItem.name;
    const description = menuItem.description;
    const inventory = menuItem.inventory;
    const price = menuItem.price;
    const menuId = req.params.menuId;
    const menuItemId = req.params.menuItemId;
    if (!name || !description || !inventory || !price || !menuId) {
      return res.sendStatus(400);
    }
        
    const sql = 'UPDATE MenuItem SET name = $name, description = $description, ' +
                'inventory = $inventory, price = $price ' +
                'WHERE MenuItem.id = $menuItemId AND MenuItem.menu_id = $menuId';
    const values = {
      $name: name,
      $description: description,
      $inventory: inventory,
      $price: price,
      $menuId: menuId,
      $menuItemId: menuItemId
    };

    db.run(sql, values, (error) => {
        if (error) {
          next(error);
        } else {
            db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${menuItemId} AND ` +
            `MenuItem.menu_id = ${menuId}`,
            (error, updatedMenuItem) => {
              if (updatedMenuItem) {
                res.status(200).json({ menuItem: updatedMenuItem });
              } else {
                res.sendStatus(404);
              }
            });
        }
    });
});

menusRouter.delete('/:menuId/menu-items/:menuItemId', (req, res, next) => {
      const menuItemId = req.params.menuItemId;
      const menuId = req.params.menuId;
      const menuItemSql = `SELECT * FROM MenuItem WHERE MenuItem.id = $menuItemId`;
      const menuItemValue = {$menuItemId: req.params.menuItemId};
      const sql = 'DELETE FROM MenuItem WHERE MenuItem.id = $menuItemId AND MenuItem.menu_id = $menuId';
      const values = {
        $menuId: menuId,
        $menuItemId: menuItemId,
         };
      db.get(menuItemSql, menuItemValue, (error, menuItem) => {
        if (error) {
          next(error);  //OR SEND STATUS 404
        } else if (menuItem) {
            db.run(sql, values, (error) => {
                 if (error) {
                   next(error);
                 } else {
                   res.sendStatus(204);
                 }
            });
        } else {
          
          res.sendStatus(404);
        } 
      });
});

module.exports = menusRouter;