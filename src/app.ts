import "dotenv/config";
import { createConnection } from "typeorm";
import createServer from "./server";

const startServer = () => {
  const app = createServer();
  const port: number = parseInt(<string>process.env.PORT) || 4000;

  createConnection()
    .then(async (connection) => {
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      })
    })
    .catch((error) => console.log(error));
}

startServer();