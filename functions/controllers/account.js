
const AccountService = require("../services/accountService");
const AccountServiceInstance = new AccountService();

exports.Login = async (req, res,next) =>{

   var accountService =  await AccountServiceInstance.login(req.body);
    res.json(accountService);
}

exports.Registration = async (req, res,next) =>{

    var accountService =  await AccountServiceInstance.register(req.body);
     res.json(accountService);
 }

 exports.VerifyEmail = async (req, res,next) =>{

    var accountService =  await AccountServiceInstance.verifyEmail(req.body);
     res.json(accountService);
 }

 