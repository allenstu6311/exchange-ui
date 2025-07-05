import React, { useEffect, useRef, useState } from 'react';

interface VirtualScrollProps {
  data: any[];
  itemHeight: number;
  children: (visibleItems: any[], startIndex: number) => React.ReactNode;
}

const VirtualScroll: React.FC<VirtualScrollProps> = ({
  data,
  itemHeight,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [availableHeight, setAvailableHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // 使用 ResizeObserver 監聽容器尺寸變化
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setAvailableHeight(entry.contentRect.height);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // 處理滾動事件
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // 計算可見項目
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(availableHeight / itemHeight) + 2; // 多渲染 2 個項目作為緩衝
  const endIndex = Math.min(startIndex + visibleCount, data.length);
  const visibleItems = data.slice(startIndex, endIndex);

  // 計算總高度和偏移量
  const totalHeight = data.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div 
      ref={containerRef}
      className="virtual-scroll-container"
      style={{ 
        height: '100%',
        overflow: 'auto',
        position: 'relative'
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ 
          position: 'absolute',
          top: offsetY,
          left: 0,
          right: 0
        }}>
          {children(visibleItems, startIndex)}
        </div>
      </div>
    </div>
  );
};

// 使用範例組件 - 使用 CSS Grid 自動計算高度
const NewDeal: React.FC = () => {
  // 模擬數據
  const mockData = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    price: Math.random() * 1000,
    amount: Math.random() * 100,
    time: new Date().toLocaleTimeString()
  }));

  return (
    <div style={{ 
      height: '500px', 
      display: 'grid',
      gridTemplateRows: 'auto auto 1fr', // 自動分配高度
      gap: '0'
    }}>
      {/* 其他元件 - 自動高度 */}
      <div style={{ 
        background: '#f0f0f0',
        padding: '10px'
      }}>
        其他元件
      </div>
      
      {/* 表格標題 - 自動高度 */}
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>價格</th>
            <th>數量</th>
            <th>時間</th>
          </tr>
        </thead>
      </table>
      
      {/* 虛擬滾動容器 - 剩餘空間 */}
      <VirtualScroll
        data={mockData}
        itemHeight={40}
      >
        {(visibleItems, startIndex) => (
          <table style={{ width: '100%' }}>
            <tbody>
              {visibleItems.map((item, index) => (
                <tr key={item.id} style={{ height: '40px' }}>
                  <td>{item.price.toFixed(2)}</td>
                  <td>{item.amount.toFixed(2)}</td>
                  <td>{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </VirtualScroll>
    </div>
  );
};

export default NewDeal; 