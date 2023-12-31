const inquirer = require("inquirer");
const db = require("../config/mysql");

// add new role
const addRole = (menu) => {
  // Fetch department names and IDs from the database
  db.query("SELECT id, name FROM departments", (departmentErr, results) => {
    if (departmentErr) {
      console.error("Error fetching departments:", departmentErr);
      return;
    }

    const departmentChoices = results.map((row) => ({
      name: row.name,
      value: row.id,
    }));

    inquirer
      .prompt([
        {
          type: "input",
          text: "Enter title of Role",
          name: "title",
        },
        {
          type: "input",
          text: "Enter salary of Role",
          name: "salary",
        },
        {
          type: "list",
          text: "Select department of the Role",
          name: "department",
          choices: departmentChoices,
        },
      ])

      .then((role) => {
        console.log(role);
        db.query(
          "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);",
          [role.title, role.salary, role.department],
          (roleErr, result) => {
            if (roleErr) {
              console.error("Error adding new role", roleErr);
            } else {
              console.log("SUCCESS! Role has been added to the database.");
            }
            menu();
          }
        );
      });
  });
};

//   view all roles
const viewRoles = (menu) => {
  const query =
    "SELECT roles.id, roles.title, roles.salary, departments.name AS department_name FROM roles JOIN departments ON roles.department_id = departments.id;";

  db.query(query, (viewRoleErr, roles) => {
    if (viewRoleErr) {
      console.error("There is a problem with the DB", viewRoleErr);
    } else {
      console.table(roles);
    }
    menu();
  });
};

module.exports = {
  addRole,
  viewRoles,
};
