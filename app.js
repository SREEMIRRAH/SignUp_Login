// SIGNUP, LOGIN, CHANGE PASSWORD, PAGINATION WITH SEARCH, SORT AND FILTER
const express =  require('express');
require('dotenv').config();
const router = require('./router/router');
const customError = require('./utils/customError')
const globalErrorHandler = require('./controller/errorController')
const app = express();
app.use(express.json());

app.use('/api/user',router);

app.all('*', (req, res,next) => {
    const err = new customError(`Not Found ${req.originalUrl}`,404);
    next(err)
})

app.use(globalErrorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});