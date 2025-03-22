import pool from "../database/database.mjs";

const insertToPhase = async (values) => {
  try {
    const noPredictionQuery = {
      text: "INSERT INTO fase(nama_fase, id_foto, id_aksi) VALUES ($1, $2, $3)",
      values,
    };

    await pool.query(noPredictionQuery);
  } catch (err) {
    throw err;
  }
};

const bulkInsertToPhase = async (insertedValue) => {
  try {
    await pool.query("BEGIN");

    const query = `
      INSERT INTO fase(nama_fase, id_foto, id_aksi)
      VALUES ${insertedValue
        .map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
        .join(", ")}
    `;

    const value = insertedValue.flatMap((item) => [
      item.nama_fase,
      item.id_foto,
      item.id_aksi,
    ]);

    await pool.query(query, value);

    await pool.query("COMMIT");
  } catch (err) {
    await pool.query("ROLLBACK");
    throw err;
  }
};

export { insertToPhase, bulkInsertToPhase };
