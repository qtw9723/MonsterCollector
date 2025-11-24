// CardGamePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CardGamePage() {
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);
  const [openedCount, setOpenedCount] = useState(0);
  const maxOpen = 3; // 최대 오픈 횟수

  // 게임 시작
  const startGame = async () => {
    try {
      const res = await axios.get(
        "https://monstercollector-production.up.railway.app/card/start"
      );
      setCards(res.data.cards);
      setScore(res.data.score);
      setOpenedCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  // 카드 뒤집기
  const flipCard = async (index) => {
    if (openedCount >= maxOpen || cards[index] !== "?") return;

    try {
      const res = await axios.get(
        `https://monstercollector-production.up.railway.app/card/flip?index=${index}`
      );

      const newCards = res.data.cards;
      const newScore = res.data.score;

      setCards(newCards);
      setScore(newScore);

      const newOpenedCount = openedCount + 1;
      setOpenedCount(newOpenedCount);

      if (newOpenedCount === maxOpen) {
        alert(`최종 점수는 ${newScore}점입니다.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>카드 점수 게임</h1>
      <p>최대 {maxOpen}장 카드까지 선택 가능</p>
      <p>점수: {score}</p>
      <p>
        도전 횟수 : {openedCount}/{maxOpen}
      </p>

      {/* 카드 6×6 그리드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 70px)",
          justifyContent: "center",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => flipCard(idx)}
            style={{
              width: "70px",
              height: "90px",
              background: card === "?" ? "#333" : "#4caf50",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              cursor:
                card === "?" && openedCount < maxOpen
                  ? "pointer"
                  : "not-allowed",
              borderRadius: "10px",
              userSelect: "none",
              fontWeight: "bold",
            }}
          >
            {card}
          </div>
        ))}
      </div>

      <button
        onClick={startGame}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        다시 시작
      </button>
    </div>
  );
}
