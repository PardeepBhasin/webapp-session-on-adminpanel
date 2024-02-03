import mongoose from "mongoose";

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: String,
    email: {
        type: String,
        required: true
    },
    phoneNumber: String
});

const userModel = mongoose.models.User || mongoose.model("User", schema);

export default userModel;