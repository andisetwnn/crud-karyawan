const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

const Employee = sequelize.define('Employee', {
  name: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING(100), 
    allowNull: false, 
    unique: true,
    validate: { isEmail: true }
  },
  position: { type: DataTypes.STRING(100) },
  salary: { 
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0.01 
    }
  }
});

const Department = sequelize.define('Department', {
  name: { type: DataTypes.STRING(50), allowNull: false }
});

const EmployeeDepartment = sequelize.define('EmployeeDepartment', {
  assignedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

Employee.belongsToMany(Department, { through: EmployeeDepartment });
Department.belongsToMany(Employee, { through: EmployeeDepartment });

module.exports = { sequelize, Employee, Department, EmployeeDepartment };