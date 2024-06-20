const express = require('express');
const app = express();
app.use(express.json());

app.use('/api/auth', require('./routes/API/auth'));
app.use('/api/posts', require('./routes/API/posts'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})

module.exports = app;