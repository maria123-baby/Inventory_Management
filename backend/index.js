
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import express from "express";
import cors from 'cors';
import dashboardRoutes from "./routes/dashboardRoutes.js";
import productRoutes from "./routes/productRoutes.js";
const app = express();
dotenv.config();

app.use(cors({
  origin: 'http://localhost:5173', // allow your frontend
  credentials: true
}));
app.use(express.json());


app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/masters/products", productRoutes)


app.post("/api/auth/login", (req, res)=>{
    const data = req.body;
    console.log(data)
    res.status(200).json(data);
})
const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`);
});