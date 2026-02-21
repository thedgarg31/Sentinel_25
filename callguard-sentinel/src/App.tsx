import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import global styles
import './styles/professional.css';

// Import layout
import ProfessionalLayout from './components/ProfessionalLayout';

// Import pages
import Dashboard from './pages/Dashboard';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import ImprovedPhoneDialer from './pages/ImprovedPhoneDialer';
import EnhancedCallScreen from './pages/EnhancedCallScreen';
import ProfessionalContacts from './pages/ProfessionalContacts';
import ProfessionalCallHistory from './pages/ProfessionalCallHistory';
import ProfessionalReverseLookup from './pages/ProfessionalReverseLookup';
import ProfessionalEmergency from './pages/ProfessionalEmergency';
import ProfessionalAIAssistant from './pages/ProfessionalAIAssistant';
import ProfessionalSettings from './pages/ProfessionalSettings';
import Auth from './pages/Auth';
import Dialer from './pages/Dialer';
import CallScreen from './pages/CallScreen';
import Contacts from './pages/Contacts';
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
        <ProfessionalLayout>
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<ProfessionalDashboard />} />
            <Route path="/dashboard" element={<ProfessionalDashboard />} />
            <Route path="/dashboard-classic" element={<Dashboard />} />
            
            {/* Core Features */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/dialer" element={<ImprovedPhoneDialer />} />
            <Route path="/call" element={<EnhancedCallScreen />} />
            <Route path="/contacts" element={<ProfessionalContacts />} />
            <Route path="/history" element={<ProfessionalCallHistory />} />
            <Route path="/settings" element={<ProfessionalSettings />} />
            
            {/* Advanced Features */}
            <Route path="/lookup" element={<ProfessionalReverseLookup />} />
            <Route path="/emergency" element={<ProfessionalEmergency />} />
            <Route path="/ai-assistant" element={<ProfessionalAIAssistant />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ProfessionalLayout>
        
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
