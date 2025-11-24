import React, { useState, useEffect } from "react";
import axios from "axios";

function CardGame() {
  const MAX_FLIPS = 3;

  const [cards, setCards] = useState([]); // 카드 숫자 리스트
  const [flipped, setFlipped] = useState([]); // true/false로 오픈 상태
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [flipCount, setFlipCount] = useState(0);

  // 게임 시작
  useEffect(() => {
    const startGame = async () => {
      try {
        const res = await axios.get("https://monstercollector-production.up.railway.app/card/start");
        setCards(res.data.cards || []);
        setFlipped(Array(res.data.cards.length).fill(false));
        setScore(0);
        setMessage("카드를 선택하세요");
        setFlipCount(0);
      } catch (err) {
        console.error(err);
      }
    };
    startGame();
  }, []);

  // 카드 클릭
  const handleFlip = (index) => {
    if (flipped[index]) return; // 이미 오픈한 카드
    if (flipCount >= MAX_FLIPS) {
      alert(`최대 ${MAX_FLIPS}회까지 선택 가능합니다!`);
      return;
    }

    const newFlipped = [...flipped];
    newFlipped[index] = true;
    setFlipped(newFlipped);

    setScore((prev) => prev + cards[index]);
    setFlipCount((prev) => prev + 1);

    if (flipCount + 1 === MAX_FLIPS) {
      setMessage(`최대 횟수 도달! 최종 점수: ${score + cards[index]}`);
    } else {
      setMessage(`선택한 카드: ${cards[index]}`);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>카드 선택 게임</h1>
      <p>{message}</p>
      <p>점수: {score}</p>
      <p>선택 횟수: {flipCount} / {MAX_FLIPS}</p>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
        {cards.map((num, idx) => (
          <div
            key={idx}
            onClick={() => handleFlip(idx)}
            style={{
              width: "60px",
              height: "90px",
              backgroundColor: flipped[idx] ? "#fff" : "#333",
              color: flipped[idx] ? "#000" : "#333",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "24px",
              cursor: flipped[idx] ? "default" : "pointer",
              borderRadius: "8px",
              border: "2px solid #000",
            }}
          >
            {flipped[idx] ? num : "?"}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardGame;
