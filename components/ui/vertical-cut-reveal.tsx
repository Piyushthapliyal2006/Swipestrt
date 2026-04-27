"use client";

import { motion } from "framer-motion";

interface VerticalCutRevealProps {
  children: string;
  splitBy?: "words" | "characters";
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center";
  reverse?: boolean;
  containerClassName?: string;
  transition?: any;
}

export function VerticalCutReveal({
  children,
  splitBy = "words",
  staggerDuration = 0.1,
  containerClassName = "",
  transition,
}: VerticalCutRevealProps) {
  const elements = splitBy === "words" ? children.split(" ") : children.split("");

  return (
    <div className={`flex flex-wrap ${containerClassName} overflow-hidden`}>
      {elements.map((el, i) => (
        <motion.span
          key={i}
          initial={{ y: "100%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{
            ...transition,
            delay: (transition?.delay || 0) + i * staggerDuration,
          }}
          className="inline-block"
        >
          {el}
          {splitBy === "words" && "\u00A0"}
        </motion.span>
      ))}
    </div>
  );
}
