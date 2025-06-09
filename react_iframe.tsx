import React, { useState } from 'react';

const IframeWithMenu = () => {
  const [url, setUrl] = useState('https://www.google.com');

  const handleMenuClick = (newUrl) => {
    setUrl(newUrl);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 좌측 메뉴 */}
      <div style={{ width: '200px', backgroundColor: '#f5f5f5', padding: '10px' }}>
        <h3>Menu</h3>
        <button onClick={() => handleMenuClick('https://www.google.com')}>Google</button>
        <br />
        <button onClick={() => handleMenuClick('https://www.naver.com')}>Naver</button>
        <br />
        <button onClick={() => handleMenuClick('https://www.daum.net')}>Daum</button>
      </div>

      {/* 우측 iframe */}
      <div style={{ flexGrow: 1 }}>
        <iframe
          src={url}
          title="Content Frame"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        />
      </div>
    </div>
  );
};

export default IframeWithMenu;
