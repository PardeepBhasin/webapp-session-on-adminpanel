import mongoose, { Connection } from 'mongoose';

if (!process.env.MONGO_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}
let connection: Connection | void;
async function connectToDatabase() {
    try {
        if (!connection) {
            connection = await mongoose.connect(process.env.MONGO_URI!).then(() => console.log("Database connected"))
        }
    } catch (error) {
        console.log(error);
    }
    return connection;
}

export default connectToDatabase;
