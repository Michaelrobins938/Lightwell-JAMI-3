import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

const LightwellFooter = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-8 h-8 text-amber-400" />
            <span className="text-2xl font-bold text-white">Lightwell</span>
          </div>
        </div>
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          <div className="px-5 py-2">
            <a href="#" className="text-base text-slate-400 hover:text-white">
              About
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-base text-slate-400 hover:text-white">
              Features
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-base text-slate-400 hover:text-white">
              Testimonials
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-base text-slate-400 hover:text-white">
              Contact
            </a>
          </div>
        </nav>
        <div className="mt-8 flex justify-center space-x-6">
          <a href="#" className="text-slate-400 hover:text-white">
            <span className="sr-only">Facebook</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a href="#" className="text-slate-400 hover:text-white">
            <span className="sr-only">Instagram</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.885 2 12.315 2zm-1.161 2.065c-1.059.048-1.69.21-2.227.427a2.897 2.897 0 00-1.032.742 2.897 2.897 0 00-.742 1.032c-.217.537-.379 1.168-.427 2.227-.048 1.024-.06 1.35-.06 3.518s.012 2.494.06 3.518c.048 1.059.21 1.69.427 2.227a2.897 2.897 0 00.742 1.032 2.897 2.897 0 001.032.742c.537.217 1.168.379 2.227.427 1.024.048 1.35.06 3.518.06s2.494-.012 3.518-.06c1.059-.048 1.69-.21 2.227-.427a2.897 2.897 0 001.032-.742 2.897 2.897 0 00.742-1.032c.217-.537.379-1.168.427-2.227.048-1.024.06-1.35.06-3.518s-.012-2.494-.06-3.518c-.048-1.059-.21-1.69-.427-2.227a2.897 2.897 0 00-.742-1.032 2.897 2.897 0 00-1.032-.742c-.537-.217-1.168-.379-2.227-.427C14.81 4.077 14.465 4.065 12 4.065zm0 2.43c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6.5c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zm4.805-6.415c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a href="#" className="text-slate-400 hover:text-white">
            <span className="sr-only">Twitter</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
              />
            </svg>
          </a>
        </div>
        <p className="mt-8 text-center text-base text-slate-400">&copy; 2025 Lightwell. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default LightwellFooter;
