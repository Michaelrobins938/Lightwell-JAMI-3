import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: 'Lightwell has been a game-changer for my mental health. I feel more supported and understood than ever before.',
    author: 'Jane Doe',
  },
  {
    quote: 'I was skeptical about AI therapy at first, but Jamie has exceeded all my expectations. It\'s like talking to a real person who truly cares.',
    author: 'John Smith',
  },
  {
    quote: 'The community support feature has been invaluable. It\'s so helpful to connect with others who are going through similar challenges.',
    author: 'Sarah Jones',
  },
];

const Testimonials = () => {
  return (
    <div className="bg-slate-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-400">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What our users are saying
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root sm:mt-20 lg:mt-24">
          <div className="-mt-8 sm:-mx-4 sm:text-left sm:leading-6">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.author}
                  className="flex flex-col p-8 bg-slate-800/30 rounded-2xl border border-slate-700/40 shadow-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <blockquote className="text-white">
                    <p>“{testimonial.quote}”</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <div className="text-base">
                      <div className="font-semibold text-white">{testimonial.author}</div>
                    </div>
                  </figcaption>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
