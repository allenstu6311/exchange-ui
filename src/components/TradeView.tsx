// TradingViewWidget.jsx
import { RootState } from "@/store";
import React, { useEffect, useRef, memo, useState } from "react";
import { useSelector } from "react-redux";

function TradingViewWidget() {
  const slashSymbol = useSelector((state: RootState) => {
    return state.symbolNameMap.slashSymbol;
  });
  const [key, setKey] = useState(0); // 這裡用 key 來強制讓 div 重掛載

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createTradeView = () => {
      if (!container.current) return;

      /**
       * 會導致Cannot read properties of null (reading 'querySelector')
       * 到時會使用自製圖表解決該問題
       */
      container.current.innerHTML = "";

      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
            {
              "autosize": true,
              "symbol": "${slashSymbol}",
              "interval": "D",
              "timezone": "Etc/UTC",
              "theme": "light",
              "style": "1",
              "locale": "en",
              "allow_symbol_change": true,
              "support_host": "https://www.tradingview.com"
            }`;

      container.current.appendChild(script);
    };

    if (slashSymbol) {
      createTradeView();
    }
  }, [slashSymbol, key]);

  useEffect(() => {
    // slashSymbol 每變一次，強制 key +1，讓 container 重新掛載
    setKey((prev) => prev + 1);
  }, [slashSymbol]);

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
      <div className="tradingview-widget-copyright"></div>
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
