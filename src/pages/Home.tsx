
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import '../App.css';



export default function Home() {
  // Simulate backend value updates with animation
  const [creationPrice, setCreationPrice] = useState(100.00);
  const [redeemPrice, setRedeemPrice] = useState(95.00);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 900 : false);

  // Animate value changes every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setCreationPrice(p => +(p + (Math.random() - 0.5) * 2).toFixed(2));
      setRedeemPrice(p => +(p + (Math.random() - 0.5) * 2).toFixed(2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Update isMobile on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const creationIcon = (
    <span style={{
      display: 'inline-block',
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #a5b4fc 0%, #f0abfc 100%)',
      color: '#fff',
      fontSize: 24,
      lineHeight: '40px',
      textAlign: 'center',
      boxShadow: '0 2px 8px 0 rgba(165,180,252,0.15)',
      marginRight: 16,
    }}>💰</span>
  );
  const redeemIcon = (
    <span style={{
      display: 'inline-block',
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #f0abfc 0%, #a5b4fc 100%)',
      color: '#fff',
      fontSize: 24,
      lineHeight: '40px',
      textAlign: 'center',
      boxShadow: '0 2px 8px 0 rgba(240,171,252,0.15)',
      marginRight: 16,
    }}>🔄</span>
  );

  return (
    <>
      <div className="navbar-fixed-wrapper">
        <Navbar />
      </div>
      {/* Mobile menu icon and sidebar removed for mobile view */}
      <div className="home-main-layout">
        {/* Sidebar left-aligned, fixed width (120px) on desktop only */}
        {!isMobile && (
          <div className="home-sidebar-container">
            <Sidebar />
          </div>
        )}
        {/* Main content */}
        <div className="home-main-content">
          <div className="home-cards-container">
            {/* Creation Price Card */}
            <div className="home-card home-card-creation">
              {creationIcon}
              <div>
                <div className="home-card-title">Creation Price</div>
                <div className="home-card-value creation">${creationPrice.toFixed(2)}</div>
              </div>
            </div>
            {/* Redeem Price Card */}
            <div className="home-card home-card-redeem">
              {redeemIcon}
              <div>
                <div className="home-card-title">Redeem Price</div>
                <div className="home-card-value redeem">${redeemPrice.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Animations and Responsive Styles moved to App.css */}
    </>
  );
}
