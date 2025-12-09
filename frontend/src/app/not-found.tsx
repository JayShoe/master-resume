'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ArrowLeft, Search, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" as any }
    }
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as any
      }
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <motion.div
        className="text-center max-w-md mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Animation */}
        <motion.div
          className="mb-8 relative"
          variants={floatingVariants}
          initial="initial"
          animate="animate"
        >
          <div className="text-9xl font-bold text-primary/20 select-none">
            404
          </div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" as any }}
          >
            <Search className="w-16 h-16 text-primary" />
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>

          <div className="text-sm text-gray-500">
            Or try one of these popular pages:
          </div>

          <div className="flex flex-wrap gap-2 justify-center text-sm">
            <Link
              href="/experience"
              className="px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-full hover:border-primary hover:text-primary transition-colors"
            >
              Experience
            </Link>
            <Link
              href="/skills"
              className="px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-full hover:border-primary hover:text-primary transition-colors"
            >
              Skills
            </Link>
            <Link
              href="/projects"
              className="px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-full hover:border-primary hover:text-primary transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/contact"
              className="px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-full hover:border-primary hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          variants={itemVariants}
          className="mt-8 p-4 bg-white rounded-lg border border-gray-200"
        >
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Need Help?
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            If you think this is an error or you can't find what you're looking for, 
            feel free to reach out.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Contact Me
            <ArrowLeft className="w-3 h-3 rotate-180" />
          </Link>
        </motion.div>

        {/* Fun Easter Egg */}
        <motion.div
          className="mt-6 text-xs text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Error 404: Professional not found at this location 🤖
        </motion.div>
      </motion.div>

      {/* Background Animation Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/10 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
}