import "reflect-metadata";
import { container } from "tsyringe";

import { HttpServer } from "~/shared/infra/http/server";

async function bootstrap() {
  container.resolve(HttpServer).startServer();
}

void bootstrap();
