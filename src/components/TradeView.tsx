// TradingViewWidget.jsx
import React, { useEffect, useRef, memo, useState } from "react";
import { useSelector } from "react-redux";

function TradingViewWidget() {
  const currentSymbol = useSelector((state: any) => {
    return state.currentSymbol.symbol;
  });

  const container = useRef<HTMLDivElement>(null);
  // const [isCrateTradeView, setIsCrateTradeView] = useState(false)
  let isCrateTradeView = false;
  const createTradeView = () => {
    if (!container.current) return;

    // 清空舊內容（關鍵）
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
          {
            "autosize": true,
            "symbol": "${currentSymbol.toUpperCase()}",
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "light",
            "style": "1",
            "locale": "en",
            "allow_symbol_change": true,
            "support_host": "https://www.tradingview.com"
          }`;
    // if (container.current) {
    //   container.current.appendChild(script);
    // }
    container.current.appendChild(script);
  };

  // useEffect(() => {
  //   if (!isCrateTradeView) {
  //     createTradeView();
  //     isCrateTradeView = true;
  //   }
  // }, []);

  useEffect(() => {
    createTradeView();
  }, [currentSymbol]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "100%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      ></div>
      {/* <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div> */}
    </div>
  );
}

export default memo(TradingViewWidget);
