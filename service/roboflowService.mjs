import axios from "axios";
import pool from "../database/database.mjs";
import BASE_URL from "../constant/constant.mjs";
import {
  bulkInsertToPhase,
  insertToPhase,
} from "../repository/roboflowRepository.mjs";

const getImage = async () => {
  try {
    const query = {
      name: "fetch-image",
      text: "SELECT id_foto, nama_foto FROM foto ORDER BY id_foto DESC LIMIT 1",
    };

    const results = await pool.query(query);

    if (results.rows.length !== 1) {
      return null;
    }

    return results.rows[0];
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

const sendToRoboflow = async (imageId, imageBuffer) => {
  try {
    const response = await axios({
      method: "POST",
      data: imageBuffer,
      url: BASE_URL,
      headers: {
        "Content-Type": "application/octet-stream",
        "X-Image-ID": imageId,
      },
    });

    return response.data;
  } catch (err) {
    console.log("failed to make request to /roboflow: ", err.message);
    throw err;
  }
};

const sendToDashboard = async (data) => {
  try {
    // Undetected
    if (data.predictions.length === 0) {
      // Create phase without detection
      await insertToPhase(["tidak memiliki fase", data.imageId, 1]);
    }

    const detectionsMap = new Map();

    // Distingusih duplicate detections
    data.predictions.forEach((detection) => {
      if (!detectionsMap.has(detection.class)) {
        detectionsMap.set(detection.class, true);
      }
    });

    const insertedValue = [];

    for (const [phase, _] of detectionsMap) {
      insertedValue.push({
        nama_fase: phase.toLowerCase(),
        id_foto: data.imageId,
        id_aksi: phase.toLowerCase() === "panen" ? 2 : 1,
      });
    }

    await bulkInsertToPhase(insertedValue);
  } catch (err) {
    throw err;
  }
};

export { getImage, sendToRoboflow, sendToDashboard };
