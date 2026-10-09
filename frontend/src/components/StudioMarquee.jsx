import React from 'react';
import { motion } from 'framer-motion';

const ITEMS = [
  "AUTONOMOUS GOAL ENGINE",
  "165.3 TOKENS/SEC INFERENCE",
  "NVIDIA NEMOTRON-3.5-LIGHTNING",
  "NEBIUS TOKEN FACTORY",
  "EXECUTIVE MORNING BRIEFINGS",
  "LOCAL NEMO PRIVACY GUARDRAILS",
  "AMBIENT WORKSPACE WATCHER",
  "TAVILY LIVE WEB GROUNDING",
  "ZERO PII RETENTION",
  "CONTEXT SWITCH RELOAD DIFF",
];

export default function StudioMarquee() {
  return (
    <div className="w-full overflow-hidden border-y border-neutral-800/80 bg-neutral-950 py-2.5 my-2 select-none">
      <div className="flex w-max">
        {/* Track 1 */}
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 28,
            repeat: Infinity,
          }}
          className="flex items-center gap-6 whitespace-nowrap text-xs font-display font-bold uppercase tracking-widest text-neutral-400"
        >
          {ITEMS.concat(ITEMS).map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="hover:text-white transition-colors cursor-default">
                {item}
              </span>
              <span className="text-white text-[10px]" aria-hidden="true">
                ✳
              </span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
