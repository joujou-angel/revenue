import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { NewContract } from './pages/NewContract';
import { Login } from './pages/Login';
import { Installments } from './pages/Installments';
import { Clients } from './pages/Clients';
import { ClientDetails } from './pages/ClientDetails';
import { Contracts } from './pages/Contracts';
import { AgentRewards } from './pages/AgentRewards';
import { RequireAuth } from './components/RequireAuth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <RequireAuth>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/contracts/new" element={<NewContract />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/clients/:id" element={<ClientDetails />} />
                  <Route path="/contracts" element={<Contracts />} />
                  <Route path="/agent-rewards" element={<AgentRewards />} />
                  <Route path="/installments" element={<Installments />} />
                </Routes>
              </Layout>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
