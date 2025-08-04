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

const SystemCalendar: React.FC<SystemCalendarProps> = ({
  isOpen,
  onClose,
  selectedDate
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDates, setCalendarDates] = useState<CalendarDate[]>([]);
  const [holidays, setHolidays] = useState<Set<string>>(new Set());
  const [weekends, setWeekends] = useState<Set<string>>(new Set());
  const [holidayWeekendList, setHolidayWeekendList] = useState<HolidayWeekendEntry[]>([
    { id: '1', date: '2024-01-01', description: 'New Year Day', type: 'holiday' },
    { id: '2', date: '2024-01-15', description: 'Working Day', type: 'weekend' },
    { id: '3', date: '2024-02-14', description: 'Valentine Day', type: 'holiday' }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(null);
  const [newEntry, setNewEntry] = useState({
    date: '',
    description: '',
    type: 'holiday' as 'holiday' | 'weekend'
  });
  const [dateModalDescription, setDateModalDescription] = useState('');

  // Generate calendar dates for current month
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
       const isWeekend = date.getDay() === 0 || date.getDay() === 6;
       
       // Check if date is in holiday/weekend list
       const listItem = holidayWeekendList.find(item => item.date === dateString);
       const isHolidayFromList = listItem?.type === 'holiday';
       const isWeekendFromList = listItem?.type === 'weekend';
       
       dates.push({
         date,
         isCurrentMonth: date.getMonth() === month,
         isToday: date.toDateString() === today.toDateString(),
         isHoliday: holidays.has(dateString) || isHolidayFromList,
         isWeekend: isWeekend || isWeekendFromList,
         isSelected: selectedDate ? date.toDateString() === selectedDate.toDateString() : false
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
      
      const newItem: HolidayWeekendEntry = {
        id: Date.now().toString(),
        date: dateString,
        description: dateModalDescription.trim(),
        type: type
      };
      
      setHolidayWeekendList(prev => [...prev, newItem]);
      
      // Update the calendar sets
      if (type === 'holiday') {
        setHolidays(prev => new Set([...prev, dateString]));
      } else {
        setWeekends(prev => new Set([...prev, dateString]));
      }
      
      // Close modal and reset
      setShowDateModal(false);
      setSelectedDateForModal(null);
      setDateModalDescription('');
    }
  };

  const toggleHoliday = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const newHolidays = new Set(holidays);
    
    if (newHolidays.has(dateString)) {
      newHolidays.delete(dateString);
    } else {
      newHolidays.add(dateString);
    }
    
    setHolidays(newHolidays);
  };

  const toggleWeekend = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const newWeekends = new Set(weekends);
    
    if (newWeekends.has(dateString)) {
      newWeekends.delete(dateString);
    } else {
      newWeekends.add(dateString);
    }
    
    setWeekends(newWeekends);
  };

  const addHolidayWeekend = () => {
    if (newEntry.date && newEntry.description) {
      const newItem: HolidayWeekendEntry = {
        id: Date.now().toString(),
        date: newEntry.date,
        description: newEntry.description,
        type: newEntry.type
      };
      setHolidayWeekendList(prev => [...prev, newItem]);
      
      // Update the calendar sets
      if (newEntry.type === 'holiday') {
        setHolidays(prev => new Set([...prev, newEntry.date]));
      } else {
        setWeekends(prev => new Set([...prev, newEntry.date]));
      }
      
      // Reset form
      setNewEntry({ date: '', description: '', type: 'holiday' });
      setShowAddForm(false);
    }
  };

  const removeHolidayWeekend = (id: string) => {
    const item = holidayWeekendList.find(item => item.id === id);
    if (item) {
      setHolidayWeekendList(prev => prev.filter(item => item.id !== id));
      
      // Remove from calendar sets
      if (item.type === 'holiday') {
        setHolidays(prev => {
          const newSet = new Set(prev);
          newSet.delete(item.date);
          return newSet;
        });
      } else {
        setWeekends(prev => {
          const newSet = new Set(prev);
          newSet.delete(item.date);
          return newSet;
        });
      }
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (!isOpen) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      zIndex: 999999999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      isolation: 'isolate'
    }}
    onClick={onClose}
    >
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '90vw',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'hidden',
        position: 'relative'
      }}
      onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '24px' }}>📅</span>
            <div>
              <h2 style={{ 
                color: 'white', 
                margin: 0, 
                fontSize: '20px', 
                fontWeight: 'bold' 
              }}>
                System Calendar
              </h2>
              <p style={{ 
                color: 'rgba(255,255,255,0.8)', 
                margin: 0, 
                fontSize: '14px' 
              }}>
                Manage holidays and weekends
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            ×
          </button>
        </div>

        {/* Calendar Navigation */}
        <div style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.05)'
        }}>
          <button
            onClick={() => navigateMonth('prev')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            ‹
          </button>
          <h3 style={{ 
            color: 'white', 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: 'bold' 
          }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            ›
          </button>
        </div>

        {/* Calendar Grid */}
        <div style={{ padding: '0 20px 20px' }}>
          {/* Day Headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            marginBottom: '10px'
          }}>
            {dayNames.map(day => (
              <div key={day} style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px',
                fontWeight: 'bold',
                padding: '8px'
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Dates */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px'
          }}>
            {calendarDates.map((dateObj, index) => (
              <div
                key={index}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  background: dateObj.isSelected 
                    ? 'rgba(255,255,255,0.9)' 
                    : dateObj.isToday 
                    ? 'rgba(255,255,255,0.3)' 
                    : dateObj.isHoliday 
                    ? 'rgba(255,107,107,0.8)' 
                    : dateObj.isWeekend 
                    ? 'rgba(255,193,7,0.3)' 
                    : dateObj.isCurrentMonth 
                    ? 'rgba(255,255,255,0.1)' 
                    : 'rgba(255,255,255,0.05)',
                  color: dateObj.isSelected 
                    ? '#333' 
                    : dateObj.isCurrentMonth 
                    ? 'white' 
                    : 'rgba(255,255,255,0.5)',
                  border: dateObj.isToday ? '2px solid rgba(255,255,255,0.8)' : 'none'
                }}
                onClick={() => handleDateClick(dateObj.date)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleHoliday(dateObj.date);
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  toggleWeekend(dateObj.date);
                }}
                title={`${dateObj.date.toDateString()}\nRight-click: Toggle holiday\nDouble-click: Toggle weekend`}
              >
                {dateObj.date.getDate()}
                {dateObj.isHoliday && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    fontSize: '8px',
                    color: 'white'
                  }}>
                    🎉
                  </span>
                )}
                {dateObj.isWeekend && !dateObj.isHoliday && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    fontSize: '8px',
                    color: 'white'
                  }}>
                    🌅
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Holiday/Weekend Management */}
        <div style={{
          padding: '15px 20px',
          background: 'rgba(255,255,255,0.05)',
          borderTop: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h4 style={{ 
              color: 'white', 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: 'bold' 
            }}>
              Holiday & Weekend Management
            </h4>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                padding: '6px 12px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              {showAddForm ? 'Cancel' : 'Add New'}
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '15px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr auto',
                gap: '10px',
                alignItems: 'end'
              }}>
                <div>
                  <label style={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    fontSize: '12px', 
                    marginBottom: '4px',
                    display: 'block'
                  }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: '12px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    fontSize: '12px', 
                    marginBottom: '4px',
                    display: 'block'
                  }}>
                    Description
                  </label>
                  <input
                    type="text"
                    value={newEntry.description}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter description"
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: '12px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    fontSize: '12px', 
                    marginBottom: '4px',
                    display: 'block'
                  }}>
                    Type
                  </label>
                  <select
                    value={newEntry.type}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, type: e.target.value as 'holiday' | 'weekend' }))}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: '12px'
                    }}
                  >
                    <option value="holiday">Holiday</option>
                    <option value="weekend">Weekend</option>
                  </select>
                </div>
                <button
                  onClick={addHolidayWeekend}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(76, 175, 80, 0.8)',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(76, 175, 80, 1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(76, 175, 80, 0.8)'}
                >
                  Add
                </button>
              </div>
            </div>
          )}

                     {/* Current Year Holidays Section */}
           <div style={{
             marginTop: '15px',
             padding: '10px',
             background: 'rgba(255,255,255,0.05)',
             borderRadius: '6px'
           }}>
             <h5 style={{ 
               color: 'white', 
               margin: '0 0 10px 0', 
               fontSize: '14px', 
               fontWeight: 'bold' 
             }}>
               {new Date().getFullYear()} Holidays
             </h5>
             <div style={{
               maxHeight: '100px',
               overflowY: 'auto'
             }}>
               {(() => {
                 const currentYear = new Date().getFullYear();
                 const currentYearHolidays = holidayWeekendList.filter(item => 
                   item.date.startsWith(currentYear.toString()) && item.type === 'holiday'
                 );
                 
                 if (currentYearHolidays.length === 0) {
                   return (
                     <div style={{ 
                       color: 'rgba(255,255,255,0.6)', 
                       textAlign: 'center', 
                       fontSize: '11px',
                       padding: '10px'
                     }}>
                       No holidays for {currentYear} yet
                     </div>
                   );
                 }
                 
                 return currentYearHolidays.map(item => (
                   <div key={item.id} style={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     padding: '6px',
                     marginBottom: '3px',
                     background: 'rgba(255,107,107,0.2)',
                     borderRadius: '4px',
                     border: '1px solid rgba(255,107,107,0.4)'
                   }}>
                     <div style={{ flex: 1 }}>
                       <div style={{ 
                         color: 'white', 
                         fontSize: '11px', 
                         fontWeight: 'bold' 
                       }}>
                         {item.description}
                       </div>
                       <div style={{ 
                         color: 'rgba(255,255,255,0.7)', 
                         fontSize: '9px' 
                       }}>
                         {item.date}
                       </div>
                     </div>
                   </div>
                 ));
               })()}
             </div>
           </div>

           {/* Existing List */}
           <div style={{
             marginTop: '15px',
             maxHeight: '120px',
             overflowY: 'auto',
             background: 'rgba(255,255,255,0.05)',
             borderRadius: '6px',
             padding: '10px'
           }}>
             <h5 style={{ 
               color: 'white', 
               margin: '0 0 10px 0', 
               fontSize: '14px', 
               fontWeight: 'bold' 
             }}>
               All Entries
             </h5>
             {holidayWeekendList.length === 0 ? (
               <div style={{ 
                 color: 'rgba(255,255,255,0.6)', 
                 textAlign: 'center', 
                 fontSize: '12px',
                 padding: '20px'
               }}>
                 No holidays/weekends added yet
               </div>
             ) : (
               holidayWeekendList.map(item => (
                 <div key={item.id} style={{
                   display: 'flex',
                   justifyContent: 'space-between',
                   alignItems: 'center',
                   padding: '8px',
                   marginBottom: '5px',
                   background: item.type === 'holiday' 
                     ? 'rgba(255,107,107,0.2)' 
                     : 'rgba(255,193,7,0.2)',
                   borderRadius: '4px',
                   border: `1px solid ${item.type === 'holiday' 
                     ? 'rgba(255,107,107,0.4)' 
                     : 'rgba(255,193,7,0.4)'}`
                 }}>
                   <div style={{ flex: 1 }}>
                     <div style={{ 
                       color: 'white', 
                       fontSize: '12px', 
                       fontWeight: 'bold' 
                     }}>
                       {item.description}
                     </div>
                     <div style={{ 
                       color: 'rgba(255,255,255,0.7)', 
                       fontSize: '10px' 
                     }}>
                       {item.date} • {item.type}
                     </div>
                   </div>
                   <button
                     onClick={() => removeHolidayWeekend(item.id)}
                     style={{
                       background: 'rgba(255,255,255,0.2)',
                       border: 'none',
                       borderRadius: '50%',
                       width: '20px',
                       height: '20px',
                       color: 'white',
                       cursor: 'pointer',
                       fontSize: '12px',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       transition: 'all 0.2s ease'
                     }}
                     onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                     onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                   >
                     ×
                   </button>
                 </div>
               ))
             )}
           </div>
        </div>

        {/* Legend */}
        <div style={{
          padding: '15px 20px',
          background: 'rgba(255,255,255,0.05)',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          justifyContent: 'space-around',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.3)'
            }}></div>
            <span>Today</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'rgba(255,193,7,0.3)'
            }}></div>
            <span>Weekend</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'rgba(255,107,107,0.8)'
            }}></div>
            <span>Holiday</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          padding: '15px 20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'center'
        }}>
          <button
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            Close
          </button>
                 </div>
       </div>

       {/* Date Selection Modal */}
       {showDateModal && selectedDateForModal && createPortal(
         <div style={{
           position: 'fixed',
           top: 0,
           left: 0,
           right: 0,
           bottom: 0,
           background: 'rgba(0,0,0,0.7)',
           zIndex: 9999999999,
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           padding: '20px',
           isolation: 'isolate'
         }}
         onClick={() => {
           setShowDateModal(false);
           setSelectedDateForModal(null);
           setDateModalDescription('');
         }}
         >
           <div style={{
             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
             borderRadius: '16px',
             boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
             width: '90vw',
             maxWidth: '400px',
             padding: '24px',
             position: 'relative'
           }}
           onClick={e => e.stopPropagation()}
           >
             <div style={{
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between',
               marginBottom: '20px'
             }}>
               <h3 style={{ 
                 color: 'white', 
                 margin: 0, 
                 fontSize: '18px', 
                 fontWeight: 'bold' 
               }}>
                 Add Date: {selectedDateForModal.toDateString()}
               </h3>
               <button
                 onClick={() => {
                   setShowDateModal(false);
                   setSelectedDateForModal(null);
                   setDateModalDescription('');
                 }}
                 style={{
                   background: 'rgba(255,255,255,0.2)',
                   border: 'none',
                   borderRadius: '50%',
                   width: '32px',
                   height: '32px',
                   color: 'white',
                   fontSize: '18px',
                   cursor: 'pointer',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   transition: 'all 0.2s ease'
                 }}
                 onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                 onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
               >
                 ×
               </button>
             </div>

             <div style={{ marginBottom: '20px' }}>
               <label style={{ 
                 color: 'rgba(255,255,255,0.9)', 
                 fontSize: '14px', 
                 marginBottom: '8px',
                 display: 'block',
                 fontWeight: 'bold'
               }}>
                 Description
               </label>
               <input
                 type="text"
                 value={dateModalDescription}
                 onChange={(e) => setDateModalDescription(e.target.value)}
                 placeholder="Enter description (e.g., New Year Day, Company Holiday)"
                 style={{
                   width: '100%',
                   padding: '12px 16px',
                   border: '1px solid rgba(255,255,255,0.3)',
                   borderRadius: '8px',
                   background: 'rgba(255,255,255,0.1)',
                   color: 'white',
                   fontSize: '14px',
                   boxSizing: 'border-box'
                 }}
                 onKeyPress={(e) => {
                   if (e.key === 'Enter' && dateModalDescription.trim()) {
                     handleAddFromModal('holiday');
                   }
                 }}
               />
             </div>

             <div style={{
               display: 'flex',
               gap: '12px',
               justifyContent: 'center'
             }}>
               <button
                 onClick={() => handleAddFromModal('holiday')}
                 disabled={!dateModalDescription.trim()}
                 style={{
                   padding: '12px 24px',
                   background: dateModalDescription.trim() 
                     ? 'rgba(255,107,107,0.8)' 
                     : 'rgba(255,255,255,0.2)',
                   border: 'none',
                   borderRadius: '8px',
                   color: 'white',
                   cursor: dateModalDescription.trim() ? 'pointer' : 'not-allowed',
                   fontSize: '14px',
                   fontWeight: 'bold',
                   transition: 'all 0.2s ease',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '8px'
                 }}
                 onMouseEnter={e => {
                   if (dateModalDescription.trim()) {
                     e.currentTarget.style.background = 'rgba(255,107,107,1)';
                   }
                 }}
                 onMouseLeave={e => {
                   if (dateModalDescription.trim()) {
                     e.currentTarget.style.background = 'rgba(255,107,107,0.8)';
                   }
                 }}
               >
                 <span style={{ fontSize: '16px' }}>🎉</span>
                 Add as Holiday
               </button>
               <button
                 onClick={() => handleAddFromModal('weekend')}
                 disabled={!dateModalDescription.trim()}
                 style={{
                   padding: '12px 24px',
                   background: dateModalDescription.trim() 
                     ? 'rgba(255,193,7,0.8)' 
                     : 'rgba(255,255,255,0.2)',
                   border: 'none',
                   borderRadius: '8px',
                   color: 'white',
                   cursor: dateModalDescription.trim() ? 'pointer' : 'not-allowed',
                   fontSize: '14px',
                   fontWeight: 'bold',
                   transition: 'all 0.2s ease',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '8px'
                 }}
                 onMouseEnter={e => {
                   if (dateModalDescription.trim()) {
                     e.currentTarget.style.background = 'rgba(255,193,7,1)';
                   }
                 }}
                 onMouseLeave={e => {
                   if (dateModalDescription.trim()) {
                     e.currentTarget.style.background = 'rgba(255,193,7,0.8)';
                   }
                 }}
               >
                 <span style={{ fontSize: '16px' }}>🌅</span>
                 Mark as Weekend
               </button>
             </div>
           </div>
         </div>,
         document.body
       )}
     </div>,
     document.body
   );
 };

export default SystemCalendar; 