"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMock } from "./MockProvider";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function TopNav() {
  const pathname = usePathname();
  const { activeVerification } = useMock();
  
  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/[0.04] bg-[#000000]/80 backdrop-blur-xl">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-5 h-5 flex items-center justify-center">
            <div className="absolute inset-0 border border-white/20"></div>
            <div className="w-1.5 h-1.5 bg-white"></div>
          </div>
          <span className="font-mono text-xs tracking-[0.3em] font-medium text-white/90">PROOF OF REALITY</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {[
            { name: "Overview", path: "/" },
            { name: "Verify", path: "/verify" },
            { name: "Network", path: "/consensus" },
            { name: "Agents", path: "/agents" },
            { name: "Certificates", path: "/certificates" }
          ].map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              className={`text-[11px] font-sans tracking-widest uppercase transition-colors duration-300 ${
                isActive(item.path) 
                  ? "text-white" 
                  : "text-white/40 hover:text-white/80"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-8">
        {/* Status Indicator */}
        <div className="flex items-center gap-3 font-sans text-[10px] tracking-widest uppercase text-white/40">
          <span className="hidden sm:block">System Status</span>
          {activeVerification.state === "PENDING" ? (
             <div className="flex items-center gap-2 text-white/60">
               <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
               STANDBY
             </div>
          ) : activeVerification.state === "FINALIZED" ? (
             <div className="flex items-center gap-2 text-emerald-500/80">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
               VERIFIED
             </div>
          ) : (
             <div className="flex items-center gap-2 text-cyan-500/80">
               <span className="w-1.5 h-1.5 bg-cyan-500/50 animate-[pulse_2s_ease-in-out_infinite]"></span>
               COMPUTING
             </div>
          )}
        </div>

        {/* Custom Web3 Identity Button */}
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button 
                        onClick={openConnectModal} 
                        type="button"
                        className="flex items-center gap-2 px-5 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[10px] font-sans tracking-widest uppercase transition-colors duration-300 border border-white/5"
                      >
                        Connect Identity
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button 
                        onClick={openChainModal} 
                        type="button"
                        className="flex items-center gap-2 px-5 py-2 bg-amber-500/10 text-amber-500 text-[10px] font-sans tracking-widest uppercase transition-colors duration-300 border border-amber-500/20"
                      >
                        Wrong Network
                      </button>
                    );
                  }

                  return (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={openChainModal}
                        style={{ display: 'flex', alignItems: 'center' }}
                        type="button"
                        className="flex items-center gap-2 px-3 py-2 text-white/50 hover:text-white text-[10px] font-mono tracking-widest uppercase transition-colors duration-300"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              overflow: 'hidden',
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 12, height: 12 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </button>

                      <button 
                        onClick={openAccountModal} 
                        type="button"
                        className="flex items-center gap-2 px-5 py-2 bg-[#000000] text-white/90 hover:bg-white/5 text-[10px] font-mono tracking-widest uppercase transition-colors duration-300 border border-white/10"
                      >
                        {account.displayName}
                        {account.displayBalance && !account.displayBalance.includes('NaN')
                          ? ` // ${account.displayBalance}`
                          : ''}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </header>
  );
}
