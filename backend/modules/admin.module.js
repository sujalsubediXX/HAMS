import mongoose from "mongoose";
const adminSchema=mongoose.Schema({
    fullname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        unique:true,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:String,
        default:"Admin"
    }
},{
    timestamps:true
})
const Admin=mongoose.model("Admin",adminSchema);
export default Admin