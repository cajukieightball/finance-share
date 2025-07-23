require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json(), cookieParser(), cors({ origin: true, credentials: true }));

app.get('/', (req, res) => res.send('API is running'));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
