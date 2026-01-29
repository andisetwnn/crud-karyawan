const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);

sequelize.sync()
  .then(() => console.log('Database Connected'))
  .catch(err => console.error(err));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));