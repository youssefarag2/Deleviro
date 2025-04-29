import app from "./app";
import config from "./config";

const PORT = config.port;

app
  .listen(PORT, () => {
    console.log(`-------------------------------------------`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`-------------------------------------------`);
  })
  .on("error", (error) => {
    console.error("🔴 Server failed to start:", error);
    process.exit(1);
  });
