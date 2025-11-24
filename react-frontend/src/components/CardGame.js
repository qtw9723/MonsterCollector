import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/CardGame.css";

function CardGame() {
  const [cards, setCards] = useState([]);          // '?' 표시된 카드 배열
  const [realCards, setRealCards] = useState([]);  // 실제 숫자 배열
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [successCount, setSuccessCount] = useState(0);
  const [rates, setRates] = useState(null);

  /* ----------------------- 게임 시작 ----------------------- */
  const startGame = async () => {
    try {
      const res = await axios.get("https://monstercollector-production.up.railway.app/card/start");
      setCards(res.data.cards); // ['?', '?', '?', ...]
      setMessage(res.data.message);
      setGameOver(false);
      setSuccessCount(0);

      // 실제 배열은 start() 응답에서 제공하지 않으므로 → 새로 요청해도 됨
      // 하지만 서버에서 deck을 제공하지 않기 때문에 flip에서 사용
    } catch (err) {
      console.error("시작 실패:", err);
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  /* ----------------------- 카드 선택 ----------------------- */
  const flipCard = async (index) => {
    if (gameOver) return;

    try {
      const res = await axios.get(
        `https://monstercollector-production.up.railway.app/card/flip?index=${index}`
      );

      const openedNumber = res.data.opened;

      // 카드 UI에서 뒤집힌 카드만 표시
      const newCards = [...cards];
      newCards[index] = openedNumber;
      setCards(newCards);

      setMessage(res.data.message);

      // 게임 종료 시
      if (res.data.gameOver) {
        setGameOver(true);
        setSuccessCount(res.data.successCount);

        if (res.data.rate) {
          setRates(res.data.rate);
        }
        return;
      }
    } catch (err) {
      console.error("카드 오픈 실패:", err);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>🃏 카드 순서대로 뒤집기</h1>

      <p>{message}</p>

      <div className="card-grid">
        {cards.map((c, idx) => (
          <div key={idx} className="card" onClick={() => flipCard(idx)}>
            {c === "?" ? "❓" : c}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="game-over-box">
          <h2>게임 종료!</h2>
          <p>성공한 숫자: {successCount}</p>

          {rates && (
            <div style={{ marginTop: "15px" }}>
              <h3>📊 몬스터 등장 확률</h3>
              <p>Normal: {rates.NORMAL.toFixed(2)}%</p>
              <p>Rare: {rates.RARE.toFixed(2)}%</p>
              <p>Epic: {rates.EPIC.toFixed(2)}%</p>
              <p>Legendary: {rates.LEGENDARY.toFixed(2)}%</p>
            </div>
          )}

          <button onClick={startGame}>다시 시작하기</button>
        </div>
      )}
    </div>
  );
}

export default CardGame;
