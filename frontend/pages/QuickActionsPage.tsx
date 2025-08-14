import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletDetails } from "@/components/WalletDetails";
import { QRPayment } from "@/components/QRPayment";

export const QuickActionsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-glow">
          <span className="text-[#f0f7ff]">
            Quick Actions
          </span>
        </h1>

        <div className="space-y-6">
          <Card className="glass-morphism neon-border overflow-hidden group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="relative z-10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#f0f7ff]">
                  Wallet Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WalletDetails />
              </CardContent>
            </div>
          </Card>

          <Card className="glass-morphism neon-border overflow-hidden group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="relative z-10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#f0f7ff]">
                  QR Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QRPayment />
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
