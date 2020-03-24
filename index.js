const mysql = require("mysql");
const inq = require("inquirer");
const Tble = require("cli-table");

var ch1;
var ch2;
var ch3;
var funcPath = false;

const validStr = async (val) =>{
    if(val.length===0 ||  !/^[a-zA-Z]+$/.test(val)){
        return "Not Valid String"
    }
    return true;
}

var tbleDeco = {
    'top': '═',
    'top-mid': '╤' ,
    'top-left': '╔',
    'top-right': '╗',
    'bottom': '═' ,
    'bottom-mid': '╧' ,
    'bottom-left': '╚',
    'bottom-right': '╝',
    'left': '║',
    'left-mid': '╟',
    'mid': '─' ,
    'mid-mid': '┼',
    'right': '║' ,
    'right-mid': '╢',
    'middle': '│' 
}

var t1 = new Tble({
    chars: tbleDeco,
    head: ["First Name", "Last Name", "Title", "Department"],
    colWidths: [15, 15, 20, 20]
});

var t2 = new Tble({
    chars: tbleDeco,
    head: ["ID", "Title", "Salary", "Department ID"],
    colWidths: [4, 20, 10, 20]
}); 

var t3 = new Tble({
    chars: tbleDeco,
    head:["ID", "Dept Name"],
    colWidths:[4, 25]
});

var conn = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Emerald1",
    database: "emps"
});

conn.connect(err =>{
    if(err) throw err;
    console.log("Connection Established to data")
    //Initialize Roles List and Manager's list
    getRoles();
});

const startQ =   {
    name: "choice1",
    type: "list",
    message : "Choose Task",
    choices: [
        "Add Employee", 
        "View Employees", 
        "Delete Employee", 
        "Add Role", 
        "View Roles", 
        "Delete Role", 
        "Add Department", 
        "View Departments", 
        "Delete Departments", 
        "Update Employee Roles", 
        "View Employees By Manager", 
        "View Salaries By Department",
        "Exit"
    ]
};

const start= () =>{
    inq.prompt(startQ).then((ans)=>{
        switch(ans.choice1){
            case "Add Employee":
                addEmp();
                break; 
            case "View Employees":
                viewEmp();
                break; 
            case "Delete Employee":
                delEmp();
                break; 
            case "Add Role":
                addRole();
                break; 
            case "View Roles":
                viewRoles();
                break; 
            case "Delete Role":
                delRole();
                break; 
            case "Add Department":
                addDept();
                break; 
            case "View Departments":
                viewDepts();
                break; 
            case "Delete Departments":
                delDept();
                break; 
            case "Update Employee Roles":
                updteEmpRoles();
                break; 
            case "View Employees By Manager":
                viewEmpsByMgr();
                break; 
            case "View Salaries By Department":
                viewSalByDept();
                break;
            case "Exit":
                console.log("Exiting Connection");
                conn.end();
                break;
            default:
                console.log("Error");
                break;
        }
    });
};

function addEmp(){
    const empQ = [
        {
            name: "firstName",
            message: "Enter Employee's First Name",
            type: "input",
            validate: validStr,
            filter: function(val){
                val = val.toLowerCase();
                val = val.slice(0,1).toUpperCase()+val.slice(1,val.length);
                return val}
        },
        {
            name: "lastName",
            message: "Enter Employee's Last Name",
            type: "input",
            filter: function(val){
                val = val.toLowerCase();
                val = val.slice(0,0).toUpperCase()+val.slice(1,val.length);
                return val}
        },
        {
            name: "roleID",
            message: "Enter Employee's Role ID",
            type: "list",
            choices: ch1
        },
        {
            name: "mgrID",
            message: "Enter Manager ID",
            type: "list",
            choices: ch2
        }
    ];
    inq.prompt(empQ).then(ans =>{
        console.log(ans);
        roleID1 = ans.roleID.split(" ")[0];
        mgrID1 = ans.mgrID.split(" ")[0];
        if(mgrID1 == "None") mgrID1= null;
        conn.query("insert into employee (first_name, last_name, role_id, manager_id) values (?, ?, ?, ?)",
        [
            ans.firstName,
            ans.lastName, 
            roleID1,
            mgrID1
        ]
        );
        console.log("Added Employee");
        start();
    }).catch(err=>{console.log(err)});

};

