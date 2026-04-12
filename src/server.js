import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import orderRoutes from "./routes/order.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import staffRoutes from "./routes/staff.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";

dotenv.config({});
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors(
    { origin: "*" } // Adjust this as needed for security
  )
);
app.use(morgan("dev"));
app.use(helmet());


app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "All systems operational",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/authRoutes", authRoutes);
app.use("/api/order", orderRoutes);
app.use(errorHandler);
app.use("/api/menu", menuRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/attendance", attendanceRoutes);



connectDB(); // comment this if you don't want to connect to DB

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
