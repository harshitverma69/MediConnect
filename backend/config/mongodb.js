import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {

    console.log("DEBUG: MONGODB_URI being used:", process.env.MONGODB_URI); // Temporary debug log
    mongoose.connection.on('connected', () => console.log("Database Connected"))
    await mongoose.connect(`${process.env.MONGODB_URI}`,{
        dbName : 'harshitproject',
        ssl: true, // Explicitly enable SSL
        tlsAllowInvalidCertificates: false, // Default, but explicit
        serverSelectionTimeoutMS: 30000, // Keep trying to send operations for 30 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        connectTimeoutMS: 30000 // Give up initial connection after 30 seconds
       })

}

export default connectDB;

// Do not use '@' symbol in your databse user's password else it will show an error.