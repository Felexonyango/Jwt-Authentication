const mongoose=require('mongoose')
var Schema = mongoose.Schema;
const userSchema =new Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    emailConfirmation:{
        type:Boolean,
        default:false

    },
    password:{
        type:String,
        required:true
    },
    resetpasswordToken:{
        type:String,
        required:false

    },
    resetPasswordExpires:{
    type:String,
    required:false

    },
    createdRecipes:[
        {
            type:Schema.Types.ObjectId,
            ref:"Recipe"
        }
    ],

    date:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model("Users", userSchema)