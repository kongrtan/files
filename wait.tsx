useEffect(() => {
  const waitForParam = async () => {
    for (let i = 0; i < 10; i++) {
      const params = new URLSearchParams(window.location.search);
      const value = params.get("myParam");

      if (value) {
        setParam(value);
        break;
      }

      await sleep(200); // 200ms 대기 후 다시 시도
    }
  };

  waitForParam();
}, []);
