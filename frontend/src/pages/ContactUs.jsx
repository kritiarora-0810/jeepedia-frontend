import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import logo from '../assets/contact_us--.png';

export default function ContactUs() {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    subject: "", 
    message: "" 
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = 'Valid email is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setServerError('');
    setSubmitSuccess(false);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);

      const response = await fetch('https://3a49-2405-201-5016-709a-a563-54ee-e3e7-9a63.ngrok-free.app/feedback/contact_us/', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Server error occurred');
      }

      if (data.success) {
        setSubmitSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      setServerError(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-[#fdfcf9] px-6 py-16 text-black flex items-center justify-center">
        <div className="max-w-6xl w-full flex flex-col md:flex-row gap-10">
          {/* Contact Info Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-full md:w-1/2 bg-[#50483b] text-white rounded-3xl p-10 shadow-lg flex flex-col justify-between"
          >
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-6">We'd Love To Help <span className="text-[#ffd700]">!</span></h2>
              <p className="text-white/80 mb-6">
              Reach out with any questions or feedback. We'll get in touch within 24 hours.
              </p>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <MapPin className="text-[#ffd700] mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-white">Guru Nanak Dev University</h4>
                    <p>Amritsar, Punjab, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="text-[#ffd700] mt-1" size={20} />
                  <div>
                    <p>kritiarora0810@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-[#ffd700] mt-1" size={20} />
                  <div>
                    <p>+91 8791610964</p>
                  </div>
                </div>
              </div>
            </div>
            <img
              src={logo}
              alt="Decorative"
              className="absolute bottom-1 right-1 w-[350px] h-[350px] object-contain"
            />
          </motion.div>

          {/* Message Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2 bg-white rounded-3xl p-10 shadow-xl"
          >
            <h3 className="text-2xl font-bold text-[#50483b] mb-6">SEND US A MESSAGE<span className="text-[#ffd700]">.</span></h3>

            <div className="mb-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Type your full name*"
                className={`w-full p-3 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ca87c]`}
              />
              {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
            </div>

            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address*"
                className={`w-full p-3 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ca87c]`}
              />
              {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject*"
                className={`w-full p-3 border ${
                  errors.subject ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ca87c]`}
              />
              {errors.subject && <div className="text-red-500 text-sm mt-1">{errors.subject}</div>}
            </div>

            <div className="mb-6">
              <textarea
                name="message"
                rows="3"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your message..."
                className={`w-full p-3 border ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ca87c]`}
              ></textarea>
              {errors.message && <div className="text-red-500 text-sm mt-1">{errors.message}</div>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#ffd700] text-[#50483b] font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'SENDING...' : 'SEND TO US!'}
            </button>

            {submitSuccess && (
              <div className="mt-4 text-green-600 font-medium">
                Message sent successfully!
              </div>
            )}

            {serverError && (
              <div className="mt-4 text-red-600 font-medium">
                {serverError}
              </div>
            )}
          </motion.form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}