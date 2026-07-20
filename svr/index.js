import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 9001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Phase 5에서 LLM 채점 프록시 엔드포인트(/api/feedback 등)를 추가한다.
// API 키는 이 서버(.env)에서만 사용하고 프론트엔드에 노출하지 않는다.

app.listen(PORT, "0.0.0.0", () => {
  console.log(`svr listening on 0.0.0.0:${PORT}`);
});
