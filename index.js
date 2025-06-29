import { configureExpress } from "./config/express";
import connectToDb from "./config/database";
import { server, app } from "./socket/socket.js";

configureExpress(app);
connectToDb();

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
