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
                  fontSize: isMobile ? '14px' : '16px', 
                  fontWeight: '700', 
                  color: '#166534',
                  marginBottom: isMobile ? '4px' : '8px',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}>
                  View Mode
                </div>
                <div style={{
                  position: 'relative',
                  width: isMobile ? '140px' : '180px',
                  height: isMobile ? '40px' : '50px',
                  background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)',
                  borderRadius: isMobile ? '20px' : '25px',
                  padding: '4px',
                  cursor: 'pointer',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '2px solid rgba(34, 197, 94, 0.3)',
                  overflow: 'hidden'
                }} onClick={() => setPieType(pieType === 'unit' ? 'market' : 'unit')}>
                  {/* Background gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                    borderRadius: isMobile ? '18px' : '23px',
                    zIndex: 1
                  }} />
                  
                  {/* Slider with enhanced design */}
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    left: pieType === 'unit' ? '4px' : `calc(100% - ${isMobile ? '36px' : '46px'})`,
                    width: isMobile ? '32px' : '42px',
                    height: isMobile ? '32px' : '42px',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)',
                    borderRadius: isMobile ? '16px' : '21px',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
                    zIndex: 3,
                    border: '1px solid rgba(34, 197, 94, 0.2)'
                  }} />
                  
                  {/* Glow effect for active state */}
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    left: pieType === 'unit' ? '4px' : `calc(100% - ${isMobile ? '36px' : '46px'})`,
                    width: isMobile ? '32px' : '42px',
                    height: isMobile ? '32px' : '42px',
                    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)',
                    borderRadius: isMobile ? '16px' : '21px',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 2
                  }} />
                  
                  {/* Labels with enhanced styling */}
                  <div style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '100%',
                    padding: isMobile ? '0 8px' : '0 16px',
                    zIndex: 4
                  }}>
                    <span style={{
                      fontSize: isMobile ? '12px' : '16px',
                      fontWeight: '800',
                      color: pieType === 'unit' ? '#166534' : '#64748b',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      textShadow: pieType === 'unit' ? '0 1px 3px rgba(0, 0, 0, 0.2)' : 'none',
                      filter: pieType === 'unit' ? 'drop-shadow(0 1px 2px rgba(34, 197, 94, 0.3))' : 'none',
                      transform: pieType === 'unit' ? 'scale(1.05)' : 'scale(1)'
                    }}>
                      Unit Wise
                    </span>
                    <span style={{
                      fontSize: isMobile ? '12px' : '16px',
                      fontWeight: '800',
                      color: pieType === 'market' ? '#166534' : '#64748b',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      textShadow: pieType === 'market' ? '0 1px 3px rgba(0, 0, 0, 0.2)' : 'none',
                      filter: pieType === 'market' ? 'drop-shadow(0 1px 2px rgba(34, 197, 94, 0.3))' : 'none',
                      transform: pieType === 'market' ? 'scale(1.05)' : 'scale(1)'
                    }}>
                  Fund Size
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Spacing between cards */}
            <div style={{ height: isMobile ? '20px' : '60px' }}></div>
            {/* Date section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: isMobile ? '8px' : '16px',
              padding: isMobile ? '12px' : '20px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
              borderRadius: isMobile ? '12px' : '20px',
              backdropFilter: 'blur(15px)',
              border: '2px solid rgba(99, 102, 241, 0.2)',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)',
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              maxWidth: isMobile ? '280px' : '400px',
              margin: '0 auto'
            }}>
              {/* Background glow effect */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                animation: 'pulse 3s ease-in-out infinite'
              }} />
              
              {/* Date label */}
              <div style={{
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: '800',
                color: '#000000',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                marginBottom: '8px',
                position: 'relative',
                zIndex: 2
              }}>
                📅 Date Selection
              </div>
              
              {/* Enhanced date input */}
              <div style={{
                position: 'relative',
                zIndex: 2
              }}>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                max={todayStr}
                  style={{
                    padding: isMobile ? '10px 12px' : '12px 16px',
                    fontSize: isMobile ? '12px' : '14px',
                    fontWeight: '600',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    border: '2px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: isMobile ? '10px' : '12px',
                    color: '#1e293b',
                    cursor: 'pointer',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(99, 102, 241, 0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    outline: 'none',
                    minWidth: isMobile ? '140px' : '160px'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '2px solid #4f46e5';
                    e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(99, 102, 241, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '2px solid rgba(99, 102, 241, 0.3)';
                    e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(99, 102, 241, 0.2)';
                  }}
                />
              </div>
              
              {/* Date display */}
              <div style={{
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '700',
                color: '#000000',
                textAlign: 'center',
                padding: isMobile ? '6px 12px' : '8px 16px',
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                zIndex: 2
              }}>
                {new Date(selectedDate).toLocaleDateString(undefined, { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              
              {/* Decorative elements */}
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '20px',
                height: '20px',
                background: 'linear-gradient(45deg, #4f46e5, #8b5cf6)',
                borderRadius: '50%',
                opacity: 0.6
              }} />
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                width: '15px',
                height: '15px',
                background: 'linear-gradient(45deg, #8b5cf6, #4f46e5)',
                borderRadius: '50%',
                opacity: 0.4
              }} />
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