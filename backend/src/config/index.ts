import "./enviroment";

const config = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL || "",
  jwt: {
    secret: process.env.JWT_SECRET || "default_jwt_secret", // Fallback only for emergencies
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  },
};

export default config;
