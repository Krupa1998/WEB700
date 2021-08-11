const Sequelize = require('sequelize');

var sequelize = new Sequelize('dr05cr8v452q', 'thyjvcqzacikdx', '989588587e4e02d86caefeb34059ddd2acf4b36f2a72770b53df4319b2ac6b09', {
    host: 'ec2-54-145-249-177.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }
});

//Defining "Employee" model
var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING
});

//Defining "Department" model
var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING,
});

//hasMany Relationship
Department.hasMany(Employee, { foreignKey: 'department' });

//initialize()
module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve("Operation was a success");
        }).catch(() => {
            reject("unable to sync the database");
        });
    });
}

//getEmployees()
module.exports.getEmployees = () => {
    return new Promise((resolve, reject) => {
        Employee.findAll().then(data => {
            data = data.map(x => x.dataValues);
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

//getEmployeesByDepartment(department)
module.exports.getEmployeesByDepartment = (dept) => {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                department: dept
            }
        }).then(data => {
            data = data.map(x => x.dataValues);
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

//getEmployeeByNum(num)
module.exports.getEmployeeByNum = (num) => {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                employeeNum: num
            }
        }).then(data => {
            data = data.map(x => x.dataValues);
            resolve(data[0]);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

//addEmployee(employeeData)
module.exports.addEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (const prop in employeeData) {
            if (employeeData[prop] == "") {
                employeeData[prop] = null;
            }
        }
        Employee.create(employeeData).then(() => {
            resolve("Employee created successfully");
        }).catch(() => {
            reject("unable to create employee");
        });
    });
}

//updateEmployee(employeeData)
module.exports.updateEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (const prop in employeeData) {
            if (employeeData[prop] == "") {
                employeeData[prop] = null;
            }
        }
        Employee.update(employeeData, {
            where: {
                employeeNum: employeeData.employeeNum
            }
        }).then(() => {
            resolve("Employee updated successfully");
        }).catch(() => {
            reject("unable to update employee");
        });
    });
}

//deleteEmployeeByNum(empNum)
module.exports.deleteEmployeeByNum = (empNum) => {
    return new Promise((resolve, reject) => {
        Employee.destroy({
            where: {
                employeeNum: empNum
            }
        }).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
}

//getDepartments()
module.exports.getDepartments = () => {
    return new Promise((resolve, reject) => {
        Department.findAll().then(data => {
            data = data.map(x => x.dataValues);
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

//getDepartmentById(id)
module.exports.getDepartmentById = (id) => {
    return new Promise((resolve, reject) => {
        Department.findAll({
            where: {
                departmentId: id
            }
        }).then(data => {
            data = data.map(x => x.dataValues);
            resolve(data[0]);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

//addDepartment(departmentData)
module.exports.addDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
        for (const prop in departmentData) {
            if (departmentData[prop] == "") {
                departmentData[prop] = null;
            }
        }
        Department.create(departmentData).then(() => {
            resolve("Department created successfully");
        }).catch(() => {
            reject("unable to create department");
        });
    });
}

//updateDepartment(departmentData)
module.exports.updateDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
        for (const prop in departmentData) {
            if (departmentData[prop] == "") {
                departmentData[prop] = null;
            }
        }
        Department.update(departmentData, {
            where: {
                departmentId: departmentData.departmentId
            }
        }).then(() => {
            resolve("Department updated successfully");
        }).catch(() => {
            reject("unable to update department");
        });
    });
}

//deleteDepartmentById(id)
module.exports.deleteDepartmentById = (id) => {
    return new Promise((resolve, reject) => {
        Department.destroy({
            where: {
                departmentId: id
            }
        }).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
}