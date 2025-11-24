import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CardGamePage() {
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);
  const [openedCount, setOpenedCount] = useState(0);
  const [drawnMonster, setDrawnMonster] = useState(null); // 뽑힌 몬스터 저장

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
      setDrawnMonster(null); // 이전 몬스터 결과 초기화
    } catch (err) {
      console.error(err);
    }
  };

  // 몬스터 뽑기 호출
  const drawMonster = async (finalScore) => {
    try {
      const res = await axios.get(
        `https://monstercollector-production.up.railway.app/card/draw?score=${finalScore}`
      );
      setDrawnMonster(res.data);
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

      // 3장 뒤집으면 → 몬스터 자동 뽑기
      if (newOpenedCount === maxOpen) {
        alert(`최종 점수는 ${newScore}점입니다.`);
        drawMonster(newScore);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h1>카드 점수 게임</h1>

      <p>최대 {maxOpen}장 카드까지 선택 가능</p>
      <p>현재 점수: {score}</p>
      <p>
        도전 횟수 : {openedCount}/{maxOpen}
      </p>

      {/* 카드 그리드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 70px)",
          gridGap: "10px",
          justifyContent: "center",
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
              background: card === "?" ? "#444" : "#4caf50",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              cursor:
                card === "?" && openedCount < maxOpen
                  ? "pointer"
                  : "not-allowed",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
              transition: "transform 0.2s",
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
          padding: "12px 25px",
          fontSize: "16px",
          borderRadius: "8px",
        }}
      >
        다시 시작
      </button>

      {/* 뽑힌 몬스터 결과 UI */}
      {drawnMonster && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#222",
            color: "white",
            borderRadius: "15px",
            width: "300px",
            marginLeft: "auto",
            marginRight: "auto",
            boxShadow: "0 6px 15px rgba(0,0,0,0.5)",
          }}
        >
          <h2>🎉 획득한 몬스터!</h2>

          <p style={{ fontSize: "22px", fontWeight: "bold" }}>
            {drawnMonster.name}
          </p>
          <p style={{ fontSize: "18px" }}>등급: {drawnMonster.grade}</p>
          <p style={{ fontSize: "18px" }}>전투력: {drawnMonster.power}</p>
        </div>
      )}
    </div>
  );
}
