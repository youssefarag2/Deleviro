import express, { Request, Response, Application } from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes";
import restaurantsRoutes from "./modules/restaurants/restaurants.routes";
import { errorHandler } from "./middleware/error.handler";

// Import error handlers later

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Food Delivery API is alive!" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/restaurants", restaurantsRoutes);

app.use(errorHandler);

// Mount module routes later:
// Example: app.use('/api/v1/auth', authRoutes);

// Add Error/Not Found Middleware later

export default app;
