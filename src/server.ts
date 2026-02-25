import http from "http";
import { config } from "./config/env";
import createApp from "./app";
import { logger } from "./shared/logger/logger";

function main() {
  try {
    const port = +(config.app.port ?? 8080);
    const server = http.createServer(createApp());
    server.listen(port, () => {
      logger.info(`Server is listening on port ${port}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
  }
}

main();
