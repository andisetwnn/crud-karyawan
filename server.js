const express = require('express');
const { sequelize } = require('./models');
const app = express();

app.use(express.json());

sequelize.sync({ alter: true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.error('Connection error:', err));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));