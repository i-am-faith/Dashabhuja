import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    buyer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    address:{
        type: String,
        required: true
    }
}, {timestamps: true});
export default mongoose.model("Order", orderSchema)