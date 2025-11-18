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

/* 홈 화면 */
function Home() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>🎮 몬스터 뽑기 게임</h1>
      <p>숫자를 맞추고 몬스터를 모아보세요!</p>
    </div>
  );
}

/* 숫자 맞추기 게임 */
function GuessGame() {
  const navigate = useNavigate();
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [rates, setRates] = useState({});

  useEffect(() => {
    axios.get("http://monstercollector-production.up.railway.app:8080/rate")
      .then(res => setRates(res.data))
      .catch(err => console.error(err));
  }, [attempts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttempts(attempts + 1);

    const response = await axios.get(`http://monstercollector-production.up.railway.app:8080/guess?number=${number}`);
    const result = response.data;

    setMessage(result.message);

    if (result.message.includes("너무")) {
      const inputEl = document.querySelector("input[type='number']");
      inputEl.classList.add("shake");
      setTimeout(() => inputEl.classList.remove("shake"), 300);
    }

    if (result.monster) {
      const popup = document.createElement("div");
      popup.className = "popup";
      popup.innerText = `🎉 ${result.monster.name} (${result.monster.grade}) 획득!`;
      document.body.appendChild(popup);
      setTimeout(() => document.body.removeChild(popup), 1500);

      await axios.post("http://monstercollector-production.up.railway.app:8080/saveMonster", result.monster);

      navigate("/monsters");
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

      <div>
        <h3>📊 현재 확률</h3>
        <p>Normal: {rates.NORMAL?.toFixed(1)}%</p>
        <p>Rare: {rates.RARE?.toFixed(1)}%</p>
        <p>Epic: {rates.EPIC?.toFixed(1)}%</p>
        <p>Legendary: {rates.LEGENDARY?.toFixed(1)}%</p>
      </div>
    </div>
  );
}

/* 몬스터 도감 */
function MonsterBook() {
  const [monsters, setMonsters] = useState([]);

  useEffect(() => {
    axios.get("http://monstercollector-production.up.railway.app:8080/myMonsters")
      .then(res => setMonsters(res.data))
      .catch(err => console.error("도감 불러오기 실패", err));
  }, []);

  return (
    <div>
      <h1>📖 내 몬스터 도감</h1>

      {monsters.length === 0 ? (
        <p>아직 몬스터가 없습니다.</p>
      ) : (
        <div className="monster-grid">
          {monsters.map((m, idx) => (
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
}

export default App;
