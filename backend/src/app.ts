import express, { Request, Response, Application } from "express";
import cors from "cors";
import helmet from "helmet";

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Food Delivery API is alive!" });
});

// Mount module routes later:
// Example: app.use('/api/v1/auth', authRoutes);

// Add Error/Not Found Middleware later

export default app;
