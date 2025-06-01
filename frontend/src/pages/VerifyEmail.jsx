import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const VerifyEmail = () => {
  const [message, setMessage] = useState('Verifying your email...');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      setIsLoading(true);
      
      if (!token) {
        setMessage('Invalid verification link');
        setIsSuccess(false);
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`${BASE_URL}user/verify_email/?token=${token}`, {
          method: 'GET',
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setMessage('Email verified successfully! You can now log in.');
          setIsSuccess(true);
        } else {
          setMessage(data.message || 'Verification failed. Please try again.');
          setIsSuccess(false);
        }
      } catch (error) {
        setMessage('An error occurred during verification. Please try again later.');
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyToken();
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className={`text-2xl font-bold mb-4 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {isLoading ? (
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f97316]"></div>
            ) : isSuccess ? (
              '✓'
            ) : (
              '!'
            )}
          </div>
          <h2 className="text-xl font-semibold mb-6">{message}</h2>
          {isSuccess && (
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-[#f97316] text-white py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-[#ea580c]"
            >
              Go to Login
            </button>
          )}
          {!isSuccess && !isLoading && (
            <button
              onClick={() => navigate('/register')}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl text-lg font-semibold mt-4 hover:bg-gray-300"
            >
              Go to Registration
            </button>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VerifyEmail;