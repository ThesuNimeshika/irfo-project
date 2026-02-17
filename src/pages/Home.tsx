import Navbar, { Footer } from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
  { name: 'Ceylon Money Market Fund', value: 15, color: pieColors[0] },
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
  // Toggle tooltip state
  const [showToggleTooltip, setShowToggleTooltip] = useState(false);

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

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [isTablet, setIsTablet] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 768 && window.innerWidth <= 1024 : false);

  // Update responsive states on resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    handleResize(); // Call immediately
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
        flexDirection: isMobile ? 'column' : 'row', 
        height: '100vh', 
        minHeight: 'unset', 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f0abfc 100%)',
        marginBottom: 0
      }}>
        {/* Sidebar left-aligned, fixed width on desktop only */}
        {!isMobile && (
          <div className="home-sidebar-container" style={{
            width: isTablet ? '100px' : '120px',
            flexShrink: 0
          }}>
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
          paddingTop: isMobile ? '60px' : isTablet ? '55px' : '50px',
          paddingLeft: '0px',
          paddingRight: '0px'
        }}>
          {/* Unified magical layout card */}
          <div className="home-card magical-bg animated-bg dashboard-main-card" style={{ 
            flex: isMobile ? '1' : '0.8', 
            minHeight: 0, 
            marginBottom: 0,
            background: 'transparent',
            boxShadow: 'none',
            border: 'none',
            height: isMobile ? 'auto' : '70vh',
            width: '100%'
          }}>
            {/* Pie chart section */}
            <div className="dashboard-pie-section" style={{ 
              paddingTop: isMobile ? '20px' : isTablet ? '25px' : '35px', 
              paddingBottom: '20px', 
              position: 'relative', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '100%',
              paddingLeft: isMobile ? '10px' : isTablet ? '15px' : '20px',
              paddingRight: isMobile ? '10px' : isTablet ? '15px' : '20px',
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              {/* Legend right - only show if fund names are short */}
              {pieData.some(entry => entry.name.length <= 15) && (
                <div className="dashboard-pie-legend" style={{ 
                  maxHeight: isMobile ? '120px' : isTablet ? '170px' : '190px', 
                  overflowY: 'auto',
                  paddingLeft: isMobile ? '20px' : isTablet ? '35px' : '38px',
                  paddingTop: '0px',
                  width: isMobile ? '100%' : isTablet ? '220px' : '250px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  marginBottom: isMobile ? '10px' : '0'
                }}>
                {pieData.map((entry) => (
                    <div key={entry.name} className="dashboard-pie-legend-row" style={{ textAlign: 'left', marginBottom: '8px', width: '100%', display: 'flex', alignItems: 'center' }}>
                      <span className="dashboard-pie-legend-color" style={{ background: entry.color, display: 'inline-block', width: '12px', height: '12px', borderRadius: '2px', flexShrink: 0, marginRight: '8px' }}></span>
                      <span className="dashboard-pie-legend-label" style={{ fontSize: isMobile ? '12px' : '14px', wordBreak: 'break-word', maxWidth: isMobile ? '150px' : '200px' }}>{entry.name}</span>
                  </div>
                ))}
              </div>
              )}
              {/* Pie chart center */}
              <div className="dashboard-pie-chart" style={{ 
                marginRight: pieData.some(entry => entry.name.length <= 15) ? (isMobile ? '0' : '20px') : 'auto',
                width: isMobile ? '100%' : 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <ResponsiveContainer width={isMobile ? "90%" : "80%"} height={isMobile ? 200 : 220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={isMobile ? 80 : 110}
                      innerRadius={isMobile ? 40 : 60}
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
                              <div style={{ fontWeight: 700, fontSize: isMobile ? 14 : 18, marginBottom: 4 }}>{entry.name}</div>
                              <div>Percent: <b>{percent}%</b></div>
                              {pieType === 'unit' ? (
                                <div>Units: <b>{entry.value.toLocaleString()}</b></div>
                              ) : (
                                <div>Value: <b>LKR {entry.value.toLocaleString()}</b></div>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Toggle switch for pie type selection */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: isMobile ? '8px' : '12px',
                cursor: 'help',
                position: 'relative',
                marginLeft: pieData.some(entry => entry.name.length <= 15) ? (isMobile ? '0' : '10px') : 'auto',
                marginRight: pieData.some(entry => entry.name.length <= 15) ? '0' : 'auto',
                paddingRight: isMobile ? '10px' : '30px',
                marginTop: isMobile ? '15px' : '0'
              }}
                onMouseEnter={() => setShowToggleTooltip(true)}
                onMouseLeave={() => setShowToggleTooltip(false)}
              >
                {/* Custom tooltip */}
                {showToggleTooltip && createPortal(
                  <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0, 0, 0, 0.9)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: isMobile ? '10px' : '12px',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    zIndex: 99999999999,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    You can switch the pie chart data between fund size wise and unit wise from this switch
                  </div>,
                  document.body
                )}
                <div style={{ 
                  fontSize: isMobile ? '11px' : '12px', 
                  fontWeight: '700', 
                  color: '#1e3a8a',
                  marginBottom: isMobile ? '4px' : '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  textShadow: 'none'
                }}>
                  View Mode
                </div>
                <div style={{
                  position: 'relative',
                  width: isMobile ? '140px' : '180px',
                  height: isMobile ? '38px' : '46px',
                  background: 'linear-gradient(145deg, #eef2fb 0%, #e0e7ff 100%)',
                  borderRadius: isMobile ? '19px' : '23px',
                  padding: '4px',
                  cursor: 'pointer',
                  boxShadow: 'inset 0 2px 4px rgba(30,58,138,0.10), 0 4px 14px rgba(30,58,138,0.14)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1.5px solid rgba(30, 58, 138, 0.22)',
                  overflow: 'hidden'
                }} onClick={() => setPieType(pieType === 'unit' ? 'market' : 'unit')}>
                  {/* Background gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(30,58,138,0.07) 0%, rgba(46,79,173,0.07) 100%)',
                    borderRadius: isMobile ? '17px' : '21px',
                    zIndex: 1
                  }} />
                  
                  {/* Slider knob */}
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    left: pieType === 'unit' ? '4px' : `calc(100% - ${isMobile ? '34px' : '42px'})`,
                    width: isMobile ? '30px' : '38px',
                    height: isMobile ? '30px' : '38px',
                    background: 'linear-gradient(145deg, #ffffff 0%, #eef2fb 100%)',
                    borderRadius: '50%',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 3px 10px rgba(30,58,138,0.22), inset 0 1px 2px rgba(255,255,255,0.95)',
                    zIndex: 3,
                    border: '1px solid rgba(30,58,138,0.15)'
                  }} />
                  
                  {/* Knob glow */}
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    left: pieType === 'unit' ? '4px' : `calc(100% - ${isMobile ? '34px' : '42px'})`,
                    width: isMobile ? '30px' : '38px',
                    height: isMobile ? '30px' : '38px',
                    background: 'radial-gradient(circle, rgba(30,58,138,0.18) 0%, transparent 70%)',
                    borderRadius: '50%',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 2
                  }} />
                  
                  {/* Labels */}
                  <div style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '100%',
                    padding: isMobile ? '0 8px' : '0 14px',
                    zIndex: 4
                  }}>
                    <span style={{
                      fontSize: isMobile ? '10px' : '11px',
                      fontWeight: '800',
                      color: pieType === 'unit' ? '#1e3a8a' : '#9ca3af',
                      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                      textShadow: 'none',
                      filter: 'none',
                      transform: pieType === 'unit' ? 'scale(1.05)' : 'scale(1)',
                      letterSpacing: '0.03em'
                    }}>
                      Unit
                    </span>
                    <span style={{
                      fontSize: isMobile ? '10px' : '11px',
                      fontWeight: '800',
                      color: pieType === 'market' ? '#1e3a8a' : '#9ca3af',
                      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                      textShadow: 'none',
                      filter: 'none',
                      transform: pieType === 'market' ? 'scale(1.05)' : 'scale(1)',
                      letterSpacing: '0.03em'
                    }}>
                  Fund
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Spacing between pie and date card */}
            <div style={{ height: isMobile ? '12px' : '32px' }}></div>
            {/* Date Selection Card — glassy professional design */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: isMobile ? '10px' : '14px',
              padding: isMobile ? '16px 18px' : '22px 28px',
              background: 'rgba(255, 255, 255, 0.72)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              borderRadius: isMobile ? '14px' : '18px',
              border: '1px solid rgba(30, 58, 138, 0.14)',
              boxShadow: '0 4px 24px rgba(30, 58, 138, 0.10), 0 1px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.85)',
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              maxWidth: isMobile ? '260px' : '320px',
              margin: '0 auto'
            }}>
              {/* Subtle glass shimmer */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '50%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)',
                borderRadius: '18px 18px 0 0',
                pointerEvents: 'none',
                zIndex: 0
              }} />
              {/* Subtle corner accent */}
              <div style={{
                position: 'absolute',
                top: '-30px', right: '-30px',
                width: '90px', height: '90px',
                background: 'radial-gradient(circle, rgba(30,58,138,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0
              }} />
              
              {/* Header row: icon + label */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                position: 'relative',
                zIndex: 1,
                width: '100%',
                justifyContent: 'center',
                borderBottom: '1px solid rgba(30,58,138,0.08)',
                paddingBottom: isMobile ? '8px' : '10px'
              }}>
                <span style={{
                  fontSize: isMobile ? '15px' : '17px',
                  lineHeight: 1
                }}>📅</span>
                <span style={{
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: '700',
                  color: '#1e3a8a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  fontFamily: "'Lato', system-ui, sans-serif"
                }}>
                  Date Selection
                </span>
              </div>
              
              {/* Date input */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  max={todayStr}
                  style={{
                    padding: isMobile ? '8px 12px' : '9px 14px',
                    fontSize: isMobile ? '13px' : '14px',
                    fontWeight: '600',
                    background: '#ffffff',
                    border: '1.5px solid rgba(30,58,138,0.22)',
                    borderRadius: '8px',
                    color: '#1f2937',
                    cursor: 'pointer',
                    boxShadow: '0 1px 4px rgba(30,58,138,0.08)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    outline: 'none',
                    width: '100%',
                    fontFamily: "'Lato', system-ui, sans-serif"
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1.5px solid #1e3a8a';
                    e.target.style.boxShadow = '0 0 0 3px rgba(30,58,138,0.12), 0 1px 4px rgba(30,58,138,0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1.5px solid rgba(30,58,138,0.22)';
                    e.target.style.boxShadow = '0 1px 4px rgba(30,58,138,0.08)';
                  }}
                />
              </div>
              
              {/* Formatted date display */}
              <div style={{
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: '700',
                color: '#1e3a8a',
                textAlign: 'center',
                padding: isMobile ? '6px 14px' : '7px 18px',
                background: 'rgba(30,58,138,0.06)',
                borderRadius: '7px',
                border: '1px solid rgba(30,58,138,0.10)',
                position: 'relative',
                zIndex: 1,
                width: '100%',
                fontFamily: "'Lato', system-ui, sans-serif",
                letterSpacing: '0.01em'
              }}>
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
          {/* DataTable Card */}
          <div className="home-card magical-bg animated-bg dashboard-table-section" style={{ 
            flex: isMobile ? '0.8' : '1.2', 
            minHeight: 0, 
            marginTop: 4, 
            marginBottom: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'stretch', 
            height: isMobile ? 'auto' : '30vh', 
            borderBottomLeftRadius: 0, 
            borderBottomRightRadius: 0, 
            paddingTop: 4,
            width: '100%',
            paddingLeft: '0px',
            paddingRight: '0px'
          }}>
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
            </div>
            <DataTable />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;