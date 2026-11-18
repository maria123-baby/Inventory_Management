const validateProduct = (req, res, next)=>{
    const {productCode, productName} = req.body;

    if(!productCode || !productName){
        return res.status(400).json({
            success: false,
            message: "Product code and product name are required"
        });
    }
    next();
}