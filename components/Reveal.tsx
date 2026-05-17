import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const Reveal: React.FC<{ children: React.ReactNode, delay?: number, className?: string, style?: React.CSSProperties }> = ({ children, delay=0, className, style }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={className} style={{ position: "relative", overflow: "hidden", ...style }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
};
export default Reveal;
