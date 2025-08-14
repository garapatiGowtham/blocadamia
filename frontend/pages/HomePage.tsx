import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletSelector } from "@/components/WalletSelector";
import { motion } from "framer-motion";
import { QrCode, PieChart, GraduationCap } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

const FeatureCard = ({ title, description, icon, index }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.02, y: -5 }}
    className="flex-1 min-w-[280px]"
  >
    <Card className="h-full glass-morphism neon-border overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br from-[#5c6bc0]/20 to-[#3949ab]/20 rounded-full blur-xl transform group-hover:scale-150 transition-transform duration-500"></div>
      
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#5c6bc0] to-[#3949ab] text-white">
            {icon}
          </div>
          <CardTitle className="text-xl bg-gradient-to-r from-[#e3f2fd] to-[#90caf9] text-transparent bg-clip-text">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-white/70 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

export const HomePage = () => {
  const { connected } = useWallet();

  const features = [
    {
      title: "QR Payments",
      description: "Send and receive payments instantly using QR codes. Scan and transfer funds with just a few taps.",
      icon: <QrCode className="w-6 h-6" />,
    },
    {
      title: "Budget Planning",
      description: "Track and manage your expenses with smart budgeting tools. Get insights into your spending patterns.",
      icon: <PieChart className="w-6 h-6" />,
    },
    {
      title: "Student Loans",
      description: "Access decentralized student loans with competitive rates. Apply and manage your loans seamlessly.",
      icon: <GraduationCap className="w-6 h-6" />,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="relative">
          {/* Decorative circle */}
          <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-[#3949ab] rounded-full filter blur-[128px] animate-float"></div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-glow relative">
            <span className="bg-gradient-to-r from-[#e3f2fd] via-[#90caf9] to-[#5c6bc0] text-transparent bg-clip-text">
              Welcome to Blocadamia
            </span>
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Your decentralized campus finance platform. Experience the future of payments, budgeting, and student loans with blockchain technology.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {!connected ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md relative"
        >
          {/* Decorative Elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#5c6bc0] rounded-full filter blur-[64px] animate-float"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#3949ab] rounded-full filter blur-[64px] animate-float" style={{ animationDelay: '-3s' }}></div>
          
          <Card className="glass-morphism neon-border overflow-hidden">
            <CardHeader className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5c6bc0] to-[#3949ab] opacity-10"></div>
              <CardTitle className="text-2xl text-glow bg-gradient-to-r from-[#e3f2fd] to-[#90caf9] text-transparent bg-clip-text relative">
                Welcome to the Future
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <motion.p 
                className="text-white/70 leading-relaxed text-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Connect your wallet to access Blocadamia's revolutionary campus finance platform. Experience seamless payments, smart budgeting, and decentralized loans.
              </motion.p>
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <WalletSelector />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
