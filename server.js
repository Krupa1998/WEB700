/*********************************************************************************
* WEB700 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Krupa Kirtikumar Shah   Student ID: 131273203   Date: 09/04/2021
*
* Online (Heroku) Link: https://tranquil-gorge-80421.herokuapp.com/
*
********************************************************************************/


const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
let serverData = require('./modules/serverDataModule.js');

//middleware function to fix the Navigation Bar to Show the correct "active" item
app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

//static middleware
app.use(express.static("public"));

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

//add template engine (express-handlebars)
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));

app.set('view engine', '.hbs');

//GET /employees
app.get("/employees", (req, res) => {
    if (req.query.department) {
        serverData.getEmployeesByDepartment(req.query.department).then((data) => {
            if (data.length > 0) {
                res.render("employees", { employees: data });
            } else {
                res.render("employees", { message: "no results" });
            }
        }).catch((err) => {
            res.render(err.message);
        });
    } else {
        serverData.getEmployees().then((data) => {
            if (data.length > 0) {
                res.render("employees", { employees: data });
            } else {
                res.render("employees", { message: "no results" });
            }
        }).catch((err) => {
            res.render(err.message);
        });
    }
});

// GET /employee/:num
app.get("/employee/:num", (req, res) => {
    let viewData = {};
    serverData.getEmployeeByNum(req.params.num).then((data) => {
        if (data) {
            viewData.employee = data;
        } else {
            viewData.employee = null;
        }
    }).catch(() => {
        viewData.employee = null;
    }).then(serverData.getDepartments).then((data) => {
        viewData.departments = data;
        for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.employee.department) {
                viewData.departments[i].selected = true;
            }
        }
    }).catch(() => {
        viewData.departments = [];
    }).then(() => {
        if (viewData.employee == null) {
            res.status(404).send("Employee Not Found");
        } else {
            res.render("employee", { viewData: viewData });
        }
    })
});

//GET /departments
app.get("/departments", (req, res) => {
    serverData.getDepartments().then((data) => {
        if (data.length > 0) {
            res.render("departments", { departments: data });
        } else {
            res.render("departments", { message: "no results" });
        }
    }).catch(() => {
        res.render(err.message);
    });
});

// GET /department/:id
app.get("/department/:id", (req, res) => {
    serverData.getDepartmentById(req.params.id).then((data) => {
        if (data != null) {
            res.render("department", { department: data });
        } else {
            res.status(404).send("Department Not Found");
        }
    });
});

//GET /
app.get("/", (req, res) => {
    res.render("home");
});

//GET /about
app.get("/about", (req, res) => {
    res.render("about");
});

//GET /htmlDemo
app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo");
});

//GET /employees/add
app.get("/employees/add", (req, res) => {
    serverData.getDepartments().then((data) => {
        res.render("addEmployee", { departments: data });
    }).catch(() => {
        res.render("addEmployee", { departments: [] });
    });
});

//POST /employees/add
app.post("/employees/add", (req, res) => {
    serverData.addEmployee(req.body).then((data) => {
        res.redirect("/employees");
    }).catch(() => {
        res.status(500).send("Unable to Add Employee");
    });
});

//POST /employee/update
app.post("/employee/update", (req, res) => {
    serverData.updateEmployee(req.body).then(() => {
        res.redirect("/employees");
    }).catch(() => {
        res.status(500).send("Unable to Update Employee");
    });
});

//GET /employees/delete/:empNum
app.get("/employees/delete/:empNum", (req, res) => {
    serverData.deleteEmployeeByNum(req.params.empNum).then(() => {
        res.redirect("/employees");
    }).catch(() => {
        res.status(500).send("Unable to Remove Employee / Employee not found");
    });
});

//GET /departments/add
app.get("/departments/add", (req, res) => {
    res.render("addDepartment");
});

//POST /departments/add
app.post("/departments/add", (req, res) => {
    serverData.addDepartment(req.body).then((data) => {
        res.redirect("/departments");
    }).catch(() => {
        res.status(500).send("Unable to Add Department");
    });
});

//POST /department/update
app.post("/department/update", (req, res) => {
    serverData.updateDepartment(req.body).then(() => {
        res.redirect("/departments");
    }).catch(() => {
        res.status(500).send("Unable to Update Department");
    });
});

//GET /departments/delete/:id
app.get("/departments/delete/:id", (req, res) => {
    serverData.deleteDepartmentById(req.params.id).then(() => {
        res.redirect("/departments");
    }).catch(() => {
        res.status(500).send("Unable to Remove Department / Department not found");
    });
});

// no matching route
app.use((req, res, next) => {
    res.status(404).send("Page Not Found");
});


// setup http server to listen on HTTP_PORT
serverData.initialize().then(() => {
    app.listen(HTTP_PORT, () => { console.log("server listening on port: " + HTTP_PORT) });
}).catch((err) => {
    console.log(err.message);
});