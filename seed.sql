use emps;

INSERT INTO department (name)
VALUES 
    ("Human Resources"), /*1*/
    ("Finance"), /*2*/
    ("Marketing"), /*3*/
    ("Sales"), /*4*/
    ("Engineering"),/*5*/
    ("IT"), /*6*/
    ("Exec"), /*7*/
    ("Maintenance"); /*8 This department has no roles*/

INSERT INTO job_role (title, salary, department_id)
VALUES
    ("VP", 100000, 1), /*1 HR*/
    ("VP", 110000, 2), /*2 Fin*/
    ("VP", 120000, 3), /*3 Mktng*/
    ("VP", 120000, 6), /* 4 IT*/
    ("Manager", 60000, 1), /*5 HR*/
    ("Clerk", 25000, 1), /* 6 HR*/
    ("Clerk", 22000, 2), /*7 Fin*/
    ("Accountant", 45000, 2), /* 8 Finance*/
    ("Marketing Analyst", 50000, 3), /* 9 Marketing*/
    ("DTD Sales Rep", 30000, 4), /* 10 Sales*/
    ("Sr Engineer", 80000, 5), /* 11 Engineering*/
    ("Dev Ops Programmer", 65000, 6), /*12 IT*/
    ("President", 200000, 7), /*13 Exec*/ 
    ("Director", 85000, 4), /*14 Sales*/
    ("Auditor", 65000, 2); /*15 Finance -- No Employee Has this Role*/
    
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
/*first, last, role id, manager id*/
    ("Peter", "Parker", 1, 18), /*1 VP HR*/
    ("Alice", "Stevens", 5, 1), /*2 HR Manager */
    ("John", "Jacobs", 6, 4), /*3 HR Clerk*/
    ("Rosa", "Parker", 5, 1), /*4 HR Mgr */
    ("Glen","Pritchard", 2, 18), /*5 VP Fin*/
    ("Heddy", "Lamar", 8, 5), /*6 Acctnt*/
    ("Gina", "Michaels", 7, 5), /*7 Acct Clerk*/
    ("Ed", "Hamm", 7, 5), /*8 Acct Clerk*/
    ("John", "Albright", 4, 18), /*9 VP IT*/
    ("John", "Long", 12, 9), /*10 Dev Ops Prg*/
    ("Ken", "Moore", 12, 9), /*11 Dev Ops Prg*/
    ("Ed", "Hester", 11, 9), /*12 Sr Eng*/
    ("Elliot", "Nestor", 3, 18), /*13 VP Mkt*/
    ("Carla", "Hood", 9, 13), /*14 Mkt Anal*/
    ("Ned", "Howard", 14, 13), /*15 Dir Sales*/ 
    ("Howard", "Ninyo", 10, 13), /*16 DTD Sales*/
    ("Matt", "Gurney", 10, 13), /*17 DTD Sales*/
    ("Andy", "Manning", 13, NULL); /*18 President*/
