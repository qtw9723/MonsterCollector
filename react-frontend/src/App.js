import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import "./style/App.css";
import NavBar from "./components/NavBar";
import MonsterBook from "./components/MonsterBook";
import MaterialsPage from "./components/MaterialPage";
import DungeonPage from "./components/DungeonPage";

function App() {
  const [gold, setGold] = useState(() => {
    // localStorage에서 초기값 불러오기, 없으면 0
    const saved = localStorage.getItem("gold");
    return saved ? parseInt(saved, 10) : 0;
  });

  // gold가 바뀔 때 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("gold", gold);
  }, [gold]);

  useEffect(() => {
    const interval = setInterval(() => {
      // localStorage에서 던전 배치 불러오기
      const dungeon = JSON.parse(localStorage.getItem("dungeonMonsters") || "[]");
      if (dungeon.length === 0) return;
  
      const totalPower = dungeon.reduce((sum, m) => sum + m.power, 0);
      const collected = Math.floor(totalPower * (0.8 + Math.random() * 0.4));
  
      setGold(prev => prev + collected);
    }, 5000);
  
    return () => clearInterval(interval);
  }, [setGold]);

  return (
    <Router>
      <NavBar gold={gold} />

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<GuessGame />} />
          <Route path="/monsters" element={<MonsterBook />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/DungeonPage" element={<DungeonPage gold={gold} setGold={setGold} />} />
        </Routes>
      </div>
    </Router>
  );
}



/* ---------------------------------------------------------------- */
/* 홈 화면 */
/* ---------------------------------------------------------------- */
function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
      <h1>🎮 몬스터 뽑기 게임</h1>

      <p style={{ fontSize: "18px", lineHeight: "1.5" }}>
        숫자를 맞추면 몬스터를 획득하는 간단한 미니게임입니다! <br></br>
        빨리 숫자를 맞추면 높은 등급 몬스터 등장 확률이 올라갑니다.
      </p>

      <h3>📘 게임 방법</h3>
      <ul style={{ textAlign: "left", fontSize: "16px", lineHeight: "1.6" }}>
        <li>1~100 사이의 숫자를 추측합니다.</li>
        <li>너무 높거나 낮다는 힌트를 봐가며 맞춥니다.</li>
        <li>정답을 맞추면 몬스터를 1마리 획득합니다!</li>
        <li>시도 횟수가 적을수록 높은 등급 등장 확률 상승!</li>
      </ul>

      <h3>⭐ 몬스터 등급</h3>
      <p>NORMAL → RARE → EPIC → LEGENDARY 순으로 희귀도가 증가합니다.</p>

      <button
        onClick={() => navigate("/game")}
        style={{ padding: "10px 20px", marginTop: "20px", fontSize: "18px" }}
      >
        ▶ 게임 시작하기
      </button>
    </div>
  );
} //Home

/* ---------------------------------------------------------------- */
/* 숫자 맞추기 게임 */
/* ---------------------------------------------------------------- */

function GuessGame() {
  const navigate = useNavigate();
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0); // 시도 횟수
  const [rates, setRates] = useState({}); // 서버 확률

  /* -------------------- 현재 확률 서버에서 받아오기 -------------------- */
  useEffect(() => {
    axios
      .get(
        // `https://monstercollector-production.up.railway.app/rate?tryCount=${attempts}`
        `http://192.168.2.50:8080/rate?tryCount=${attempts}`
      )
      .then((res) => setRates(res.data))
      .catch((err) => console.error("❌ 확률 조회 실패:", err));
  }, [attempts]);

  /* -------------------- 몬스터 localStorage 저장 -------------------- */
  const saveMonsterLocal = (monster) => {
    let monsters = localStorage.getItem("myMonsters");
    monsters = monsters ? JSON.parse(monsters) : [];

    monsters.push({ ...monster, id: Date.now() + Math.random() });

    localStorage.setItem("myMonsters", JSON.stringify(monsters));
  };

  /* -------------------- 숫자 맞추기 요청 -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ⚠ attempts 비동기 → 함수형 업데이트 사용
    setAttempts((prev) => prev + 1);

    try {
      const response = await axios.get(
        `https://monstercollector-production.up.railway.app/guess?number=${number}`
      );

      const result = response.data;
      setMessage(result.message);

      // ❌ 틀렸을 때 input 흔들기
      if (result.message.includes("너무")) {
        const inputEl = document.querySelector("input[type='number']");
        inputEl.classList.add("shake");
        setTimeout(() => inputEl.classList.remove("shake"), 300);
      }

      // 🎉 몬스터 획득 시
      if (result.monster) {
        saveMonsterLocal(result.monster);

        const popup = document.createElement("div");
        popup.className = "popup";
        popup.innerText = `🎉 ${result.monster.name} (${result.monster.grade}) 획득!`;
        document.body.appendChild(popup);

        setTimeout(() => document.body.removeChild(popup), 1500);
        setTimeout(() => navigate("/monsters"), 1000);
      }
    } catch (err) {
      console.error("❌ 요청 실패:", err);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>숫자 맞추기</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          min="1"
          max="100"
          placeholder="1~100"
        />
        <button type="submit">추측하기</button>
      </form>

      <p>{message}</p>
      <p>시도 횟수: {attempts}</p>

      {/* ----------- 확률 표시 UI ----------- */}
      <div>
        <h3>📊 현재 확률</h3>
        <p>Normal: {rates.NORMAL?.toFixed(2)}%</p>
        <p>Rare: {rates.RARE?.toFixed(2)}%</p>
        <p>Epic: {rates.EPIC?.toFixed(2)}%</p>
        <p>Legendary: {rates.LEGENDARY?.toFixed(2)}%</p>
      </div>
    </div>
  );
} //GuessGame


export default App;
