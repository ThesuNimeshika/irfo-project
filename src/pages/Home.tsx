import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useEffect, useState, useRef } from 'react';
import '../App.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  // Date state
  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  // Pie chart state
  const [pieType, setPieType] = useState<'unit' | 'market'>('unit');
  const [pieData, setPieData] = useState(getMockData(todayStr, 'unit').pie);
  // Creation and Redeem price state (animated)
  const [creationPrice, setCreationPrice] = useState(getMockData(todayStr, 'unit').creationPrice);
  const [redeemPrice, setRedeemPrice] = useState(getMockData(todayStr, 'unit').redeemPrice);
  const creationAnimRef = useRef(creationPrice);
  const redeemAnimRef = useRef(redeemPrice);
  const [creationDisplay, setCreationDisplay] = useState(creationPrice);
  const [redeemDisplay, setRedeemDisplay] = useState(redeemPrice);

  // Animate price changes on backend load
  useEffect(() => {
    const d = getMockData(selectedDate, pieType);
    setPieData(d.pie);
    // Animate creation price
    const animate = (from: number, to: number, setter: (v: number) => void) => {
      const duration = 600;
      const steps = 30;
      let current = 0;
      const diff = to - from;
      const step = () => {
        current++;
        setter(Number((from + (diff * (current / steps))).toFixed(2)));
        if (current < steps) setTimeout(step, duration / steps);
      };
      step();
    };
    animate(creationAnimRef.current, d.creationPrice, setCreationDisplay);
    animate(redeemAnimRef.current, d.redeemPrice, setRedeemDisplay);
    creationAnimRef.current = d.creationPrice;
    redeemAnimRef.current = d.redeemPrice;
    setCreationPrice(d.creationPrice);
    setRedeemPrice(d.redeemPrice);
  }, [selectedDate, pieType]);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 900 : false);

  // Update isMobile on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className="navbar-fixed-wrapper">
        <Navbar />
      </div>
      {/* Mobile menu icon and sidebar removed for mobile view */}
      <div className="home-main-layout" style={{ marginTop: 0, paddingTop: 0 }}>
        {/* Sidebar left-aligned, fixed width (120px) on desktop only */}
        {!isMobile && (
          <div className="home-sidebar-container">
            <Sidebar />
          </div>
        )}
        {/* Unified magical layout card */}
        <div className="home-card magical-bg animated-bg dashboard-main-card">
          {/* Creation/Redeem section */}
          <div className="dashboard-price-section">
            <div className="dashboard-price-row">
              <span className="dashboard-price-icon dashboard-price-icon-creation">💰</span>
              <div>
                <div className="dashboard-price-label">Creation Price</div>
                <div className="dashboard-price-value">{creationDisplay}</div>
              </div>
            </div>
            <div className="dashboard-price-row">
              <span className="dashboard-price-icon dashboard-price-icon-redeem">🔄</span>
              <div>
                <div className="dashboard-price-label">Redeem Price</div>
                <div className="dashboard-price-value">{redeemDisplay}</div>
              </div>
            </div>
          </div>
          {/* Pie chart section */}
          <div className="dashboard-pie-section">
            {/* Legend left */}
            <div className="dashboard-pie-legend">
              {pieData.map((entry) => (
                <div key={entry.name} className="dashboard-pie-legend-row">
                  <span className="dashboard-pie-legend-color" style={{ background: entry.color }}></span>
                  <span className="dashboard-pie-legend-label">{entry.name}</span>
                </div>
              ))}
            </div>
            {/* Pie chart center */}
            <div className="dashboard-pie-chart">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={60}
                    isAnimationActive={true}
                    animationDuration={700}
                    key={pieType}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      const total = pieData.reduce((sum, v) => sum + v.value, 0);
                      const percent = ((d.value / total) * 100).toFixed(1);
                      return (
                        <div className="dashboard-pie-tooltip">
                          <div><b>{d.name}</b></div>
                          <div>Value: {d.value}</div>
                          <div>Units: {d.units}</div>
                          <div>Percent: {percent}%</div>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Radio buttons for pie type selection */}
            <div className="dashboard-pie-checkboxes dashboard-pie-checkboxes-vertical" style={{ alignItems: 'flex-start' }}>
              <label className="dashboard-pie-checkbox-label">
                <input
                  type="radio"
                  name="pieType"
                  checked={pieType === 'unit'}
                  onChange={() => setPieType('unit')}
                  style={{ accentColor: '#4f46e5' }}
                />
                Unit wise
              </label>
              <label className="dashboard-pie-checkbox-label">
                <input
                  type="radio"
                  name="pieType"
                  checked={pieType === 'market'}
                  onChange={() => setPieType('market')}
                  style={{ accentColor: '#d946ef' }}
                />
                Market price wise
              </label>
            </div>
          </div>
          {/* Date section */}
          <div className="dashboard-date-section">
            <div className="dashboard-date-label">Adjust Date</div>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="dashboard-date-input"
              max={todayStr}
            />
            <div className="dashboard-date-value">
              {new Date(selectedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
        {/* Animations and Responsive Styles moved to App.css */}
      </div>
    </>
  );
// Mock backend data loader with date
function getMockData(dateStr: string, type: 'unit' | 'market') {
  // Use date string and type to simulate different data
  // In real app, fetch from backend with date/type
  const seed = dateStr.split('-').reduce((a: number, b: string) => a + parseInt(b), 0) + (type === 'unit' ? 1 : 2);
  return {
    creationPrice: 100 + (seed % 10),
    redeemPrice: 95 + (seed % 7),
    pie: [
      { name: 'Fund A', value: 400 + (seed % 30), color: '#4f46e5', units: 40 + (seed % 5) },
      { name: 'Fund B', value: 300 + (seed % 20), color: '#d946ef', units: 30 + (seed % 7) },
      { name: 'Fund C', value: 300 + (seed % 10), color: '#f59e42', units: 30 + (seed % 3) },
    ],
  };
}
}

