import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = 4000;

app.use(cors()); // 모든 브라우저 요청 허용

const KCISA_BASE = "https://api.kcisa.kr/openapi/API_CCA_149/request";
// const SERVICE_KEY = "e09f51aa-089a-46e3-a3be-19a365a723ce"; 내꺼
const SERVICE_KEY = "532faf93-e042-4158-840f-dd052fcdac0a";

app.get("/api/kcisa", async (req, res) => {
  try {
    const pageNo = req.query.pageNo || 1;
    const numOfRows = req.query.numOfRows || 20;

    const url = `${KCISA_BASE}?serviceKey=${SERVICE_KEY}&pageNo=${pageNo}&numOfRows=${numOfRows}&resultType=json`;
    console.log("👉 KCISA 요청 URL:", url);

    const response = await axios.get(url);
    console.log("👉 KCISA 응답:", response.data);

    res.json(response.data);
  } catch (err: any) {
    console.error("❌ KCISA API 에러:", err.response?.data || err.message);
    res.status(500).json({ error: "KCISA API 호출 실패" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
