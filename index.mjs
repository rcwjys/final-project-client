import response from "./usecase/request.mjs";
import "dotenv/config";

const start = async () => {
  await response();
};

start();
