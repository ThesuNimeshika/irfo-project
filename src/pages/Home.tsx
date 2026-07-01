import Navbar, { Footer } from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import '../App.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import DataTable from '../components/DataTable';

type PieEntry = { name: string; value: number; color: string };

const pieColors = [
  '#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#fb923c',
  '#eab308', '#22c55e', '#14b8a6', '#0ea5e9', '#8b5cf6',
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
  { name: 'Part J', value: 2, color: pieColors[9] },
];



function Home() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [pieType, setPieType] = useState<'unit' | 'market'>('unit');
  const [pieData, setPieData] = useState<PieEntry[]>(defaultPieData);


  async function fetchFundNames() {
    try {
      const res = await fetch('http://localhost:5095/api/dashboard/funds/names');
      if (!res.ok) throw new Error();
      const names: string[] = await res.json();
      setPieData(prev => prev.map((item, i) => ({ ...item, name: names[i] || item.name })));
    } catch { /* backend offline — use defaults */ }
  }

  async function fetchPieData(_date: string, type: 'unit' | 'market') {
    const names = pieData.map(d => d.name);
    const vals = type === 'unit' ? [15, 12, 10, 8, 7, 6, 5, 4, 3, 2] : [20, 18, 15, 12, 10, 8, 6, 4, 3, 2];
    return { pie: vals.map((v, i) => ({ name: names[i], value: v, color: pieColors[i] })) };
  }

  async function fetchAll(d: string, t: 'unit' | 'market') {
    const r = await fetchPieData(d, t);
    setPieData(r.pie);
  }

  useEffect(() => { fetchAll(selectedDate, pieType); fetchFundNames(); }, []);
  useEffect(() => { fetchAll(selectedDate, pieType); }, [selectedDate]);
  useEffect(() => { fetchAll(selectedDate, pieType); }, [pieType]);

  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(() => window.innerWidth > 768 && window.innerWidth <= 1024);
  useEffect(() => {
    const fn = () => { const w = window.innerWidth; setIsMobile(w <= 768); setIsTablet(w > 768 && w <= 1024); };
    fn(); window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const total = pieData.reduce((s, v) => s + v.value, 0);
  const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  /* ──────────────────────────────────────────── */
  return (
    <>
      <div className="navbar-fixed-wrapper"><Navbar /></div>
      {!isMobile && <Sidebar />}

      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        height: '100vh',
        overflow: 'hidden',
        background: '#f8fafc',
        paddingTop: 54, // push content below navbar
        boxSizing: 'border-box',
      }}>
        {/* Sidebar */}
        {!isMobile && (
          <div style={{ width: 188, minWidth: 188, flexShrink: 0 }} />
        )}

        {/* ── Content column ── */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          padding: isMobile ? '10px 8px 30px' : isTablet ? '12px 12px 30px' : '16px 20px 30px',
          gap: 16,
        }}>

          {/* ── Row 1: Pie card + Date/Toggle card ── */}
          <div style={{
            display: 'flex',
            gap: 16,
            flexShrink: 0,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
          }}>

            {/* ── Pie chart card ── */}
            <div style={{
              flex: '1 1 0',
              background: '#fff',
              borderRadius: 20,
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
              border: '1.5px solid #f0f0f0',
              padding: isMobile ? '12px 10px 10px' : '14px 20px 14px',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isMobile ? 16 : 32,
              overflow: 'hidden',
              position: 'relative',
            }}>
              {/* Decorative corner */}
              <div style={{
                position: 'absolute', top: -30, right: -30,
                width: 120, height: 120, borderRadius: '50%',
                background: 'linear-gradient(135deg, #e0e7ff 0%, #fce7f3 100%)',
                opacity: 0.5, pointerEvents: 'none',
              }} />

              {/* Left: Legend in 2-column grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4px 12px',
                flex: '0 0 auto',
                width: isMobile ? '100%' : 280,
                order: isMobile ? 2 : 0,
                paddingTop: 4,
              }}>
                {/* Legend header spanning both columns */}
                <div style={{
                  gridColumn: '1 / -1',
                  fontSize: 11, fontWeight: 800, color: '#6366f1',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  display: 'flex', alignItems: 'center', gap: 6,
                  marginBottom: 6,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: '#6366f1' }} />
                  Fund Distribution
                </div>
                {pieData.map((entry, i) => (
                  <div key={entry.name} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 8px', borderRadius: 8,
                    background: activeIndex === i ? entry.color + '18' : '#fafafa',
                    border: `1px solid ${activeIndex === i ? entry.color + '44' : '#f0f0f0'}`,
                    transition: 'all 0.2s',
                    cursor: 'default',
                    minWidth: 0,
                  }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: 3, flexShrink: 0,
                      background: entry.color,
                      boxShadow: activeIndex === i ? `0 0 5px ${entry.color}` : 'none',
                    }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#374151', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{entry.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: entry.color, flexShrink: 0, marginLeft: 2 }}>
                      {total ? ((entry.value / total) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Centre: Donut — fixed width balanced next to legend */}
              <div style={{ width: isMobile ? '100%' : 280, flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', order: 1, position: 'relative' }}>
                {/* Center-hole label — shows hovered slice info or total */}
                <div style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                  zIndex: 2,
                  transition: 'all 0.2s',
                }}>
                  {activeIndex !== null ? (
                    <>
                      <div style={{
                        fontSize: 22, fontWeight: 900, lineHeight: 1,
                        color: pieData[activeIndex]?.color ?? '#111',
                        transition: 'color 0.2s',
                      }}>
                        {total ? ((pieData[activeIndex].value / total) * 100).toFixed(1) : 0}%
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', marginTop: 3, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {pieData[activeIndex]?.name}
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 20, fontWeight: 900, color: '#111827', lineHeight: 1 }}>{pieData.length}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', marginTop: 3 }}>Funds</div>
                    </>
                  )}
                </div>
                <ResponsiveContainer width="100%" height={isMobile ? 160 : 190}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%" cy="50%"
                      outerRadius={isMobile ? 70 : 85}
                      innerRadius={isMobile ? 36 : 50}
                      isAnimationActive
                      animationDuration={800}
                      key={pieType}
                      onMouseLeave={() => setActiveIndex(null)}
                      paddingAngle={2}
                    >
                      {pieData.map((entry, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={entry.color}
                          stroke={activeIndex === idx ? entry.color : '#fff'}
                          strokeWidth={activeIndex === idx ? 3 : 2}
                          style={{
                            filter: activeIndex === idx ? `drop-shadow(0 4px 10px ${entry.color}90)` : 'none',
                            transition: 'filter 0.2s',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={() => setActiveIndex(idx)}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload?.length) {
                          const e = payload[0].payload;
                          const pct = total ? ((e.value / total) * 100).toFixed(1) : 0;
                          return (
                            <div style={{
                              background: '#fff',
                              border: `1.5px solid ${e.color}44`,
                              borderRadius: 12, padding: '10px 14px',
                              boxShadow: `0 8px 24px ${e.color}30`,
                            }}>
                              <div style={{ fontWeight: 800, fontSize: 13, color: e.color, marginBottom: 4 }}>{e.name}</div>
                              <div style={{ fontSize: 12, color: '#6b7280' }}>Share: <b style={{ color: '#111' }}>{pct}%</b></div>
                              <div style={{ fontSize: 12, color: '#6b7280' }}>
                                {pieType === 'unit' ? 'Units' : 'Value'}: <b style={{ color: '#111' }}>{pieType === 'market' ? 'LKR ' : ''}{e.value.toLocaleString()}</b>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Right column: Toggle + Date ── */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              minWidth: isMobile ? '100%' : 220,
              order: isMobile ? 3 : 2,
            }}>
              {/* View Mode card */}
              <div style={{
                background: '#fff',
                borderRadius: 16,
                border: '1.5px solid #f0f0f0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                padding: '8px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: '#a855f7' }} />
                  View Mode
                </div>
                {/* Toggle */}
                <div
                  onClick={() => setPieType(pieType === 'unit' ? 'market' : 'unit')}
                  style={{
                    position: 'relative', width: '100%', height: 28,
                    background: '#f1f5f9',
                    borderRadius: 16, cursor: 'pointer',
                    border: '1.5px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 2, bottom: 2,
                    width: 'calc(50% - 2px)',
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    left: pieType === 'unit' ? 2 : 'calc(50%)',
                    transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)',
                    boxShadow: '0 2px 8px rgba(99,102,241,0.40)',
                  }} />
                  <div style={{ position: 'relative', display: 'flex', height: '100%', zIndex: 1 }}>
                    {['Unit', 'Fund'].map((label, i) => (
                      <span key={label} style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 800,
                        color: (i === 0 && pieType === 'unit') || (i === 1 && pieType === 'market') ? '#fff' : '#6b7280',
                        transition: 'color 0.2s',
                      }}>{label}</span>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>
                  {pieType === 'unit' ? 'Showing by unit count' : 'Showing by fund value'}
                </div>
              </div>

              {/* Date Selection card */}
              <div style={{
                background: '#fff',
                borderRadius: 16,
                border: '1.5px solid #f0f0f0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                padding: '8px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Corner accent */}
                <div style={{
                  position: 'absolute', bottom: -20, right: -20,
                  width: 90, height: 90, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e0f2fe, #ddd6fe)',
                  opacity: 0.8, pointerEvents: 'none',
                }} />
                <div style={{ fontSize: 11, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14 }}>📅</span> Date Selection
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  max={todayStr}
                  onChange={e => setSelectedDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '5px 10px',
                    borderRadius: 8,
                    border: '1.5px solid #e2e8f0',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#1e293b',
                    background: '#f8fafc',
                    outline: 'none',
                    fontFamily: "'Lato', system-ui, sans-serif",
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px #6366f120'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
                <div style={{
                  background: 'linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%)',
                  borderRadius: 8,
                  border: '1.5px solid #e0e7ff',
                  padding: '6px 12px',
                  textAlign: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#4338ca',
                  letterSpacing: '0.01em',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  {formattedDate}
                </div>
              </div>
            </div>
          </div>

          {/* ── Row 3: Data table ── */}
          <div style={{
            flex: 1,
            minHeight: 0,
            background: '#fff',
            borderRadius: 20,
            border: '1.5px solid #f0f0f0',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}>
            {/* Rainbow top strip */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 4,
              background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 35%, #ec4899 65%, #f43f5e 100%)',
              zIndex: 2,
              pointerEvents: 'none',
            }} />
            <div style={{ flex: 1, overflow: 'auto', paddingTop: 8 }}>
              <DataTable />
            </div>
          </div>

        </div>
      </div>

      <Footer />

      <style>{`
        /* ── Scrollbar inside legend ── */
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </>
  );
}

export default Home;