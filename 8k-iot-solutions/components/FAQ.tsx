"use client";


import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function FAQ({ faqs = [] }: { faqs?: FAQItem[] }) {
  const [openIds, setOpenIds] = useState<string[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  const toggle = (id: string) => {
    setOpenIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const defaultFaqs = [
    {
      id: '1',
      question: 'What is included in the Starter plan?',
      answer: 'Our Starter plan includes basic hardware prototyping, access to our cloud dashboard for up to 2 devices, and standard email support for your initial deployment.'
    },
    {
      id: '2',
      question: 'Do you offer a free trial?',
      answer: 'Yes! We offer a 14-day free trial on our software dashboards so you can test the integration with your existing hardware sensors before committing.'
    },
    {
      id: '3',
      question: 'Can I switch plans later?',
      answer: 'Absolutely. You can upgrade or downgrade your plan at any time through the admin portal. Changes take effect at the start of the next billing cycle.'
    },
    {
      id: '4',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for larger enterprise custom hardware orders.'
    },
    {
      id: '5',
      question: 'How secure is my data?',
      answer: 'Data security is our top priority. All sensor data is encrypted both in transit and at rest using industry-standard AES-256 encryption protocols.'
    },
    {
      id: '6',
      question: 'How does the 2% donation work?',
      answer: 'We donate 2% of all our profits to open-source hardware foundations and localized student STEM programs in the Philippines.'
    },
    {
      id: '7',
      question: 'Can I integrate this platform with other tools?',
      answer: 'Yes, we provide a robust REST API and support Webhooks, allowing you to connect your IoT data to tools like Zapier, Slack, or custom enterprise ERPs.'
    },
    {
      id: '8',
      question: 'What makes your platform different?',
      answer: 'We bridge the gap between custom hardware design and high-level software intelligence, providing a truly unified ecosystem for student innovators and growing businesses.'
    }
  ];

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  const studioEase = [0.16, 1, 0.3, 1] as any;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: studioEase
      }
    }
  };

  return (
    <motion.section 
      ref={sectionRef}
      style={{ opacity: sectionOpacity }}
      id="faq" 
      className="relative py-20 lg:py-32 bg-white overflow-hidden font-poppins"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="mb-16 md:mb-20">
          <motion.h2 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, ease: studioEase }}
            className="text-4xl sm:text-[2.75rem] font-extrabold text-zinc-900 tracking-tight mb-4"
          >
            Most asked FAQ&apos;s
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, ease: studioEase, delay: 0.05 }}
            className="text-zinc-500 text-lg sm:text-xl max-w-2xl leading-relaxed"
          >
            We&apos;re here to help you and solve doubts. Find answers to the most common questions below.
          </motion.p>
        </div>

        {/* 2-Column Grid Accordion */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
        >
          {displayFaqs.map((faq) => (
            <FAQItemComponent 
              key={faq.id} 
              faq={faq} 
              isOpen={openIds.includes(faq.id)} 
              toggle={() => toggle(faq.id)}
              variants={itemVariants}
            />
          ))}
        </motion.div>

      </div>
    </motion.section>
  );
}

function FAQItemComponent({ 
  faq, 
  isOpen, 
  toggle,
  variants
}: { 
  faq: FAQItem; 
  isOpen: boolean; 
  toggle: () => void;
  variants: any;
}) {
  return (
    <motion.div 
      variants={variants}
      className={`group rounded-2xl border transition-all duration-500 overflow-hidden ${
        isOpen 
          ? 'bg-zinc-50 border-zinc-200' 
          : 'bg-white border-zinc-100 hover:border-zinc-200'
      }`}
    >
      <button 
        onClick={toggle}
        className="w-full flex items-center justify-between text-left p-5 sm:p-6 transition-colors"
      >
        <span className={`text-[15px] sm:text-base font-bold tracking-tight transition-colors duration-300 ${
          isOpen ? 'text-zinc-900' : 'text-zinc-900 group-hover:text-zinc-600'
        }`}>
          {faq.question}
        </span>
        <div className={`shrink-0 ml-4 p-1.5 rounded-lg transition-all duration-500 ${
          isOpen ? 'bg-zinc-200 rotate-45' : 'bg-transparent text-zinc-300 group-hover:text-zinc-400'
        }`}>
          <Plus className="w-5 h-5" strokeWidth={2.5} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-5 sm:px-6 pb-6 text-zinc-500 text-[14px] sm:text-[15px] leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
