    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,

},
rules: {
// other rules...
// Enable its recommended typescript rules
...reactX.configs['recommended-typescript'].rules,
...reactDom.configs.recommended.rules,
},
})

```


API Key: UTj7iVVEx6nMyhJQiUyyIYW6GxUDXlGMcvVnzhOmlR3mktMBA5N2qk2B4EoIfSfn

Secret Key: 4mSUiEArmbdTraMjjAuQYM0g1dVL4EH44UvIhyYXaoXmZblg1ZWtlv08wW4QMk9h


最新成交價	/api/v3/ticker/price?symbol=BTCUSDT	查看某交易對當前成交價
K線資料	/api/v3/klines?symbol=BTCUSDT&interval=1m	查 K 線
深度資料（Order Book）	/api/v3/depth?symbol=BTCUSDT	買賣掛單盤
即時價格變動	/api/v3/ticker/24hr?symbol=BTCUSDT	包含高低點、漲跌等

 /api/v3/ticker/24hr

# errorMiddlewares

#虛擬化列表
```
