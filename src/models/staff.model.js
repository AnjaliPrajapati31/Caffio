import mongoose from "mongoose";

const staffSchema =mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role: {
        type: String,
        default: "staff"
    },
    assignedOrders:[
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Order"
        }
    
    ],
    personalDetails: {
        phoneNumber: String,
        joinDate: Date,
        shift: String
    },
})

const Staff = mongoose.model("Staff",staffSchema);

export default Staff;