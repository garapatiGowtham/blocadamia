import { Link, Outlet } from 'react-router-dom';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { cn } from "@/lib/utils";

export const MainLayout = () => {
  const { connected, disconnect } = useWallet();
  const paths = [
    { name: 'Home', path: '/home' },
    { name: 'Quick Actions', path: '/quick-actions' },
    { name: 'Account Overview', path: '/account' },
    { name: 'Budget Planning', path: '/budget' },
    { name: 'Student Loans', path: '/loans' },
  ];

  const handleLogout = async () => {
    await disconnect();
  };

  return (
    <div className="min-h-screen gradient-animate bg-gradient-to-br from-[#0f1724] via-[#1a237e] to-[#311b92] relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4527a0] rounded-full filter blur-[128px] animate-float opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1a237e] rounded-full filter blur-[128px] animate-float opacity-20" style={{ animationDelay: '-2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#283593] rounded-full filter blur-[128px] animate-float opacity-10" style={{ animationDelay: '-4s' }}></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 modern-glass backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg accent-gradient animate-subtle-glow group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-semibold" style={{ color: `rgb(var(--text-primary))` }}>B</span>
                </div>
              </div>
              <span className="text-xl font-medium tracking-tight text-gradient">
                Blocadamia
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {connected && (
                <>
                  {paths.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-200"
                      style={{ 
                        color: `rgb(var(--text-secondary))`,
                        fontSize: "0.9375rem"
                      }}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-[rgb(239,68,68)] hover:text-[rgb(248,113,113)] hover:bg-red-500/10 transition-all duration-200 ml-2 text-[0.9375rem]"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {connected && (
        <div className="fixed bottom-4 left-4 right-4 md:hidden glass-morphism rounded-2xl border border-white/10 neon-border">
          <div className="grid grid-cols-4 gap-1 p-2">
            {paths.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center py-3 px-1 rounded-md hover:bg-white/5 transition-all duration-200"
                style={{ color: `rgb(var(--text-secondary))` }}
              >
                <span className="text-xs text-center">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <main className={cn(
        "container mx-auto px-4 transition-all duration-300 relative z-10",
        connected ? "pt-28 pb-28 md:pb-12" : "pt-28"
      )}>
        <Outlet />
      </main>
    </div>
  );
};
