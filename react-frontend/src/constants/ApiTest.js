import React, { useState } from 'react';

const ApiTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    // 1. Multipart 형식을 위해 FormData 객체 생성
    const formData = new FormData();
    formData.append('bg', '72fd125a-f3d9-4249-884d-43079132e93a');
    formData.append('prompt', '몰라');
    formData.append('photo', '340e6d3b-cd0e-4765-a841-168d33225c78');

    try {
      const response = await fetch('http://223.130.134.171:5500/api/image', {
        method: 'POST', // 멀티파트는 주로 POST 방식을 사용합니다.
        body: formData, // JSON.stringify 하지 않고 그대로 넣습니다.
        // 주의: Multipart 전송 시 Content-Type 헤더는 브라우저가 자동으로 설정하게 두어야 합니다.
      });

      if (!response.ok) {
        throw new Error(`서버 에러: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
      console.error("전송 에러:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>🖼 이미지 API 테스트</h2>
      <div style={{ marginBottom: '15px', color: '#666' }}>
        <strong>Endpoint:</strong> http://223.130.134.171:5500/api/image <br/>
        <strong>Type:</strong> Multipart/form-data
      </div>

      <button
        onClick={handleTest}
        disabled={loading}
        style={{
          padding: '12px 24px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '이미지 생성 중...' : 'API 호출 실행'}
      </button>

      <hr style={{ margin: '25px 0', border: '0.5px solid #eee' }} />

      {error && (
        <div style={{ color: 'red', padding: '10px', background: '#fff0f0' }}>
          ❌ 호출 실패: {error}
        </div>
      )}

      {result && (
        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0 }}>✅ 서버 응답 결과:</h4>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;