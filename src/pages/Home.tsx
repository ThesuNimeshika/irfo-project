import Navbar, { Footer } from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useEffect, useState, useRef } from 'react';
import '../App.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import DataTable from "../components/DataTable"

type PieEntry = { name: string; value: number; color: string };

// Define 10 colors for the 10 parts - matching system colors
const pieColors = [
  '#4f46e5', // deep indigo (primary)
  '#d946ef', // vibrant magenta (secondary)
  '#f0abfc', // pink (from gradient)
  '#e0e7ff', // light indigo (from gradient)
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e42', // orange
  '#DAC17C', // Sandcastle
  '#FFDE21'  // yellow
];

const defaultPieData: PieEntry[] = [
  { name: 'Part A', value: 15, color: pieColors[0] },
  { name: 'Part B', value: 12, color: pieColors[1] },
  { name: 'Part C', value: 10, color: pieColors[2] },
  { name: 'Part D', value: 8, color: pieColors[3] },
  { name: 'Part E', value: 7, color: pieColors[4] },
  { name: 'Part F', value: 6, color: pieColors[5] },
  { name: 'Part G', value: 5, color: pieColors[6] },
  { name: 'Part H', value: 4, color: pieColors[7] },
  { name: 'Part I', value: 3, color: pieColors[8] },
  { name: 'Part J', value: 2, color: pieColors[9] }
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
  const [tableTotalCount, setTableTotalCount] = useState(0);

  // Fetch fund names and update pie chart labels
  async function fetchFundNames() {
    try {
      const response = await fetch('http://localhost:5095/api/dashboard/funds/names');
      if (!response.ok) throw new Error('Failed to fetch fund names');
      const fundNames: string[] = await response.json();
      
      
      setPieData(prevData => {
        return prevData.map((item, index) => ({
          ...item,
          name: fundNames[index] || item.name 
        }));
      });
    } catch (err) {
      console.error('Error loading fund names:', err);
      
    }
  }

  // Simulate backend fetch (replace with real API call)
  async function fetchPieData(_date: string, type: 'unit' | 'market') {
    // Use current pie data names to maintain labels
    const currentNames = pieData.map(item => item.name);
    
    if (type === 'unit') {
      return {
        pie: [
          { name: currentNames[0], value: 15, color: pieColors[0] },
          { name: currentNames[1], value: 12, color: pieColors[1] },
          { name: currentNames[2], value: 10, color: pieColors[2] },
          { name: currentNames[3], value: 8, color: pieColors[3] },
          { name: currentNames[4], value: 7, color: pieColors[4] },
          { name: currentNames[5], value: 6, color: pieColors[5] },
          { name: currentNames[6], value: 5, color: pieColors[6] },
          { name: currentNames[7], value: 4, color: pieColors[7] },
          { name: currentNames[8], value: 3, color: pieColors[8] },
          { name: currentNames[9], value: 2, color: pieColors[9] }
        ],
        creationPrice: 123.45,
        redeemPrice: 98.76
      };
    } else {
      return {
        pie: [
          { name: currentNames[0], value: 20, color: pieColors[0] },
          { name: currentNames[1], value: 18, color: pieColors[1] },
          { name: currentNames[2], value: 15, color: pieColors[2] },
          { name: currentNames[3], value: 12, color: pieColors[3] },
          { name: currentNames[4], value: 10, color: pieColors[4] },
          { name: currentNames[5], value: 8, color: pieColors[5] },
          { name: currentNames[6], value: 6, color: pieColors[6] },
          { name: currentNames[7], value: 4, color: pieColors[7] },
          { name: currentNames[8], value: 3, color: pieColors[8] },
          { name: currentNames[9], value: 2, color: pieColors[9] }
        ],
        creationPrice: 150.12,
        redeemPrice: 110.34
      };
    }
  }

  // Fetch only pie chart data (for radio change)
  async function fetchPieOnly(_date: string, type: 'unit' | 'market') {
    const d = await fetchPieData(_date, type);
    setPieData(d.pie);
  }

  // Fetch all (for date change)
  async function fetchAll(_date: string, type: 'unit' | 'market') {
    const d = await fetchPieData(_date, type);
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
  }

  // On mount, fetch all for today and fund names
  useEffect(() => {
    fetchAll(selectedDate, pieType);
    fetchFundNames();
  }, []);

  // On date change, fetch all (pie + prices)
  useEffect(() => {
    fetchAll(selectedDate, pieType);
  }, [selectedDate]);

  // On pieType (radio) change, fetch only pie chart
  useEffect(() => {
    fetchPieOnly(selectedDate, pieType);
  }, [pieType]);

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
      <div className="home-main-layout" style={{ 
        marginTop: 0, 
        paddingTop: 0, 
        display: 'flex', 
        flexDirection: 'row', 
        height: '100vh', 
        minHeight: 'unset', 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f0abfc 100%)',
        marginBottom: 0
      }}>
        {/* Sidebar left-aligned, fixed width (120px) on desktop only */}
        {!isMobile && (
          <div className="home-sidebar-container">
            <Sidebar />
          </div>
        )}
        {/* Main content area: stack cards vertically */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0', 
          height: '100vh', 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #e0e7ff 0%, #f0abfc 100%)',
          marginBottom: 0,
          paddingTop: '50px'
        }}>
          {/* Unified magical layout card */}
          <div className="home-card magical-bg animated-bg dashboard-main-card" style={{ 
            flex: 0.8, 
            minHeight: 0, 
            marginBottom: 0,
            background: 'transparent',
            boxShadow: 'none',
            border: 'none',
            height: '70vh'
          }}>
            {/* Creation/Redeem section */}
            <div className="dashboard-price-section">
              <div className="dashboard-price-row">
                <span className="dashboard-price-icon dashboard-price-icon-creation">💰</span>
                <div>
                  <div className="dashboard-price-label">Creation Price</div>
                  <div className="dashboard-price-value">LKR {creationDisplay.toFixed(2)}</div>
                </div>
              </div>
              <div className="dashboard-price-row">
                <span className="dashboard-price-icon dashboard-price-icon-redeem">🔄</span>
                <div>
                  <div className="dashboard-price-label">Redeem Price</div>
                  <div className="dashboard-price-value">LKR {redeemDisplay.toFixed(2)}</div>
                </div>
              </div>
            </div>
            {/* Pie chart section */}
            <div className="dashboard-pie-section" style={{ paddingTop: '18px' }}>
              {/* Legend left */}
              <div className="dashboard-pie-legend" style={{ 
                maxHeight: '350px', 
                overflowY: 'auto',
                paddingRight: '18px',
                paddingTop: '240px'
              }}>
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
                          key={`cell-${idx}`}
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
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const entry = payload[0].payload;
                          const total = pieData.reduce((sum, v) => sum + v.value, 0);
                          const percent = total ? ((entry.value / total) * 100).toFixed(1) : 0;
                          return (
                            <div className="dashboard-pie-tooltip">
                              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{entry.name}</div>
                              <div>Percent: <b>{percent}%</b></div>
                              <div>Value: <b>LKR {entry.value.toLocaleString()}</b></div>
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
                  Fund Size
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
          {/* DataTable Card */}
          <div className="home-card magical-bg animated-bg dashboard-table-section" style={{ 
            flex: 1.2, 
            minHeight: 0, 
            marginTop: 4, 
            marginBottom: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'stretch', 
            height: '30vh', 
            borderBottomLeftRadius: 0, 
            borderBottomRightRadius: 0, 
            paddingTop: 4 
          }}>
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
            </div>
            <div className="relative z-10" style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 0, marginTop: 0 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 0 }}>
                <h2 className="font-semibold text-gray-900" style={{ fontSize: 14, padding: '2px 0 2px 0', margin: 0 }}>Fund Data</h2>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-800" style={{ fontSize: 12 }}>
                    {tableTotalCount.toLocaleString()} Records
                  </span>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 0, paddingTop: 0, height: '100%' }}>
                <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                  <DataTable onTotalCountChange={setTableTotalCount} />
                </div>
              </div>
              <span style={{ fontSize: 12, marginTop: 4 }}>Showing {Math.min(2, tableTotalCount)} of {tableTotalCount} results</span>
              <div className="flex items-center space-x-2">
                <button
                  className="px-3 py-1 text-xs font-medium text-gray-500 bg-white rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  disabled={tableTotalCount <= 2}
                >
                  Previous
                </button>
                <button
                  className="px-3 py-1 text-xs font-medium text-gray-500 bg-white rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  disabled={tableTotalCount <= 2}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;