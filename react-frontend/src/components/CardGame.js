import React, { useState, useEffect } from "react";
import axios from "axios";

function CardScoreGame() {
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  const startGame = async () => {
    try {
      const res = await axios.get("https://monstercollector-production.up.railway.app/card/start");
      setCards(res.data.cards);
      setScore(res.data.score);
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const flipCard = async (index) => {
    try {
      const res = await axios.get(`https://monstercollector-production.up.railway.app/card/flip?index=${index}`);
      setCards(res.data.cards);
      setScore(res.data.score);
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>카드 점수 게임</h1>
      <button onClick={startGame} style={{ marginBottom: "20px" }}>
        게임 시작
      </button>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        {cards.map((c, idx) => (
          <div
            key={idx}
            onClick={() => flipCard(idx)}
            style={{
              width: "50px",
              height: "70px",
              lineHeight: "70px",
              background: "#2b2b2b",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            {c}
          </div>
        ))}
      </div>

      <p style={{ marginTop: "20px" }}>{message}</p>
      <h3>점수: {score}</h3>
    </div>
  );
}

export default CardScoreGame;
