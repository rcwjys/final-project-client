import response from "./usecase/request.mjs";
import "dotenv/config";

(async () => {
  await response();
})();
