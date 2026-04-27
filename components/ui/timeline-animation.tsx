"use client";

import { motion, useInView } from "framer-motion";
import { ElementType, ReactNode, useRef } from "react";

interface TimelineContentProps {
  children: ReactNode;
  animationNum: number;
  timelineRef?: React.RefObject<HTMLElement>;
  customVariants?: any;
  as?: ElementType;
  className?: string;
}

export function TimelineContent({
  children,
  animationNum,
  timelineRef,
  customVariants,
  as: Component = "div",
  className,
}: TimelineContentProps) {
  const fallbackRef = useRef(null);
  const ref = timelineRef || fallbackRef;
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const MotionComponent = motion(Component as any);

  return (
    <MotionComponent
      ref={fallbackRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={animationNum}
      variants={customVariants}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}
