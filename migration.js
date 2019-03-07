const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

db.serialize(function() {
  db.run('DROP TABLE IF EXISTS Employee');
  db.run('CREATE TABLE `Employee` ( ' +
    '`id` INTEGER NOT NULL, ' +
    '`name` TEXT NOT NULL, ' +
    '`position` TEXT NOT NULL, ' +
    '`wage` INTEGER NOT NULL, ' +
    '`is_current_employee` INTEGER DEFAULT 1, ' +
    'PRIMARY KEY(`id`) )' ); //END of Employee Table

//Timesheet Table Below
  db.run('DROP TABLE IF EXISTS Timesheet');
  db.run('CREATE TABLE `Timesheet` ( ' +
    '`id` INTEGER NOT NULL, ' +
    '`hours` INTEGER NOT NULL, ' +
    '`rate` INTEGER NOT NULL, ' +
    '`date` INTEGER NOT NULL, ' +
    '`employee_id` INTEGER NOT NULL, ' +
    'PRIMARY KEY(`id`), ' +
    'FOREIGN KEY(`employee_id`) REFERENCES `Employee`(`id`) )' );

  //Menu Table Below
  db.run('DROP TABLE IF EXISTS Menu');
  db.run('CREATE TABLE `Menu` ( ' +
    '`id` INTEGER NOT NULL, ' +
    '`title` TEXT NOT NULL, ' +
    'PRIMARY KEY(`id`) )' );

//MenuItem Table Below
  db.run('DROP TABLE IF EXISTS MenuItem');
  db.run('CREATE TABLE `MenuItem` ( ' +
    '`id` INTEGER NOT NULL, ' +
    '`name` TEXT NOT NULL, ' +
    '`description` TEXT NOT NULL, ' +
    '`inventory` INTEGER NOT NULL, ' +
    '`price` INTEGER NOT NULL, ' +
    '`menu_id` INTEGER NOT NULL, ' +
    'PRIMARY KEY(`id`), ' +
    'FOREIGN KEY(`menu_id`) REFERENCES `Menu`(`id`) )' );



}); //End of serialize

module.exports = db;