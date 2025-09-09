import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {

    console.log("DEBUG: MONGODB_URI being used:", process.env.MONGODB_URI); // Temporary debug log
    mongoose.connection.on('connected', () => console.log("Database Connected"))
    await mongoose.connect(`${process.env.MONGODB_URI}`,{
        dbName : 'harshitproject',
        ssl: true, // Explicitly enable SSL
        tlsAllowInvalidCertificates: false // Default, but explicit
       })

}

export default connectDB;

// Do not use '@' symbol in your databse user's password else it will show an error.