import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import usersRouter from "./api/users/index.js";
import searchRouter from "./api/search/index.js";

const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(express.json());

server.use("/users", usersRouter);
server.use('/search', searchRouter)

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Connected to DB");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});
