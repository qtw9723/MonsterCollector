import React, { useState } from 'react';

function GuessGame() {
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleInputChange = (e) => {
    setNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttempts(attempts + 1);
    
    const response = await fetch(`http://localhost:8080/guess?number=${number}`);
    const result = await response.text();
    
    setMessage(result);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>숫자 맞추기 게임</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={number}
          onChange={handleInputChange}
          min="1"
          max="100"
          placeholder="1~100 사이의 숫자"
        />
        <button type="submit">추측하기</button>
      </form>
      <div>
        <p>{message}</p>
        <p>시도 횟수: {attempts}</p>
      </div>
    </div>
  );
}

export default GuessGame;
