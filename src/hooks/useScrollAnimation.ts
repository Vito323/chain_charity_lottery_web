"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 注册 GSAP 插件
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseScrollAnimationOptions {
  trigger?: string;
  start?: string;
  end?: string;
  toggleActions?: string;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  y?: number;
  opacity?: number;
  scale?: number;
  rotation?: number;
  onComplete?: () => void;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    
    // 设置默认动画选项
    const animationOptions = {
      trigger: element,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
      duration: 1,
      delay: 0,
      stagger: 0.1,
      ease: "power3.out",
      y: 50,
      opacity: 0,
      scale: 1,
      rotation: 0,
      ...options
    };

    // 创建滚动触发动画
    const animation = gsap.fromTo(element, 
      { 
        y: animationOptions.y,
        opacity: animationOptions.opacity,
        scale: animationOptions.scale,
        rotation: animationOptions.rotation
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: animationOptions.duration,
        delay: animationOptions.delay,
        ease: animationOptions.ease,
        stagger: animationOptions.stagger,
        scrollTrigger: {
          trigger: animationOptions.trigger,
          start: animationOptions.start,
          end: animationOptions.end,
          toggleActions: animationOptions.toggleActions,
          onEnter: () => {
            setIsVisible(true);
            animationOptions.onComplete?.();
          },
          onLeave: () => setIsVisible(false),
          onEnterBack: () => setIsVisible(true),
          onLeaveBack: () => setIsVisible(false)
        }
      }
    );

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [options]);

  return { elementRef, isVisible };
};

// 专门用于数字计数动画的 Hook
export const useCounterAnimation = (targetValue: number, duration: number = 2) => {
  const elementRef = useRef<HTMLElement>(null);
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    
    const animation = gsap.fromTo(element,
      { textContent: 0 },
      {
        textContent: targetValue,
        duration: duration,
        ease: "power2.out",
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        onUpdate: function() {
          const current = Math.round(parseInt(this.targets()[0].textContent) || 0);
          this.targets()[0].textContent = current.toLocaleString();
          setCurrentValue(current);
        }
      }
    );

    return () => {
      animation.kill();
    };
  }, [targetValue, duration]);

  return { elementRef, currentValue };
};

// 用于创建交错动画的 Hook
export const useStaggeredAnimation = (
  selector: string,
  options: UseScrollAnimationOptions = {}
) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const elements = container.querySelectorAll(selector);
    
    if (elements.length === 0) return;

    const animationOptions = {
      trigger: container,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
      duration: 0.8,
      delay: 0,
      stagger: 0.2,
      ease: "power3.out",
      y: 50,
      opacity: 0,
      ...options
    };

    const animation = gsap.fromTo(elements,
      {
        y: animationOptions.y,
        opacity: animationOptions.opacity
      },
      {
        y: 0,
        opacity: 1,
        duration: animationOptions.duration,
        delay: animationOptions.delay,
        stagger: animationOptions.stagger,
        ease: animationOptions.ease,
        scrollTrigger: {
          trigger: animationOptions.trigger,
          start: animationOptions.start,
          end: animationOptions.end,
          toggleActions: animationOptions.toggleActions
        }
      }
    );

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [selector, options]);

  return { containerRef };
};
