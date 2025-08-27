import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import Head from 'next/head';

const CBTResource: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>Understanding Cognitive Behavioral Therapy | Luna</title>
        <meta name="description" content="Comprehensive guide to Cognitive Behavioral Therapy (CBT) - principles, techniques, and applications in mental health treatment." />
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-6 text-blue-600 dark:text-blue-400">Understanding Cognitive Behavioral Therapy (CBT)</h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction to CBT</h2>
          <p className="mb-4">
            Cognitive Behavioral Therapy (CBT) is a form of psychological treatment that has been demonstrated to be effective for a range of problems including depression, anxiety disorders, substance use problems, marital problems, eating disorders, and severe mental illness. Numerous research studies suggest that CBT leads to significant improvement in functioning and quality of life.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Principles of CBT</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Psychological problems are based, in part, on faulty or unhelpful ways of thinking.</li>
            <li>Psychological problems are based, in part, on learned patterns of unhelpful behavior.</li>
            <li>People suffering from psychological problems can learn better ways of coping with them, thereby relieving their symptoms and becoming more effective in their lives.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">CBT Techniques</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Identifying and challenging negative thought patterns</li>
            <li>Behavioral activation</li>
            <li>Exposure therapy</li>
            <li>Cognitive restructuring</li>
            <li>Mindfulness and relaxation techniques</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Efficacy and Research</h2>
          <p className="mb-4">
            CBT has been extensively researched and its effectiveness has been demonstrated for various mental health conditions. A meta-analysis by Hofmann et al. (2012) found that CBT is highly effective for anxiety disorders, somatoform disorders, bulimia, anger control problems, and general stress.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">References</h2>
          <ul className="list-decimal pl-6 space-y-2">
            <li>Beck, J. S. (2011). Cognitive behavior therapy: Basics and beyond (2nd ed.). Guilford Press.</li>
            <li>Hofmann, S. G., Asnaani, A., Vonk, I. J. J., Sawyer, A. T., & Fang, A. (2012). The efficacy of cognitive behavioral therapy: A review of meta-analyses. Cognitive Therapy and Research, 36(5), 427-440.</li>
            <li>American Psychological Association. (2017). What is Cognitive Behavioral Therapy? Clinical Practice Guideline for the Treatment of PTSD.</li>
          </ul>
        </section>
      </motion.div>
    </Layout>
  );
};

export default CBTResource;