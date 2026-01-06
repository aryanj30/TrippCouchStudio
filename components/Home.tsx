
import React from 'react';
import Hero from './Hero';
import DigitalAdvertising from './DigitalAdvertising';
import Services from './Services';
import StatsAndFooter from './StatsAndFooter';

interface HomeProps {
  onNavigate: (page: string) => void;
  onContactClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onContactClick }) => {
  return (
    <>
      <Hero onContactClick={onContactClick} />
      <DigitalAdvertising onNavigate={onNavigate} />
      <Services />
      <StatsAndFooter onNavigate={onNavigate} onContactClick={onContactClick} />
    </>
  );
};

export default Home;
