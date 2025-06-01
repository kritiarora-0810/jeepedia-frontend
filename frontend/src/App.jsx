import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginRegister from './pages/LoginRegister';
import ContactUs from './pages/ContactUs';

import JeeRankPredictor from './pages/JeeRankPredictor';
import CommunityPage from './pages/CommunityPage';
import NewPost from './components/Community/NewPost';
import PostDetail from './components/Community/PostDetail';
import DashboardPage from './pages/DashboardPage';
import FeedbackForm from './pages/Feedback';

import SubscriptionOverview from './pages/SubscriptionOverview';
import PrePayment from './pages/PrePayment';
import SubscriptionSuccess from './pages/SubscriptionSuccess';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login-register" element={<LoginRegister />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/jee-predictor" element={<JeeRankPredictor />} />

        <Route path="/dashboard" element={<DashboardPage />} />


        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/new-post" element={<NewPost />} />
        <Route path="/post/:slug" element={<PostDetail />} />

        <Route path="/subscribe" element={<SubscriptionOverview />} />
        <Route path="/pre-payment" element={<PrePayment />} />
        <Route path="/subscription-success" element={<SubscriptionSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;

