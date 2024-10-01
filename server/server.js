const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

const contactRoute = require("./routes/contactRoute");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
const paymentRoute = require("./routes/paymentRoute");
const subscriptionRoute = require("./routes/subscriptionRoute");
const brandRoute = require("./routes/brandRoute");
const searchRoute = require("./routes/searchRoute");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "1000mb", extended: true }));
app.use("/images", express.static(path.join(__dirname, "/images")));

// Session handling
app.use(
  session({
    secret: "This will be secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://anxdidani:dominusoft@cluster0.oxrc6.mongodb.net/Final?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("Something went wrong", err));

// API Routes
app.use("/api/contacts", contactRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/subscriptions", subscriptionRoute);
app.use("/api/brands", brandRoute);
app.use('/api/search', searchRoute);

// Serve static files from the React app (if in production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  // Fallback to index.html for client-side routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// Simple route for testing server
app.get("/message", (req, res) => {
  res.send("<h1>Hello Node!</h1>");
});

// 404 Error handling for undefined routes (returns JSON)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware (returns JSON)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
