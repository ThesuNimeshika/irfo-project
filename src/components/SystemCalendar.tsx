import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface CalendarDate {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isHoliday: boolean;
  isWeekend: boolean;
  isSelected: boolean;
}

interface SystemCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date | null;
}

interface HolidayWeekendEntry {
  id: string;
  date: string;
  description: string;
  type: 'holiday' | 'weekend';
}

const SystemCalendar: React.FC<SystemCalendarProps> = ({ isOpen, onClose, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDates, setCalendarDates] = useState<CalendarDate[]>([]);
  const [holidays, setHolidays] = useState<Set<string>>(new Set());
  const [weekends, setWeekends] = useState<Set<string>>(new Set());
  const [holidayWeekendList, setHolidayWeekendList] = useState<HolidayWeekendEntry[]>([
    { id: '1', date: '2024-01-01', description: 'New Year Day', type: 'holiday' },
    { id: '2', date: '2024-01-15', description: 'Working Day', type: 'weekend' },
    { id: '3', date: '2024-02-14', description: 'Valentine Day', type: 'holiday' },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(null);
  const [newEntry, setNewEntry] = useState({ date: '', description: '', type: 'holiday' as 'holiday' | 'weekend' });
  const [dateModalDescription, setDateModalDescription] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const dates: CalendarDate[] = [];
    const today = new Date();
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const isWeekendDay = date.getDay() === 0 || date.getDay() === 6;
      const listItem = holidayWeekendList.find(item => item.date === dateString);
      dates.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        isHoliday: holidays.has(dateString) || listItem?.type === 'holiday',
        isWeekend: isWeekendDay || listItem?.type === 'weekend',
        isSelected: selectedDate ? date.toDateString() === selectedDate.toDateString() : false,
      });
    }
    setCalendarDates(dates);
  }, [currentDate, isOpen, holidays, selectedDate, holidayWeekendList]);

  const handleDateClick = (date: Date) => {
    setSelectedDateForModal(date);
    setDateModalDescription('');
    setShowDateModal(true);
  };

  const handleAddFromModal = (type: 'holiday' | 'weekend') => {
    if (selectedDateForModal && dateModalDescription.trim()) {
      const dateString = selectedDateForModal.toISOString().split('T')[0];
      const newItem: HolidayWeekendEntry = { id: Date.now().toString(), date: dateString, description: dateModalDescription.trim(), type };
      setHolidayWeekendList(prev => [...prev, newItem]);
      if (type === 'holiday') setHolidays(prev => new Set([...prev, dateString]));
      else setWeekends(prev => new Set([...prev, dateString]));
      setShowDateModal(false);
      setSelectedDateForModal(null);
      setDateModalDescription('');
    }
  };

  const toggleHoliday = (date: Date) => {
    const s = date.toISOString().split('T')[0];
    const h = new Set(holidays);
    if (h.has(s)) h.delete(s); else h.add(s);
    setHolidays(h);
  };

  const toggleWeekend = (date: Date) => {
    const s = date.toISOString().split('T')[0];
    const w = new Set(weekends);
    if (w.has(s)) w.delete(s); else w.add(s);
    setWeekends(w);
  };

  const addHolidayWeekend = () => {
    if (newEntry.date && newEntry.description) {
      const newItem: HolidayWeekendEntry = { id: Date.now().toString(), ...newEntry };
      setHolidayWeekendList(prev => [...prev, newItem]);
      if (newEntry.type === 'holiday') setHolidays(prev => new Set([...prev, newEntry.date]));
      else setWeekends(prev => new Set([...prev, newEntry.date]));
      setNewEntry({ date: '', description: '', type: 'holiday' });
      setShowAddForm(false);
    }
  };

  const removeHolidayWeekend = (id: string) => {
    const item = holidayWeekendList.find(i => i.id === id);
    if (item) {
      setHolidayWeekendList(prev => prev.filter(i => i.id !== id));
      if (item.type === 'holiday') setHolidays(prev => { const s = new Set(prev); s.delete(item.date); return s; });
      else setWeekends(prev => { const s = new Set(prev); s.delete(item.date); return s; });
    }
  };

  const navigateMonth = (dir: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + (dir === 'prev' ? -1 : 1));
      return d;
    });
  };

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  if (!isOpen) return null;

  const getDayStyle = (dateObj: CalendarDate): React.CSSProperties => {
    if (dateObj.isSelected) return {
      background: 'linear-gradient(135deg,#1e3a8a,#2e4fad)',
      color: '#fff',
      boxShadow: '0 4px 14px rgba(30,58,138,0.35)',
      border: '1.5px solid #1e3a8a',
    };
    if (dateObj.isToday) return {
      background: 'linear-gradient(135deg,#3b82f6,#60a5fa)',
      color: '#fff',
      boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
      border: '1.5px solid #3b82f6',
    };
    if (dateObj.isHoliday) return {
      background: 'rgba(239,68,68,0.09)',
      color: dateObj.isCurrentMonth ? '#b91c1c' : '#fca5a5',
      border: '1.5px solid rgba(239,68,68,0.22)',
    };
    if (dateObj.isWeekend) return {
      background: 'rgba(251,191,36,0.11)',
      color: dateObj.isCurrentMonth ? '#92400e' : '#fde68a',
      border: '1.5px solid rgba(251,191,36,0.26)',
    };
    if (!dateObj.isCurrentMonth) return {
      background: 'transparent', color: '#d1d5db', border: '1.5px solid transparent',
    };
    return {
      background: 'rgba(255,255,255,0.70)',
      color: '#1f2937',
      border: '1.5px solid rgba(0,0,0,0.06)',
    };
  };

  return createPortal(
    <>
      <style>{`
        @keyframes sc-in {
          from { opacity:0; transform:scale(0.96) translateY(10px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        .sc-modal { animation: sc-in 0.22s cubic-bezier(0.34,1.4,0.64,1) both; }

        .sc-day {
          aspect-ratio:1; display:flex; align-items:center; justify-content:center;
          border-radius:10px; cursor:pointer; font-size:13px; font-weight:700;
          transition:all 0.16s ease; position:relative;
          font-family:'Lato',system-ui,sans-serif; user-select:none;
        }
        .sc-day:hover { transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.10) !important; filter:brightness(0.97); }

        .sc-nav {
          width:32px; height:32px; border-radius:8px;
          border:1.5px solid rgba(30,58,138,0.14);
          background:rgba(255,255,255,0.80); color:#1e3a8a;
          font-size:15px; font-weight:700; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:all 0.15s; backdrop-filter:blur(8px);
        }
        .sc-nav:hover { background:#1e3a8a; color:#fff; box-shadow:0 4px 12px rgba(30,58,138,0.28); }

        .sc-entry {
          display:flex; align-items:center; justify-content:space-between;
          padding:9px 11px; border-radius:8px; margin-bottom:5px; transition:all 0.14s;
        }
        .sc-entry:hover { transform:translateX(2px); }

        .sc-x {
          width:22px; height:22px; border-radius:50%; border:none;
          background:rgba(0,0,0,0.07); color:#6b7280;
          font-size:15px; cursor:pointer; display:flex;
          align-items:center; justify-content:center; transition:all 0.14s; flex-shrink:0;
        }
        .sc-x:hover { background:#fee2e2; color:#b91c1c; }

        .sc-input {
          width:100%; padding:7px 10px;
          border:1.5px solid rgba(0,0,0,0.10); border-radius:7px;
          background:rgba(255,255,255,0.92); color:#1f2937;
          font-size:12px; font-family:'Lato',system-ui,sans-serif;
          box-sizing:border-box; outline:none; transition:all 0.14s;
        }
        .sc-input:focus { border-color:#1e3a8a; box-shadow:0 0 0 3px rgba(30,58,138,0.09); }

        .sc-primary {
          padding:7px 16px; border-radius:7px; border:none;
          background:linear-gradient(135deg,#1e3a8a,#2e4fad);
          color:#fff; font-size:12px; font-weight:700;
          cursor:pointer; transition:all 0.14s;
          font-family:'Lato',system-ui,sans-serif;
          box-shadow:0 2px 8px rgba(30,58,138,0.22);
        }
        .sc-primary:hover { box-shadow:0 4px 14px rgba(30,58,138,0.36); transform:translateY(-1px); }

        .sc-ghost {
          padding:7px 16px; border-radius:7px;
          border:1.5px solid rgba(0,0,0,0.10);
          background:rgba(255,255,255,0.70); color:#4b5563;
          font-size:12px; font-weight:700; cursor:pointer;
          transition:all 0.14s; font-family:'Lato',system-ui,sans-serif;
        }
        .sc-ghost:hover { border-color:#1e3a8a; color:#1e3a8a; }

        .sc-hol-btn {
          flex:1; padding:8px 12px; border-radius:7px; cursor:pointer;
          font-size:12px; font-weight:700; transition:all 0.14s;
          font-family:'Lato',system-ui,sans-serif; display:flex;
          align-items:center; justify-content:center; gap:6px;
          border:1.5px solid rgba(239,68,68,0.22);
          background:rgba(239,68,68,0.07); color:#b91c1c;
        }
        .sc-hol-btn:hover:not(:disabled) { background:rgba(239,68,68,0.15); }
        .sc-hol-btn:disabled { opacity:0.4; cursor:not-allowed; }

        .sc-wkd-btn {
          flex:1; padding:8px 12px; border-radius:7px; cursor:pointer;
          font-size:12px; font-weight:700; transition:all 0.14s;
          font-family:'Lato',system-ui,sans-serif; display:flex;
          align-items:center; justify-content:center; gap:6px;
          border:1.5px solid rgba(251,191,36,0.26);
          background:rgba(251,191,36,0.09); color:#92400e;
        }
        .sc-wkd-btn:hover:not(:disabled) { background:rgba(251,191,36,0.18); }
        .sc-wkd-btn:disabled { opacity:0.4; cursor:not-allowed; }

        .sc-scroll { scrollbar-width:thin; scrollbar-color:rgba(0,0,0,0.08) transparent; }
        .sc-scroll::-webkit-scrollbar { width:4px; }
        .sc-scroll::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.08); border-radius:4px; }

        .sc-layout { display:flex; flex:1; overflow:hidden; min-height:0; }
        .sc-left  { flex:1; padding:20px; border-right:1px solid rgba(0,0,0,0.06); overflow-y:auto; }
        .sc-right { width:320px; flex-shrink:0; padding:16px; overflow-y:auto; background:rgba(248,250,252,0.75); }

        @media (max-width:860px) {
          .sc-layout { flex-direction:column; overflow-y:auto; }
          .sc-left  { border-right:none; border-bottom:1px solid rgba(0,0,0,0.06); padding:14px; }
          .sc-right { width:100%; padding:14px; }
        }
        @media (max-width:480px) {
          .sc-day { font-size:11px; border-radius:7px; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:'fixed', inset:0,
          background:'rgba(15,23,42,0.45)',
          backdropFilter:'blur(5px)',
          zIndex:99999,
          display:'flex', alignItems:'center', justifyContent:'center',
          padding:16,
        }}
      >
        {/* Modal shell */}
        <div
          className="sc-modal"
          onClick={e => e.stopPropagation()}
          style={{
            background:'rgba(255,255,255,0.93)',
            backdropFilter:'blur(24px)',
            WebkitBackdropFilter:'blur(24px)',
            borderRadius:18,
            boxShadow:'0 32px 80px rgba(0,0,0,0.14), 0 0 0 1px rgba(255,255,255,0.80) inset',
            border:'1px solid rgba(255,255,255,0.65)',
            width:'95vw', maxWidth:1060,
            maxHeight:'92vh',
            display:'flex', flexDirection:'column',
            overflow:'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            padding:'12px 18px',
            display:'flex', alignItems:'center', justifyContent:'space-between',
            borderBottom:'1px solid rgba(0,0,0,0.07)',
            background:'rgba(255,255,255,0.55)',
            backdropFilter:'blur(10px)',
            flexShrink:0,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{
                width:34, height:34, borderRadius:9,
                background:'linear-gradient(135deg,#1e3a8a,#2e4fad)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 4px 12px rgba(30,58,138,0.28)', fontSize:17,
              }}>📅</div>
              <div>
                <div style={{ fontSize:14, fontWeight:800, color:'#0d1117', fontFamily:"'Playfair Display',Georgia,serif" }}>
                  System Calendar
                </div>
                <div style={{ fontSize:10, color:'#9ca3af', fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase' }}>
                  Manage holidays &amp; weekends
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width:30, height:30, borderRadius:7,
                border:'1.5px solid rgba(0,0,0,0.09)',
                background:'rgba(255,255,255,0.80)',
                color:'#6b7280', fontSize:18, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.14s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='#fee2e2'; e.currentTarget.style.color='#b91c1c'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.80)'; e.currentTarget.style.color='#6b7280'; }}
            >×</button>
          </div>

          {/* Body */}
          <div className="sc-layout sc-scroll">

            {/* LEFT — Calendar */}
            <div className="sc-left sc-scroll">

              {/* Month navigation */}
              <div style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                marginBottom:14, padding:'10px 14px',
                background:'rgba(255,255,255,0.65)',
                borderRadius:12, border:'1px solid rgba(0,0,0,0.06)',
                backdropFilter:'blur(8px)',
              }}>
                <button className="sc-nav" onClick={() => navigateMonth('prev')}>‹</button>
                <span style={{ fontSize:15, fontWeight:800, color:'#0d1117', fontFamily:"'Playfair Display',Georgia,serif" }}>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <button className="sc-nav" onClick={() => navigateMonth('next')}>›</button>
              </div>

              {/* Day name headers */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:5, marginBottom:6 }}>
                {dayNames.map(d => (
                  <div key={d} style={{
                    textAlign:'center', fontSize:10, fontWeight:800,
                    color: d==='Sun'||d==='Sat' ? '#f97316' : '#9ca3af',
                    letterSpacing:'0.07em', textTransform:'uppercase', padding:'3px 0',
                  }}>{d}</div>
                ))}
              </div>

              {/* Date grid */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:5 }}>
                {calendarDates.map((dateObj, i) => (
                  <div
                    key={i}
                    className="sc-day"
                    style={getDayStyle(dateObj)}
                    onClick={() => handleDateClick(dateObj.date)}
                    onContextMenu={e => { e.preventDefault(); toggleHoliday(dateObj.date); }}
                    onDoubleClick={e => { e.preventDefault(); toggleWeekend(dateObj.date); }}
                    title={`${dateObj.date.toDateString()}\nClick: Add entry  |  Right-click: Toggle holiday  |  Dbl-click: Toggle weekend`}
                  >
                    {dateObj.date.getDate()}
                    {dateObj.isHoliday && <span style={{ position:'absolute', top:2, right:3, fontSize:7 }}>🔴</span>}
                    {dateObj.isWeekend && !dateObj.isHoliday && <span style={{ position:'absolute', top:2, right:3, fontSize:7 }}>🟡</span>}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div style={{
                marginTop:14, padding:'9px 14px',
                background:'rgba(255,255,255,0.55)',
                borderRadius:10, border:'1px solid rgba(0,0,0,0.06)',
                display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center',
              }}>
                {[
                  { bg:'linear-gradient(135deg,#3b82f6,#60a5fa)', label:'Today' },
                  { bg:'linear-gradient(135deg,#1e3a8a,#2e4fad)', label:'Selected' },
                  { bg:'rgba(239,68,68,0.12)', label:'Holiday', border:'1.5px solid rgba(239,68,68,0.25)' },
                  { bg:'rgba(251,191,36,0.14)', label:'Weekend', border:'1.5px solid rgba(251,191,36,0.30)' },
                ].map(l => (
                  <div key={l.label} style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <div style={{ width:11, height:11, borderRadius:4, background:l.bg, border:l.border||'none' }} />
                    <span style={{ fontSize:10, fontWeight:700, color:'#6b7280' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Management */}
            <div className="sc-right sc-scroll">

              {/* Panel header */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <span style={{ fontSize:12, fontWeight:800, color:'#0d1117' }}>Holiday &amp; Weekend</span>
                <button
                  className={showAddForm ? 'sc-ghost' : 'sc-primary'}
                  onClick={() => setShowAddForm(!showAddForm)}
                  style={{ fontSize:11, padding:'5px 11px' }}
                >
                  {showAddForm ? 'Cancel' : '+ Add New'}
                </button>
              </div>

              {/* Add form */}
              {showAddForm && (
                <div style={{
                  background:'rgba(255,255,255,0.85)',
                  borderRadius:10, padding:13, marginBottom:13,
                  border:'1.5px solid rgba(30,58,138,0.11)',
                  boxShadow:'0 2px 12px rgba(0,0,0,0.05)',
                }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                    <div>
                      <label style={{ fontSize:10, fontWeight:700, color:'#9ca3af', display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.06em' }}>Date</label>
                      <input className="sc-input" type="date" value={newEntry.date} onChange={e => setNewEntry(p => ({ ...p, date:e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize:10, fontWeight:700, color:'#9ca3af', display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.06em' }}>Description</label>
                      <input className="sc-input" type="text" placeholder="Enter description" value={newEntry.description} onChange={e => setNewEntry(p => ({ ...p, description:e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize:10, fontWeight:700, color:'#9ca3af', display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.06em' }}>Type</label>
                      <select className="sc-input" value={newEntry.type} onChange={e => setNewEntry(p => ({ ...p, type:e.target.value as 'holiday'|'weekend' }))}>
                        <option value="holiday">Holiday</option>
                        <option value="weekend">Weekend</option>
                      </select>
                    </div>
                    <button className="sc-primary" onClick={addHolidayWeekend} style={{ marginTop:2 }}>Add Entry</button>
                  </div>
                </div>
              )}

              {/* This year holidays */}
              <div style={{ marginBottom:12 }}>
                <div style={{
                  display:'flex', alignItems:'center', gap:6, marginBottom:8,
                  padding:'5px 9px', background:'rgba(239,68,68,0.05)',
                  borderRadius:7, border:'1px solid rgba(239,68,68,0.11)',
                }}>
                  <span style={{ fontSize:9 }}>🔴</span>
                  <span style={{ fontSize:10, fontWeight:800, color:'#b91c1c', textTransform:'uppercase', letterSpacing:'0.07em' }}>
                    {new Date().getFullYear()} Holidays
                  </span>
                </div>
                <div style={{ maxHeight:120, overflowY:'auto' }} className="sc-scroll">
                  {(() => {
                    const yr = new Date().getFullYear().toString();
                    const list = holidayWeekendList.filter(i => i.date.startsWith(yr) && i.type==='holiday');
                    if (!list.length) return (
                      <div style={{ textAlign:'center', color:'#d1d5db', fontSize:11, padding:'14px 0' }}>
                        No holidays for {yr} yet
                      </div>
                    );
                    return list.map(item => (
                      <div key={item.id} className="sc-entry" style={{ background:'rgba(239,68,68,0.05)', border:'1px solid rgba(239,68,68,0.12)' }}>
                        <div>
                          <div style={{ fontSize:12, fontWeight:700, color:'#1f2937' }}>{item.description}</div>
                          <div style={{ fontSize:10, color:'#9ca3af', marginTop:1 }}>{item.date}</div>
                        </div>
                        <button className="sc-x" onClick={() => removeHolidayWeekend(item.id)}>×</button>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* All entries */}
              <div>
                <div style={{
                  display:'flex', alignItems:'center', gap:6, marginBottom:8,
                  padding:'5px 9px', background:'rgba(30,58,138,0.04)',
                  borderRadius:7, border:'1px solid rgba(30,58,138,0.09)',
                }}>
                  <span style={{ fontSize:9 }}>📋</span>
                  <span style={{ fontSize:10, fontWeight:800, color:'#1e3a8a', textTransform:'uppercase', letterSpacing:'0.07em' }}>All Entries</span>
                </div>
                <div style={{ maxHeight:200, overflowY:'auto' }} className="sc-scroll">
                  {holidayWeekendList.length === 0 ? (
                    <div style={{ textAlign:'center', color:'#d1d5db', fontSize:11, padding:'20px 0' }}>No entries yet</div>
                  ) : holidayWeekendList.map(item => (
                    <div
                      key={item.id}
                      className="sc-entry"
                      style={{
                        background: item.type==='holiday' ? 'rgba(239,68,68,0.05)' : 'rgba(251,191,36,0.07)',
                        border:`1px solid ${item.type==='holiday' ? 'rgba(239,68,68,0.11)' : 'rgba(251,191,36,0.18)'}`,
                      }}
                    >
                      <div>
                        <div style={{ fontSize:12, fontWeight:700, color:'#1f2937' }}>{item.description}</div>
                        <div style={{ fontSize:10, color:'#9ca3af', marginTop:1 }}>
                          {item.date} &bull;{' '}
                          <span style={{ color:item.type==='holiday'?'#b91c1c':'#92400e', fontWeight:700 }}>{item.type}</span>
                        </div>
                      </div>
                      <button className="sc-x" onClick={() => removeHolidayWeekend(item.id)}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding:'10px 18px',
            display:'flex', gap:8, justifyContent:'flex-end',
            borderTop:'1px solid rgba(0,0,0,0.07)',
            background:'rgba(255,255,255,0.55)',
            backdropFilter:'blur(8px)',
            flexShrink:0,
          }}>
            <button className="sc-ghost" onClick={onClose}>Close</button>
            <button className="sc-primary">Save Changes</button>
          </div>
        </div>
      </div>

      {/* Date click mini-modal */}
      {showDateModal && selectedDateForModal && createPortal(
        <div
          onClick={() => { setShowDateModal(false); setSelectedDateForModal(null); setDateModalDescription(''); }}
          style={{
            position:'fixed', inset:0,
            background:'rgba(15,23,42,0.55)',
            backdropFilter:'blur(6px)',
            zIndex:999999,
            display:'flex', alignItems:'center', justifyContent:'center',
            padding:16,
          }}
        >
          <div
            className="sc-modal"
            onClick={e => e.stopPropagation()}
            style={{
              background:'rgba(255,255,255,0.96)',
              backdropFilter:'blur(20px)',
              borderRadius:14,
              boxShadow:'0 24px 64px rgba(0,0,0,0.16), 0 0 0 1px rgba(255,255,255,0.80) inset',
              border:'1px solid rgba(255,255,255,0.70)',
              width:'90vw', maxWidth:380, padding:22,
            }}
          >
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:'#0d1117' }}>Add Entry</div>
                <div style={{ fontSize:10, color:'#9ca3af', marginTop:2 }}>{selectedDateForModal.toDateString()}</div>
              </div>
              <button
                className="sc-x"
                style={{ width:26, height:26 }}
                onClick={() => { setShowDateModal(false); setSelectedDateForModal(null); setDateModalDescription(''); }}
              >×</button>
            </div>

            <label style={{ fontSize:10, fontWeight:700, color:'#9ca3af', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em' }}>
              Description
            </label>
            <input
              className="sc-input"
              type="text"
              value={dateModalDescription}
              onChange={e => setDateModalDescription(e.target.value)}
              placeholder="e.g. New Year Day, Company Holiday"
              style={{ marginBottom:14 }}
              onKeyDown={e => { if (e.key==='Enter' && dateModalDescription.trim()) handleAddFromModal('holiday'); }}
              autoFocus
            />

            <div style={{ display:'flex', gap:8 }}>
              <button className="sc-hol-btn" disabled={!dateModalDescription.trim()} onClick={() => handleAddFromModal('holiday')}>
                🔴 Add as Holiday
              </button>
              <button className="sc-wkd-btn" disabled={!dateModalDescription.trim()} onClick={() => handleAddFromModal('weekend')}>
                🟡 Mark Weekend
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>,
    document.body
  );
};

export default SystemCalendar;