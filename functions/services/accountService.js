const db = require('../startup/db');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const NotificationService = require("./notificationService");
const NotificationServiceInstance = new NotificationService();

class AccountService {

    async register(user){
        try{

            if(!user.email)
                return {status:"FAILED", message : "email is required"}
            
            if(!user.first_name || !user.last_name || !user.password || !user.dob)
                return {status:"FAILED", message : "first_name, last_name, password, dob are required"}

            let salt = await bcrypt.genSalt(12);
            let hashedPassword = await bcrypt.hash(user.password, salt); 

            const accounts = db.collection('accounts');

            //verify user exists
            const accountExist = await accounts.where('email', "==",user.email).get();

            if(!accountExist.empty)
                return {status:"FAILED", message : "user exist"};


            const account = {
                first_name : user.first_name,
                last_name: user.last_name,
                email : user.email,
                username : user.username,
                password: hashedPassword,
                dob : user.dob,
                gender : user.gender,
                emailVerified : false
            }


            var res =  await accounts.add(account)
            

            //send verification email
            NotificationServiceInstance.sendEmail(user.email,res.id);

            return {status: "SUCCESS", message : `Verification token has been sent to ${user.email}`}
            

        }catch(error){
            console.log(error);
        }
    }

    async login(login){

        const accounts = db.collection('accounts');

        // password provided
        if(!login.password)
            return {status:"FAILED", message : "invalid username or password"};

        console.log(login.username);

        const acc = accounts.where('email' , '==', login.username).limit(1);

        const data = await acc.get()

        let validUser = null;

        if(data.empty)
        {
            return {status:"FAILED", message : "user not found"}
        }
        else{
            data.forEach(account =>{
                console.log(account.data());
                validUser = account.data();
            })
        }

        if(!validUser.emailVerified)
            return {status:"FAILED", message : "kindly verify your email"};
        
        let validPassword = await bcrypt.compare(login.password,validUser.password);

        if(!validPassword) 
              return {status:false,message :'invalid username or passsword'};

        let token = this.generatetoken(validUser.first_name,validUser.email)

        const userDetail = {
            first_name : validUser.first_name,
            last_name : validUser.last_name,
            gender : validUser.gender,
            age : validUser.age,
            email : validUser.email,
            username : validUser.username,
        }

        return {status:"SUCCESS" , message :"Login Successful", data : token, user: userDetail }

    }

    async verifyEmail(verifyEmail){

        if(!verifyEmail.email)
            return {status : "FAILED" , message : "invalid email"};
        
        if(!verifyEmail.userId)
            return {status : "FAILED" , message : "invalid userid"};

        const accounts = db.collection('accounts');
        
        const documnent = accounts.doc(verifyEmail.userId);

        var res = await documnent.update({
            emailVerified : true
        });

        return {status : "SUCCESS", message : "Registration successful"};

        //const document
    }

    generatetoken(name,email){
        const token = jwt.sign({first_name:name, email : email},config.get('jwtPrivatekey'));
        return token;
    }
    
    validateAccounts(user) {
        const schema = Joi.object({
            email: Joi.string().min(5).max(255).required().email(),
            password: Joi.string().min(4).max(255).required(),
        })
    
        return schema.validate({});//Joi.valid(user, schema)
    }

}

module.exports = AccountService;