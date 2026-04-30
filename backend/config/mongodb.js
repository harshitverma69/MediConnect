import mongoose from "mongoose";

const connectDB = async () => {

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not set in backend/.env")
    }

    mongoose.connection.on('connected', () => console.log("Database Connected"))
    await mongoose.connect(`${process.env.MONGODB_URI}`,{
        dbName : 'harshitproject',
        ssl: true, // Explicitly enable SSL
        tlsAllowInvalidCertificates: false // Default, but explicit
       })

}

export default connectDB;

// Do not use '@' symbol in your databse user's password else it will show an error.