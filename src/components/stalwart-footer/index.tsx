'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { subscribeEmail } from '@/service/general';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

const StalwartFooter = () => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const debouncedValidateEmail = useMemo(
    () => debounce((value: string) => {
      setEmailError('');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setEmailError('Please enter a valid email address');
      }
    }, 300),
    []
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    debouncedValidateEmail(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (email && validateEmail(email) && !isLoading) {
        const mockEvent = {
          preventDefault: () => {},
        } as React.MouseEvent<HTMLButtonElement>;
        handleSubmit(mockEvent);
      }
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError('Please enter your email address');
      toast.error('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setEmailError('');
    try {
      const response = await subscribeEmail(email);
      if (response.ok) {
        setEmail('');
        toast.success('Subscription successful! Thank you for your attention');
      }
    } catch {
      toast.error('Subscription failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const footerLinks = {
    useful: [
      { name: 'Home', href: '/' },
      { name: 'Projects', href: '/project' },
      { name: 'Lottery', href: '/lottery' },
    ],
  };


  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h3 className="text-3xl font-bold mb-4">
              Stay in the Loop
            </h3>
            <p className="text-gray-300 mb-8">
             Follow us for further information
            </p>
            <div className="max-w-md mx-auto">
              <form className="flex flex-col sm:flex-row gap-4">
                <motion.div 
                  className="flex-1"
                  animate={{
                    scale: emailError ? [1, 1.02, 1] : 1,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut"
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    autoComplete="email"
                    className={`flex-1 w-full px-4 py-3 bg-white/10 border rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      emailError 
                        ? 'border-red-500 focus:ring-red-500 shadow-lg shadow-red-500/20' 
                        : 'border-white/20'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </motion.div>
                <motion.button
                  onClick={handleSubmit}
                  disabled={!email || !!emailError || isLoading}
                  className={`px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full transition-all duration-300 ${
                    !email || !!emailError || isLoading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:from-purple-700 hover:to-pink-700'
                  }`}
                  whileHover={!email || !!emailError || isLoading ? {} : { scale: 1.05 }}
                  whileTap={!email || !!emailError || isLoading ? {} : { scale: 0.95 }}
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </motion.button>
              </form>
              
              {/* 错误信息区域 - 固定高度避免布局跳动 */}
              <div className="h-6 mt-2 flex items-start justify-center">
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.8 }}
                  animate={{ 
                    opacity: emailError ? 1 : 0, 
                    y: emailError ? 0 : -10, 
                    scale: emailError ? 1 : 0.8 
                  }}
                  transition={{ 
                    duration: 0.4, 
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                  className={`text-sm text-center flex items-center gap-1 ${
                    emailError ? 'text-red-400' : 'text-transparent'
                  }`}
                >
                  {emailError && (
                    <>
                      <span>{emailError}</span>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Brand Section */}
          <div className="lg:col-span-1 max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <span className="text-xl font-bold">Hawaiian Nation Charity</span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Connecting the world with kindness, protecting our home with action.
              </p>
            </motion.div>
          </div>
          <div className="lg:col-span-1"></div>
          {/* Useful Links Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-4">
                Useful Links
              </h4>
              <ul className="space-y-3">
                {footerLinks.useful.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Us Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-4">
                Contact Us
              </h4>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <i className="fi flaticon-pin mr-2 text-white before:!text-lg"></i>
                  <span className="text-sm">1 Street, 2 City, Singapore</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <i className="fi flaticon-call mr-2 text-white before:!text-lg"></i>
                  <span className="text-sm">+1234567890</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <i className="fi flaticon-envelope mr-2 text-white before:!text-lg"></i>
                  <span className="text-sm">support@chaincharity.com</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-white/10 mt-12 pt-8"
        >
          <div className="text-center">
            <p className="text-gray-300 text-sm">
              © 2025 ChainCharity. All rights reserved
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default StalwartFooter;