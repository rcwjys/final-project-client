import pool from "../database/database.mjs";
import {
  getImage,
  sendToDashboard,
  sendToRoboflow,
} from "../service/roboflowService.mjs";

import fs from "fs";

const response = async () => {
  try {
    const imageData = await getImage();
    // const image = fs.readFileSync("20250316_151618.jpg");

    if (!imageData) {
      console.log("image not found");
      return;
    }

    const response = await sendToRoboflow(
      imageData.id_foto,
      imageData.nama_foto
      // fs.readFileSync("20250316_151618.jpg")
    );

    const data = {
      imageId: response.data.image_id,
      predictions: response.data.roboflow.predictions,
    };

    await sendToDashboard(data);
  } catch (err) {
    await pool.query("ROLLBACK");
    console.log("failed to send image to roboflow model: ", err.message);
    return;
  }
};

export default response;
