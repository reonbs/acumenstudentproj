
const bodyParser = require('body-parser');
const courseRoutes = require('../routes/course');
const accountRoutes = require('../routes/account');
const error = require('../middleware/error');

module.exports = function (app){

app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/api/course', courseRoutes);
app.use('/api/account', accountRoutes);

app.use(error);

}