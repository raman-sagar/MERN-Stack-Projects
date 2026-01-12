import express from "express";
import myRoutes from "./routes/routes.mjs";
import router from "./routes/user_routes.mjs";
import { auth, limiter } from "./middleware/auth.mjs";
import { mongoDB } from "./config/database.mjs";
import cors from "cors";
import path from "path";
import helmet from "helmet";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static("public"));
app.use("/public", express.static(path.join(import.meta.dirname, "public")));
mongoDB();

app.use(cors());
//Routes
//app.use(helmet()); Don't use on local system
app.use(limiter);
app.use("/api/users", router);
app.use(auth);
app.use("/api/students", myRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
