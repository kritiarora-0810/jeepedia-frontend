
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaKey, FaLock, FaCheckCircle } from 'react-icons/fa';
import { BASE_URL } from '../config';


const ForgotPassword = ({ onBackToLogin, initialEmail }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(initialEmail || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    },
    exit: { opacity: 0, y: -20 }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}user/forgot-password/`, {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        setStep(2);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}user/verify-otp/`, {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        setStep(3);
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}user/reset-password/`, {
        method: 'POST',
        body: JSON.stringify({ email, otp, new_password: newPassword }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => onBackToLogin(), 2000);
      } else {
        setError(data.message || 'Password reset failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full"
  >
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl font-bold text-[#50483b]">
        {step === 1 && 'Forgot Password'}
        {step === 2 && 'Verify OTP'}
        {step === 3 && 'Reset Password'}
      </h2>
      <button
        onClick={onBackToLogin}
        className="text-sm text-[#f97316] hover:underline"
      >
        Back to Login
      </button>
    </div>

    <AnimatePresence mode='wait'>
        {!success ? (
          <motion.form
            key={step}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
            onSubmit={
              step === 1 ? handleSendOTP :
              step === 2 ? handleVerifyOTP :
              handleResetPassword
            }
          >
            {/* Step 1: Email Input */}
            {step === 1 && (
              <motion.div variants={itemVariants} className="relative">
                <FaEnvelope className="absolute top-4 left-4 text-[#50483b] text-lg" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#f97316]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="new-email"
                  required
                />
              </motion.div>
            )}


              {/* Step 2: OTP Verification */}
              {step === 2 && (
              <>
                <motion.div variants={itemVariants} className="relative">
                  <FaEnvelope className="absolute top-4 left-4 text-[#50483b] text-lg" />
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-gray-100"
                    value={email}
                    readOnly
                    autoComplete="off"
                  />
                </motion.div>
                <motion.div variants={itemVariants} className="relative">
                  <FaKey className="absolute top-4 left-4 text-[#50483b] text-lg" />
                  <input
                    type="text"
                    placeholder="Enter 4-digit OTP"
                    className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#f97316]"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    pattern="\d{4}"
                    required
                  />
                </motion.div>
              </>
            )}

              {/* Step 3: Password Reset */}
              {step === 3 && (
              <>
                <motion.div variants={itemVariants} className="relative">
                  <FaLock className="absolute top-4 left-4 text-[#50483b] text-lg" />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#f97316]"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </motion.div>
                <motion.div variants={itemVariants} className="relative">
                  <FaLock className="absolute top-4 left-4 text-[#50483b] text-lg" />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#f97316]"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </motion.div>
              </>
            )}

              {error && (
                <motion.div 
                  variants={itemVariants}
                  className="text-red-500 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#f97316] text-white py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-[#ea580c] transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    'Processing...'
                  ) : (
                    step === 1 ? 'Send OTP' :
                    step === 2 ? 'Verify OTP' :
                    'Reset Password'
                  )}
                </motion.button>
              </motion.div>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4"
            >
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#50483b]">
                Password Reset Successful!
              </h3>
              <p className="text-gray-600">
                Redirecting to login page...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    
  );
};

export default ForgotPassword;