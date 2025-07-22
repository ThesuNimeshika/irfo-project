
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useEffect, useState, useRef } from 'react';
import '../App.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

type PieEntry = { name: string; value: number; color: string; units: number };

const defaultPieData: PieEntry[] = [
  { name: 'A', value: 0, color: '#4f46e5', units: 0 }, // deep indigo
  { name: 'B', value: 0, color: '#d946ef', units: 0 }, // vibrant magenta
  { name: 'C', value: 0, color: '#f59e42', units: 0 }  // orange
];

function Home() {
  // Floating label and active slice
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // Date state
  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  // Pie chart state
  const [pieType, setPieType] = useState<'unit' | 'market'>('unit');
  const [pieData, setPieData] = useState<PieEntry[]>(defaultPieData);
  // Creation and Redeem price state (animated)
  const creationAnimRef = useRef(0);
  const redeemAnimRef = useRef(0);
  const [creationDisplay, setCreationDisplay] = useState(0);
  const [redeemDisplay, setRedeemDisplay] = useState(0);

  // Simulate backend fetch (replace with real API call)
  async function fetchPieData(_date: string, type: 'unit' | 'market') {
    // TODO: Replace with real backend fetch
    // Simulate different data for demo
    if (type === 'unit') {
      return {
        pie: [
          { name: 'A', value: 40, color: '#4f46e5', units: 100 },
          { name: 'B', value: 30, color: '#d946ef', units: 80 },
          { name: 'C', value: 20, color: '#f59e42', units: 60 }
        ],
        creationPrice: 123.45,
        redeemPrice: 98.76
      };
    } else {
      return {
        pie: [
          { name: 'A', value: 60, color: '#4f46e5', units: 50 },
          { name: 'B', value: 25, color: '#d946ef', units: 30 },
          { name: 'C', value: 15, color: '#f59e42', units: 20 }
        ],
        creationPrice: 150.12,
        redeemPrice: 110.34
      };
    }
  }

  // Animate price changes on backend load
  useEffect(() => {
    let mounted = true;
    fetchPieData(selectedDate, pieType).then(d => {
      if (!mounted) return;
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
    });
    return () => { mounted = false; };
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
                <div className="dashboard-price-value">${creationDisplay.toFixed(2)}</div>
              </div>
            </div>
            <div className="dashboard-price-row">
              <span className="dashboard-price-icon dashboard-price-icon-redeem">🔄</span>
              <div>
                <div className="dashboard-price-label">Redeem Price</div>
                <div className="dashboard-price-value">${redeemDisplay.toFixed(2)}</div>
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
                    onMouseLeave={() => { setActiveIndex(null); }}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color}
                        stroke={activeIndex === idx ? '#222' : undefined}
                        strokeWidth={activeIndex === idx ? 2 : 1}
                        className={activeIndex === idx ? 'pie-slice-pop' : ''}
                        style={{ transition: 'filter 0.25s, transform 0.25s', cursor: 'pointer' }}
                        onMouseEnter={() => {
                          setActiveIndex(idx);
                        }}
                      />
                    ))}
                  </Pie>
                  {/* Hide default tooltip, use magical popup instead */}
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const entry = payload[0].payload;
                        const total = pieData.reduce((sum, v) => sum + v.value, 0);
                        const percent = total ? ((entry.value / total) * 100).toFixed(1) : 0;
                        return (
                          <div className="dashboard-pie-tooltip">
                            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{entry.name}</div>
                            <div>Units: <b>{entry.units}</b></div>
                            <div>Percent: <b>{percent}%</b></div>
                          </div>
                        );
                      }
                      return null;
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
}

export default Home;


