import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { motion } from "framer-motion";
import { ArrowRight, Wallet, Shield, Blocks } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const LandingPage = () => {
  const { connect, connected, account, wallet, wallets } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (connected && account) {
      navigate("/home");
    }
  }, [connected, account, navigate]);

  const connectPetra = async () => {
    try {
      setIsConnecting(true);
      const petraWallet = wallets.find(w => w.name === "Petra");
      if (petraWallet) {
        await connect(petraWallet.name);
      }
    } catch (error) {
      console.error("Failed to connect:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const features = [
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Easy Wallet Integration",
      description: "Connect securely with your Petra wallet in seconds"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Transactions",
      description: "Your funds are protected by blockchain technology"
    },
    {
      icon: <Blocks className="w-6 h-6" />,
      title: "Campus Finance",
      description: "Manage your campus finances with ease"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-soft overflow-hidden relative">
      {/* Subtle Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full filter blur-[120px] animate-gentle-float opacity-10"
          style={{ 
            background: "linear-gradient(135deg, rgba(var(--accent-start), 0.4), rgba(var(--accent-end), 0.1))"
          }}
        />
        <div 
          className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full filter blur-[120px] animate-gentle-float opacity-10"
          style={{ 
            background: "linear-gradient(135deg, rgba(var(--accent-start), 0.2), rgba(var(--accent-end), 0.4))",
            animationDelay: "-3s"
          }}
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-4 py-20 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="bg-gradient-to-r from-[#e3f2fd] to-[#90caf9] text-transparent bg-clip-text">
                  Welcome to Blocadamia
                </span>
              </h1>
              
              <p className="text-xl text-white/80 leading-relaxed">
                Experience the future of campus finance with blockchain technology. Connect your Petra wallet to get started.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  size="lg"
                  onClick={connectPetra}
                  disabled={isConnecting}
                  className="modern-glass hover-lift px-6 py-5 group"
                >
                  <span className="text-gradient font-medium">
                    {isConnecting ? "Connecting..." : "Connect Petra Wallet"}
                  </span>
                  <ArrowRight 
                    className="w-5 h-5 ml-2 opacity-70 group-hover:opacity-100 group-hover:transform group-hover:translate-x-1 transition-all" 
                    style={{ color: `rgb(var(--text-primary))` }}
                  />
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Column - Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Card className="modern-glass hover-lift border-0">
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="p-3 rounded-xl accent-gradient">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium" style={{ color: `rgb(var(--text-primary))` }}>
                          {feature.title}
                        </h3>
                        <p style={{ color: `rgb(var(--text-secondary))` }} className="mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
