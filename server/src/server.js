import app from "./app.js";
import { connectDB } from "./config/db.js";

async function startServer() {
    await connectDB();

    app.listen(3000, () => {
        console.log(`Server running on port 3000`);
    });
}

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});