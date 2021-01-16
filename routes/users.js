var express = require('express');
const { getToken } = require('../util');
const router = express.Router();
const User = require('../model/userModel')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const config = require('../config');

router.put('/:id', getToken, async (req, res) => {

    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (user) {

            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email,
                user.password = req.body.password || user.password
            const updatedUser = user.save()
            res.send({
                _id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                token: getToken(updatedUser)
            })

        }
        else {
            res.status(404).send({ message: "User Not found" })
        }
    }
    catch (e) {
        console.log(e.message)
        res.status(500).send("userId was not found")

    }
})
router.post('/signin', async (req, res) => {
    try {
        const signinUser = await User.findOne({ email: req.body.email })
        if (signinUser) {
            if (bcrypt.compare(req.body.password, signinUser.password)) {
                res.send({
                    _id: signinUser.id,
                    email: signinUser.email,
                    token: getToken(signinUser)
                })
            }
            else {
                res.json({ error: "Email or password isn't match!" })
            }


        }
        else {

            res.status(401).send({ message: "Email or password does not match!" })
        }
    } catch (e) {
        console.log(e.message)
        res.status(500).send("Server failed")
    }
})
router.post('/register', async (req, res) => {
    try {
        const hashedpassword = bcrypt.hashSync(req.body.password, 12)
        const user = await new User({
            _id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            password: hashedpassword
        })
        const newUser = await user.save()
        if (newUser) {
            res.send({
                name: newUser.name,
                email: newUser.email,
                token: getToken(newUser)

            })

        }
        else {
            res.status(401).send({ message: "Invalid user Data" })
        }
    } catch (e) {
        console.log(e.message)
        res.status(500).send("server error")
    }
})
router.get('/profile', async (req, res) => {
    try {

        const name = req.params.name;
        const user = User.findOne({
            name,
        })
        if (!user) {
            return res.status(404).json({
                error: "User Not Found"
            })

        }
        const recipe = await Recipe.find({ _id: user.createdRecipes })
        return res.status(201).json({
            user,
            recipe
        })


    }
    catch (err) {
        res.status(500).json({ error: "Error" })

    }

})
router.get('/forgetpassword', async (req, res) => {

    try {
        if (req.body.email === "") {


            return res.status(404).json({ Error: "Sorry ,Email not found" })
        }
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({ error: "Sorry ,Email does not exist" })
        }

        const token = Crypto.randomBytes(20).toString("hex")
        await User.updateOne({
            resetPassword: token,
            resetPasswordExpires: Date.now() + 3600000
        })
        const transporter = nodemailer.createTransport({
            service: "gmail",
            tls: { rejectUnauthorized: false },
            auth: {
                user: `${config.EMAIL_ADDRESS}`,
                pass: `${config.EMAIL_PASSWORD}`
            }
        })
        const mailOptions = {
            from: "recipe_app@gmail.com",
            to: `${user.email}`,
            subject: "Link to reset  password",
            text: " You are receiving this because you (or someone else) have requested thr reset of the password for your account .\n\n" +
                "please click on your browser to complete the process within one hour of receiving it:\n\n" +
                `http://localhost:3000/user/reset/${token}\n\n` +
                "If you did not requested this,please this emailand password will remain unchaged.\n"

        }

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                return res.status(500).json({ error: "error" })

            }
            return res.status(200).json({ message: "recovery email sent", response })
        })
    }
    catch (e) {
        return res.status(500).json({ error: "error" })


    }
})
router.get("/checkResetToken", async (req, res) => {

    try {
        const token = req.params.token;
        const user = await User.findOne({
            resetPasswordToken: token
        })
        if (!user) {
            return res.status(500).json({
                err: "Something went wrong"
            })
        }
        return res.status(200).json({
            token,
            userId: user_id,
        })

    }
    catch (e) {

        return res.status(500).json({ message: "Error" })


    }
})
router.get("/updatedPassword", async (req, res) => {
    try {
        const hashedpassword = await bcrypt.hash(req.body.password, 12)
        await User.findOneAndUpdate(
            { _id: req.body.userId },
            { password: hashedpassword },
            { upsert: true },
            function (err) {
                if (err) {

                    return res.status(500).json({ error: err })
                }
                return res.status(200).json({
                    message: "password updated"
                })
            }
        )


    }
    catch (e) {
        return res.status(500).json({ error: err })


    }


})
router.post('/getUsername',async(req,res)=>{
try{
const user= await User.findById({_id:req.body.userId})
if(!user){
    return res.status(404).json({
        error:"User not Found"
    })
}
return res.status(200).json({
    name:user.name
})


}
catch(error){
return res.status(500).json({error:err})


}

})
router.get('/checkUsername',async(req,res)=>{

    try{

        const user =await User.findById({_id:re.body.userId})
        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        return res.status(200).json({user:user.name,})

    }
    catch(e){
 return res.status(500).json({error:err})

    }
})
module.exports = router