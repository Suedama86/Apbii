import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { AppBuilder } from './components/AppBuilder';

const App = () => {
  const [view, setView] = useState<'landing' | 'builder'>('landing');

  return (
    <>
      {view === 'landing' ? (
        <LandingPage onStart={() => setView('builder')} />
      ) : (
        <AppBuilder onBack={() => setView('landing')} />
      )}
    </>
  );
};

export default App;
