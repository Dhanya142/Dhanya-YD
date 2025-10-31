import React, { useState } from 'react';
import { InitialLandingPage } from './pages/InitialLandingPage';
import { MainPage } from './pages/MainPage';

const App: React.FC = () => {
  const [appStarted, setAppStarted] = useState(false);

  if (!appStarted) {
    return <InitialLandingPage onGetStarted={() => setAppStarted(true)} />;
  }

  return <MainPage />;
};

export default App;
