import * as express from "express";
import { AppDataSource } from "./data-source";
import router from "./routes/api";
import * as cors from "cors";
import cloudinary from "./libs/cloudinary";
import "dotenv/config";
// import { redisClient } from "./libs/redis";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    // redisClient.on("error", (error) => {
    //   console.log(error);
    // });
    app.use(cors());
    app.use(express.json());
    app.use("/api/v1", router);

    cloudinary.config();
    app.listen(process.env.PORT, async () => {
      // await redisClient.connect();
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
