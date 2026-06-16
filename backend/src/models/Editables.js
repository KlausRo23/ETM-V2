import mongoose from "mongoose";

const editablesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {timestamps: true})

const Editables = mongoose.model("Editables", editablesSchema)

export default Editables