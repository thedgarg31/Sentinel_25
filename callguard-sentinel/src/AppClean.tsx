import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import global styles
import './styles/globals.css';

// Import layout
import Layout from './components/Layout';

// Import pages
import Dashboard from './pages/Dashboard';
import AdvancedDashboard from './pages/AdvancedDashboardFixed';
import Auth from './pages/Auth';
import Dialer from './pages/DialerFixed';
import CallScreen from './pages/CallScreenFixed';
import Contacts from './pages/ContactsFixed';
import CallHistory from './pages/CallHistory';
import NotFound from './pages/NotFound';

// Import new components
import ReverseLookup from './components/ReverseLookup';
import EmergencySystem from './components/EmergencySystem';
import AICallAssistant from './components/AICallAssistant';

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<AdvancedDashboard />} />
            <Route path="/dashboard" element={<AdvancedDashboard />} />
            <Route path="/dashboard-classic" element={<Dashboard />} />
            
            {/* Core Features */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/dialer" element={<Dialer />} />
            <Route path="/call" element={<CallScreenFixed />} />
            <Route path="/contacts" element={<ContactsFixed />} />
            <Route path="/history" element={<CallHistory />} />
            
            {/* Advanced Features */}
            <Route path="/lookup" element={<ReverseLookup />} />
            <Route path="/emergency" element={<EmergencySystem />} />
            <Route path="/ai-assistant" element={<AICallAssistant />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
