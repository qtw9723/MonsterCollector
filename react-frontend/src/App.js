import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./App.css";

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">홈</Link></li>
          <li><Link to="/game">숫자 맞추기</Link></li>
          <li><Link to="/monsters">내 몬스터</Link></li>
        </ul>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<GuessGame />} />
          <Route path="/monsters" element={<MonsterBook />} />
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
        숫자를 맞추면 몬스터를 획득하는 간단한 미니게임입니다!  <br></br>
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
}//Home

/* ---------------------------------------------------------------- */
/* 숫자 맞추기 게임 */
/* ---------------------------------------------------------------- */
function GuessGame() {
  const navigate = useNavigate();
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [rates, setRates] = useState({});

  // 🔥 서버에서 확률 가져오기
  useEffect(() => {
    axios.get("https://monstercollector-production.up.railway.app/rate")
      .then(res => setRates(res.data))
      .catch(err => console.error(err));
  }, [attempts]);

  // 🔥 localStorage 에 몬스터 저장
  const saveMonsterLocal = (monster) => {
    let monsters = localStorage.getItem("myMonsters");
    monsters = monsters ? JSON.parse(monsters) : [];
    monsters.push(monster);
    localStorage.setItem("myMonsters", JSON.stringify(monsters));
  };

  // 🔥 서버로 숫자 맞추기 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttempts(attempts + 1);

    try {
      const response = await axios.get(
        `https://monstercollector-production.up.railway.app/guess?number=${number}`
      );

      const result = response.data;
      setMessage(result.message);

      // 틀렸을 때 input 흔들기
      if (result.message.includes("너무")) {
        const inputEl = document.querySelector("input[type='number']");
        inputEl.classList.add("shake");
        setTimeout(() => inputEl.classList.remove("shake"), 300);
      }

      // 🔥 몬스터 획득 시 localStorage에 저장
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
      console.error("요청 실패", err);
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

      {/* 확률 UI */}
      <div>
        <h3>📊 현재 확률</h3>
        <p>Normal: {rates.NORMAL?.toFixed(1)}%</p>
        <p>Rare: {rates.RARE?.toFixed(1)}%</p>
        <p>Epic: {rates.EPIC?.toFixed(1)}%</p>
        <p>Legendary: {rates.LEGENDARY?.toFixed(1)}%</p>
      </div>
    </div>
  );
}//GuessGame

/* ---------------------------------------------------------------- */
/* 몬스터 도감 (localStorage 기반) */
/* ---------------------------------------------------------------- */
function MonsterBook() {
  const [monsters, setMonsters] = useState([]);
  const [sortType, setSortType] = useState("recent");

  useEffect(() => {
    const saved = localStorage.getItem("myMonsters");
    const list = saved ? JSON.parse(saved) : [];
    setMonsters(list);
  }, []);

  // 등급 우선순위 지정
  const gradeOrder = { LEGENDARY: 4, EPIC: 3, RARE: 2, NORMAL: 1 };

  const sortMonsters = (list) => {
    switch (sortType) {
      case "grade":
        return [...list].sort(
          (a, b) => gradeOrder[b.grade] - gradeOrder[a.grade]
        );
      case "power":
        return [...list].sort((a, b) => b.power - a.power);
      case "recent":
      default:
        return [...list]; // 저장된 순서가 최신순
    }
  };

  const sortedList = sortMonsters(monsters);

  return (
    <div>
      <h1>📖 내 몬스터 도감</h1>

      {/* 정렬 선택 UI */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>정렬 :</label>
        <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="recent">📅 최신순</option>
          <option value="grade">⭐ 등급순</option>
          <option value="power">💥 공격력 높은순</option>
        </select>
      </div>

      {sortedList.length === 0 ? (
        <p>아직 몬스터가 없습니다.</p>
      ) : (
        <div className="monster-grid">
          {sortedList.map((m, idx) => (
            <div
              key={idx}
              className={`monster-card fade-in ${m.grade === "LEGENDARY" ? "legendary-glow" : ""}`}
            >
              <h3 className={`grade-${m.grade}`}>{m.name}</h3>
              <p>등급: <span className={`grade-${m.grade}`}>{m.grade}</span></p>
              <p>공격력: {m.power}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}//MonsterBook


export default App;
