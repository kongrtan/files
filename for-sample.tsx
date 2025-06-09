import React, { useEffect, useState } from "react";

interface MenuItem {
  name: string;
  url: string;
}

const ButtonList: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // 예시용 메뉴 API 호출
    fetch("/api/menus")
      .then((res) => res.json())
      .then((data: MenuItem[]) => {
        setMenuItems(data);
      })
      .catch((err) => {
        console.error("API 오류:", err);
      });
  }, []);

  const handleClick = async (url: string) => {
    try {
      // 토큰을 받아오는 API 호출 (GET 또는 POST, 실제 API에 맞게 조정)
      const res = await fetch("/api/get-token");
      const data = await res.json();

      const token = data.token; // 예: { token: "abc123" }

      // URL에 토큰 붙이기
      const newUrl = `${url}?token=${encodeURIComponent(token)}`;

      // 이동
      window.location.href = newUrl;
    } catch (err) {
      console.error("토큰 가져오기 실패:", err);
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {menuItems.map((item, index) => (
        <button key={index} onClick={() => handleClick(item.url)}>
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default ButtonList;










const delimiter = url.includes("?") ? "&" : "?";
const newUrl = `${url}${delimiter}token=${encodeURIComponent(token)}`;


const urlObj = new URL(url, window.location.origin);
urlObj.searchParams.set("token", token);
window.location.href = urlObj.toString();




const handleClick = async (url: string) => {
  try {
    const res = await fetch("/api/get-token");
    const data = await res.json();
    const token = data.token;

    const delimiter = url.includes("?") ? "&" : "?";
    const newUrl = `${url}${delimiter}token=${encodeURIComponent(token)}`;

    window.location.href = newUrl;
  } catch (err) {
    console.error("토큰 가져오기 실패:", err);
  }
};
