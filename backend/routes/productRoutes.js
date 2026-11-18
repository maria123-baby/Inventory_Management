
import express from "express";
import {getProducts, createProduct} from "../controllers/ProductController.js"
import {authMiddleware} from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/",authMiddleware, createProduct);
router.get("/",authMiddleware,  getProducts);

export default router;
