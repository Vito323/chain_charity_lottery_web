"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";

interface SecurityMeasure {
  id: number;
  title: string;
  icon: string;
  items: string[];
}

interface SecurityMeasuresProps {
  securityMeasures: SecurityMeasure[];
  isInView: boolean;
  variants: Variants;
}

const SecurityMeasures: React.FC<SecurityMeasuresProps> = ({
  securityMeasures,
  isInView,
  variants,
}) => {
  const t = useTranslations("nodeDetail");

  return (
    <motion.section
      variants={variants}
      className="space-y-3 sm:space-y-4"
    >
      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white text-center px-4">
        {t("security.title")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {securityMeasures.map((measure, index) => (
          <motion.div
            key={measure.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 p-3 sm:p-4 md:p-5 shadow-xl hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center">
                <i
                  className={`${measure.icon} text-lg sm:text-xl md:text-2xl text-purple-400`}
                ></i>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-white mb-1.5 sm:mb-2">
                  {measure.title}
                </h3>
                <ul className="space-y-1 sm:space-y-1.5">
                  {measure.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-1.5 text-xs sm:text-sm text-white/70 leading-relaxed"
                    >
                      <span className="text-emerald-400 mt-0.5 flex-shrink-0 text-xs">
                        •
                      </span>
                      <span className="break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default SecurityMeasures;

