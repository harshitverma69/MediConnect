import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000

// Connect to Database and Cloudinary
const initializeConnections = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected successfully.");
    await connectCloudinary();
    console.log("Cloudinary connected successfully.");
  } catch (error) {
    console.error("Failed to initialize connections:", error);
    process.exit(1); // Exit process with failure code
  }
};

initializeConnections();

// middlewares
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173", // Allow requests from frontend
  credentials: true // If you're using cookies or authorization headers
}))

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))