const viewEmp= () =>{
    console.log("Viewed Employee")
    conn.query(
        `select l.last_name as last, l.first_name as first, r1.title as title, r2.name as department 
        from employee l
        left join 
            job_role r1
        on 
            l.role_id = r1.id
        left join 
            department r2 
        on r2.id = r1.department_id 
         order by 
            last_name, first_name `, (err, res)=>{
        if(err) throw err;
        t1.splice(0,t1.length);
        res.forEach(ele =>{
            t1.push([ele.first, ele.last, ele.title, ele.department])
        })
        console.log(t1.toString());
        start();
    })
};

const delEmp = () =>{
    console.log("Deleted Employee");
    start();
}

const addRole = () =>{
    console.log("Add Role");
    start();
};

const viewRoles = () =>{
    console.log("View Roles");
    conn.query(
        `select id, title, salary, department_id from job_role`, (err, res)=>{
        if(err) throw err;
        t2.splice(0, t2.length);
        res.forEach(ele =>{
            t2.push([ele.id, ele.title, ele.salary, ele.department_id]);
        });
        console.log(t2.toString());
        start();
    });

};

const delRole = () =>{
    console.log("Delete Role");
    start();
}

const addDept = () =>{
    console.log("Add Department");
    start();

}
const viewDepts = () =>{
    console.log("View Departments");
    conn.query(
        `select id, name from departments`, (err, res)=>{
        if(err) throw err;
        t3.splice(0, t3.length);
        res.forEach(ele =>{
            t3.push([ele.id, ele.name]);
        });
        console.log(t3.toString());
        start();
    });
};

const delDept  = () =>{
    console.log("Delete Departments");
    start();
}

const updteEmpRoles  = () =>{
    console.log("Update Employee Roles");
    start();
}

const viewEmpsByMgr  = () =>{
    console.log("View Employees by Manager");
    start();
}

const viewSalByDept  = () =>{
    console.log("View Salaries");
    start();
};

// Need so you can only add a valid role to an employee
function getRoles(){
    console.log("Getting Roles");
    conn.query(`select
                     l.id, l.title, r.name 
                from 
                    job_role l
                left join
                    department r
                on
                    l.department_id = r.id`, (err, resp)=>{
        if(err) throw err;
        ch1 = resp.map(ele => [ele.id,  ele.title, ele.name].join(" "));
        console.log(ch1);
        if(!funcPath) getMgrs()
        else start();
        });
};

function getMgrs(){
    console.log("Getting Managers");
    conn.query(`select
                     l.id, l.first_name, l.last_name, r.title, m.name as dept
                from
                    employee l
                left join
                    job_role r
                on
                    l.role_id = r.id
                left join
                    department m
                on
                    r.department_id = m.id 
                where
                    r.title in ("VP", "Director", "Manager")
    `, (err, resp)=>{
        if(err) throw err;
        ch2 = resp.map(ele => [ele.id, ele.first_name, ele.last_name, ele.title, ele.dept].join(" "));
        ch2.push("None")
        console.log(ch2);
        start();
    })
}

function getEmps(){
    console.log("Getting Employees");
    conn.query(`select
                     l.id, l.first_name, l.last_name, r.title 
                from 
                    job_role l
                left join
                    job_role r
                on
                    l.role_id = r.id`, (err, resp)=>{
        if(err) throw err;
        ch3 = resp.map(ele => [ele.id,  ele.title, ele.name].join(" "));
        console.log(ch1);
        getRoles();
        });
};
