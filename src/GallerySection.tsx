import React from 'react';
import { motion } from 'framer-motion';

const images = [
  "/1.jpg",
  "/2.jpg",
  "/4.jpg",
  "/5.jpg",
  "/6.jpg",
  "/7.jpg",
];

export default function GallerySection() {
  return (
    <section className="cv-auto py-24 md:py-36 bg-white/40 backdrop-blur-sm relative overflow-hidden flex flex-col items-center">
      <div className="container mx-auto px-4 max-w-6xl text-center relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mb-16"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-[2px] bg-theme-500 shadow-[0_0_8px_rgba(192,192,192,0.4)]" />
            <span className="text-theme-600 font-bold uppercase tracking-[0.4em] text-[9px] md:text-[11px]">Memories</span>
            <div className="w-10 h-[2px] bg-theme-500 shadow-[0_0_8px_rgba(192,192,192,0.4)]" />
          </div>
          <h2 className="font-playball text-[3.5rem] sm:text-[4rem] md:text-[5.5rem] text-theme-900 leading-[1] drop-shadow-sm mt-4">
            Our Gallery
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="relative group overflow-hidden rounded-3xl shadow-lg border-4 border-white aspect-[4/5]"
            >
              <div className="absolute inset-0 bg-theme-900/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
              <img
                src={src}
                alt={`Gallery image ${index + 1}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
