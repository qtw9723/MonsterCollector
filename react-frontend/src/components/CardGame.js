import React, { useState, useEffect } from "react";
import axios from "axios";

const MAX_FLIPS = 3;

function CardGame() {
  const [cards, setCards] = useState([]);       // 숫자 배열
  const [display, setDisplay] = useState([]);   // 화면에 보여지는 카드 ("?" 또는 숫자)
  const [flipped, setFlipped] = useState([]);   // 오픈 여부
  const [score, setScore] = useState(0);
  const [flipCount, setFlipCount] = useState(0);
  const [message, setMessage] = useState("");

  // 게임 시작
  const startGame = async () => {
    try {
      const res = await axios.get("https://monstercollector-production.up.railway.app/card/start");
      const numbers = res.data.cards;  // 숫자 배열 받음
      setCards(numbers);
      setDisplay(Array(numbers.length).fill("?"));
      setFlipped(Array(numbers.length).fill(false));
      setScore(0);
      setFlipCount(0);
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  // 카드 클릭
  const handleFlip = (index) => {
    if (flipped[index]) return;          // 이미 오픈한 카드
    if (flipCount >= MAX_FLIPS) return;  // 최대 오픈 제한

    const newDisplay = [...display];
    newDisplay[index] = cards[index];    // 클릭한 카드만 숫자 공개
    setDisplay(newDisplay);

    const newFlipped = [...flipped];
    newFlipped[index] = true;
    setFlipped(newFlipped);

    setScore(score + cards[index]);
    setFlipCount(flipCount + 1);
    setMessage(`${cards[index]} 점 획득!`);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>카드 점수 게임</h1>
      <button onClick={startGame} style={{ marginBottom: "20px" }}>게임 시작</button>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        {display.map((d, i) => (
          <div
            key={i}
            onClick={() => handleFlip(i)}
            style={{
              width: "60px",
              height: "80px",
              lineHeight: "80px",
              textAlign: "center",
              fontSize: "24px",
              background: flipped[i] ? "#4caf50" : "#ccc",
              cursor: flipped[i] || flipCount >= MAX_FLIPS ? "not-allowed" : "pointer",
              borderRadius: "8px",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <p style={{ marginTop: "20px" }}>{message}</p>
      <p>점수: {score}</p>
      <p>오픈 횟수: {flipCount} / {MAX_FLIPS}</p>
    </div>
  );
}

export default CardGame;
