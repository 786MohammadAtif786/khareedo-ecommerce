const express = require("express");
const dotenv = require("dotenv");
const conectDB = require("./config/db")
const authRoutes = require('./routes/authRoutes');
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes")
const couponCode = require("./routes/couponRoutes")
const reviewProduct = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes")

const app = express();

app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/product', productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/coupon", couponCode);
app.use("/api/v1/review", reviewProduct);
app.use("/api/v1/admin", adminRoutes);

dotenv.config();
conectDB();


app.get("/", (req, res) => {
    res.json({msg: "Welcome TO Khareedo"})
})

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
console.error(err.stack);
res.status(500).json({ message: 'Server error' });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is listen ${process.env.PORT}`);
    
})