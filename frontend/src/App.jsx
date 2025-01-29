import { useState } from 'react';
import AppRoutes from './routes/AppRoutes';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login state

  return <AppRoutes isAuthenticated={isAuthenticated} />;
}

export default App
