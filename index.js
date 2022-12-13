import * as dotenv from 'dotenv';
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CONNECTION_URL = process.env.CONNECTION_URL;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true })
  .then(() => app.listen(PORT, () => console.log(`Server is running on ${PORT}`)))
  .catch((error) => console.log(error));
        
app.get('/', (req, res) => {
   res.send('Hello This is memories app');
})
  
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
  
app.use("/posts", postRoutes);
app.use("/user", userRoutes);
