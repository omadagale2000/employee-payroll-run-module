import { useState } from 'react';
import Header from './components/Header';
import PayrollDashboard from './pages/PayrollDashboard';
import AttendanceDashboard from './pages/AttendanceDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('payroll');

  return (
    <>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {activeTab === 'payroll' && <PayrollDashboard />}
        {activeTab === 'attendance' && <AttendanceDashboard />}
      </main>
    </>
  );
}
