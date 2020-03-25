const mysql = require("mysql");
const inq = require("inquirer");
const Tble = require("cli-table");

var ch1; // List of Roles
var ch2; // List of Managers including None
var ch3; // List of Employees
var ch4; // List of Departments

const validStr = async (val) =>{
    if(val.length===0 ||  !/^[a-zA-Z -]+$/.test(val)){
        return "Not Valid String"
    }
    return true;
}

/* const validNum = async (val) =>{
    num = parseFloat(val);
    if(num.length===0 || !isNaN(num)){
        return "Not Valid Number";
    }
    return true;
} */

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

var t4 = new Tble({
    chars:tbleDeco,
    head:["Dept Name", "Total Salaries" ],
    colWidths:[25, 25]
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
    initChoice();
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
                val = val.toLowerCase()
                .split(" ")
                .map(word => {
                    return(word.charAt(0).toUpperCase() + word.slice(1));
                });
                return val.join(" ");
            }
        },
        {
            name: "lastName",
            message: "Enter Employee's Last Name",
            type: "input",
            filter: function(val){
                val = val.toLowerCase();
                val = val.slice(0,1).toUpperCase()+val.slice(1,val.length);
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
        roleID1 = ans.roleID.split(" ")[0];
        mgrID1 = ans.mgrID.split(" ")[0];
        if(mgrID1 == "None") mgrID1= null;
        conn.query("insert into employee (first_name, last_name, role_id, manager_id) values (?, ?, ?, ?)",
        [
            ans.firstName,
            ans.lastName, 
            roleID1,
            mgrID1
        ], (err, resp) =>{if (err) throw err;}
        );
        console.log("Added Employee");
        initChoice();
    }).catch(err=>{console.log(err)});

};

const viewEmp= () =>{
    console.log("View Employees")
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
        where last_name is not null 
         order by 
            last_name, first_name `, (err, res)=>{
        if(err) throw err;
        if(res == null){
            console.log("NO EMPLOYEES -- YIKES!");
            start();
        }
        else{
        t1.splice(0,t1.length); //empty table
        res.forEach(ele =>{
            t1.push([ele.first, ele.last, ele.title, ele.department]);
        });
        console.log(t1.toString());
        start();
    }
    });
};

const delEmp = () =>{
    console.log("Delete Employee");
    deQs = 
        {
            name: "empList",
            type: "list",
            message: "Select the employee you want to delete",
            choices: ch3
        };
    inq
    .prompt(deQs)
    .then(res=>{
        const empID = parseInt(res.empList.split(" ")[0]);
        if(isNaN(empID)) {start()}
        else{
        conn.query(`delete from employee where id=${empID}`, (err, resp) =>{if (err) throw err;})
        initChoice();
        }
    });
}

const addRole = () =>{
    console.log("Add Role");
    arQs = [{
        name: 'newTitle',
        message: "Add a New Role Title",
        type: "input",
        validate: validStr
    },
    {
        name: "newSalary",
        message: "Add the salary (one or more digits, a decimal and cents",
        type:  "number"
    },
    {
        name: "dept",
        message: "Select the Department",
        type: "list",
        choices: ch4
    }
]
    inq
    .prompt(arQs)
    .then(ans=>{
        let sal = !isNaN(parseFloat(ans.newSalary)) ? parseFloat(ans.newSalary) : 0;
        let deptID = ans.dept.slice(" ")[0].trim();
        conn.query('insert into job_role (title, salary, department_id) values (?, ?, ?)',
        [
            ans.newTitle,
            sal, 
            deptID
        ], (err, resp) =>{if (err) throw err;})
        initChoice()
    });
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
    inq
    .prompt({
        name:"whchRole",
        message: "Which Role Do you want to delete",
        type: "list",
        choices: ch1
    })
    .then(ans=>{
        let dRole = parseInt(ans.whchRole.split(" ")[0]);
        conn.query(`select id from employee where role_id = ${dRole}`,(err,resp)=>{
            if(err) throw err;
            if(resp.id != null){
                console.log("Can't Delete, role exists in emp records")
            } else {
                conn.query(`delete from job_role where id = ${dRole}`)

            }
            initChoice(); 
        });

    });
}

const addDept = () =>{
    console.log("Add Department");
    const dQs = {
        name : "newDpt",
        type : "input",
        message: "Enter a New Department",
        validate: validStr
    }
    inq
    .prompt(dQs)
    .then(ans => {
        conn.query("insert into department (name) values (?);", 
        [ans.newDpt],
        (err, resp)=>{
            if(err) throw err;
            initChoice();
        });
    });
}
const viewDepts = () =>{
    console.log("View Departments");
    conn.query(
        `select id, name from department`, (err, res)=>{
        if(err) throw err;
        t3.splice(0, t3.length); //clear table
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
    uerQs = [
        {
            name: "empList",
            type: "list",
            message: "Select the employee you want to change",
            choices: ch3
        },
        {
            name: "newRole",
            type: "list",
            message: "Select the new role",
            choices: ch1
        }
    ]
    inq
    .prompt(uerQs).then(ans=>{
        const empID = ans.empList.split(" ")[0];
        const roleID = ans.newRole.split(" ")[0]
        conn.query(`update employee set role_id =${roleID} where id =${empID}`, (err, resp)=> {if (err) throw err});
        initChoice();
    });
};

const viewEmpsByMgr  = () =>{
    console.log("View Employees by Manager");
    start();
}

const viewSalByDept  = () =>{
    console.log("View Salaries");
    conn.query(`select c.name as name, sum(r.salary) as tot_sal
    from employee l
    left join job_role r
    on l.role_id = r.id
    left join department c
    on r.department_id = c.id
    where c.name is not null 
    group by r.department_id
    having tot_sal is not null;`, 
    (err, res)=>{
        if(err) throw err;
        t4.splice(0,t4.length); //empty table
        res.forEach(ele =>{
            t4.push([ele.name, ele.tot_sal])
        });
        console.log(t4.toString());
        start();
    });

};

// Need so you can only add a valid role to an employee
function initChoice(){
    //console.log("Getting Roles");
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
        });

        //console.log("Getting Managers");
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
         });

        //console.log("Getting Employees");
        conn.query(`select
                         l.id, l.first_name, l.last_name, r.title, r.id as job_id 
                    from 
                        employee l
                    left join
                        job_role r
                    on l.role_id = r.id`
                    , (err, resp)=>{
             if(err) throw err;
             ch3 = resp.map(ele => [ele.id,  ele.first_name, ele.last_name, ele.title, ele.job_id].join(" "));
             ch3.push("None");
            });
        //console.log("Getting Departments");
        conn.query(`select id, name from department`
        , (err, resp)=>{
            if(err) throw err;
            ch4 = resp.map(ele => [ele.id, ele.name].join(" "));
            start();
        });
};