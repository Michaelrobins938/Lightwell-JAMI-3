import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-slate-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-400">Contact Us</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Get in touch
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Have a question or want to learn more about Lightwell? We'd love to hear from you.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
            <motion.div
              className="flex flex-col items-center p-8 bg-slate-800/30 rounded-2xl border border-slate-700/40 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Mail className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
              <p className="text-slate-300">hello@lightwell.ai</p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center p-8 bg-slate-800/30 rounded-2xl border border-slate-700/40 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Phone className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Phone</h3>
              <p className="text-slate-300">(555) 555-5555</p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center p-8 bg-slate-800/30 rounded-2xl border border-slate-700/40 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <MapPin className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Address</h3>
              <p className="text-slate-300">123 Main St, Anytown USA</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
