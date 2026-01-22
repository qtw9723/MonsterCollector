import React, { useState } from 'react';

const SUPABASE_ANON_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVscW9teGFlbXFpcWFsemhjemZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMjk2MDQsImV4cCI6MjA4NDYwNTYwNH0.0he5PJ_4W9pEUR1Vi8LbnhUwsOsb-8vh2wVXUh11R0k';

function GuessGame() {
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleInputChange = (e) => {
    setNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttempts((prev) => prev + 1);

    const response = await fetch(
      `https://elqomxaemqiqalzhczfc.supabase.co/functions/v1/guess/guess?number=${number}`,
      {
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_TOKEN}`,
        },
      }
    );

    const result = await response.json();
    setMessage(result.message ?? JSON.stringify(result));
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
