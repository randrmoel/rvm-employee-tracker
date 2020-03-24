use emps;

INSERT INTO department (name)
VALUES 
    ("Human Resources"), 
    ("Finance"),
    ("Marketing"),
    ("Sales"),
    ("Engineering"),
    ("IT");

INSERT INTO job_role (title, salary, department_id)
VALUES
    ("VP", 100000, 1), /*id 1*/
    ("Manager", 60000, 1), /*id 2*/
    ("Clerk", 25000, 1), /*id 3*/
    ("VP", 140000, 2), /*id 4*/
    ("Accountant", 45000, 2), /*id 5*/
    ("Marketing Analyst", 50000, 3), /*id 6*/
    ("DTD Sales Rep", 30000, 4), /*id 7*/
    ("Sr Engineer", 80000, 5), /*id 8*/
    ("Dev Ops Programmer", 65000, 6); /*id 9*/

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Peter", "Parker", 1, NULL), /*VP HR*/
    ("Alice", "Stevens", 2, 1), /*HR Manager */
    ("John", "Jacobs", 3, 2), /*HR Clerk*/
    ("Andrew", "Pangrass", 5, NULL),
    ("George", "Jetson", 9, NULL);