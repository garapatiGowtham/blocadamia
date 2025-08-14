import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetPlanner } from "@/components/BudgetPlanner";

export const BudgetPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-glow">
          <span className="text-[#f0f7ff]">
            Budget Planning
          </span>
        </h1>

        <Card className="glass-morphism neon-border overflow-hidden group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="relative z-10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#f0f7ff]">
                Your Budget Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetPlanner />
            </CardContent>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};
