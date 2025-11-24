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
      setCards(res.data.cards); // ["?", "?", ...]
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
      setCards(newCards);
      setScore(res.data.score);
        setOpenedCount(openedCount + 1);
        if (openedCount == 3) {
            alert("최종 점수는 "+{score}+"점입니다.");
        }//if
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => flipCard(idx)}
            style={{
              width: "60px",
              height: "80px",
              background: card === "?" ? "#555" : "#4caf50",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              cursor:
                card === "?" && openedCount < maxOpen
                  ? "pointer"
                  : "not-allowed",
              borderRadius: "8px",
              userSelect: "none",
            }}
          >
            {card}
          </div>
        ))}
      </div>

      <button
        onClick={startGame}
        style={{ marginTop: "30px", padding: "10px 20px", fontSize: "16px" }}
      >
        다시 시작
      </button>
    </div>
  );
}
