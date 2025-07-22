import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';

// Example icons (can be replaced with SVGs or icon libraries)
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

export default function Home() {
  // Simulate backend value updates with animation
  const [creationPrice, setCreationPrice] = useState(100.00);
  const [redeemPrice, setRedeemPrice] = useState(95.00);

  useEffect(() => {
    // Example: Animate value changes every 3s
    const interval = setInterval(() => {
      setCreationPrice(p => +(p + (Math.random() - 0.5) * 2).toFixed(2));
      setRedeemPrice(p => +(p + (Math.random() - 0.5) * 2).toFixed(2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <div style={{
        margin: 0,
        width: '100vw',
        minHeight: 'calc(100vh - 72px)',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}>
        <div
          style={{
            width: '100%',
            background: 'linear-gradient(120deg, #f0f4ff 0%, #f9e6ff 100%)',
            borderRadius: 0,
            boxShadow: '0 8px 32px 0 rgba(165,180,252,0.10)',
            padding: '2rem 2vw',
            display: 'flex',
            flexDirection: 'row',
            gap: 32,
            justifyContent: 'center',
            alignItems: 'stretch',
            transition: 'box-shadow 0.3s',
            animation: 'fadeInCard 1s cubic-bezier(.4,0,.2,1)',
            marginTop: 24,
          }}
        >
          {/* Creation Price Card */}
          <div style={{
            flex: 1,
            minWidth: 180,
            background: 'linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 100%)',
            borderRadius: 18,
            boxShadow: '0 4px 16px 0 rgba(165,180,252,0.15)',
            padding: '1.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: '#2d2d2d',
            fontWeight: 600,
            fontSize: 20,
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s',
            animation: 'popIn 0.8s cubic-bezier(.4,0,.2,1)',
            minHeight: 120,
          }}>
            {creationIcon}
            <div>
              <div style={{ fontSize: 16, opacity: 0.7 }}>Creation Price</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#4f46e5', transition: 'color 0.3s' }}>
                ${creationPrice.toFixed(2)}
              </div>
            </div>
          </div>
          {/* Redeem Price Card */}
          <div style={{
            flex: 1,
            minWidth: 180,
            background: 'linear-gradient(135deg, #f9e6ff 0%, #f0abfc 100%)',
            borderRadius: 18,
            boxShadow: '0 4px 16px 0 rgba(240,171,252,0.15)',
            padding: '1.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: '#2d2d2d',
            fontWeight: 600,
            fontSize: 20,
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s',
            animation: 'popIn 1.1s cubic-bezier(.4,0,.2,1)',
            minHeight: 120,
          }}>
            {redeemIcon}
            <div>
              <div style={{ fontSize: 16, opacity: 0.7 }}>Redeem Price</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#d946ef', transition: 'color 0.3s' }}>
                ${redeemPrice.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Animations */}
      <style>{`
        @keyframes fadeInCard {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes popIn {
          0% { transform: scale(0.95); opacity: 0; }
          80% { transform: scale(1.03); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 900px) {
          div[style*='display: flex'][style*='flex-direction: row'] {
            flex-direction: column !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 600px) {
          div[style*='background: linear-gradient(120deg, #f0f4ff 0%, #f9e6ff 100%)'] {
            padding: 1rem 0.5rem !important;
            margin-left: 8px !important;
            margin-right: 8px !important;
            border-radius: 12px !important;
          }
        }
      `}</style>
    </>
  );
}
