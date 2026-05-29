import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MockProvider } from "@/components/layout/MockProvider";
import { Web3Provider } from "@/components/layout/Web3Provider";
import { TopNav } from "@/components/layout/TopNav";
import { GlobalActivityFeed } from "@/components/layout/GlobalActivityFeed";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  title: "Proof-of-Reality | Institutional Consensus",
  description: "Mission control for truth verification.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#000000] text-slate-200 antialiased min-h-screen selection:bg-white/10 overflow-hidden`}>
        <Web3Provider>
          <MockProvider>
            <div className="flex flex-col h-screen overflow-hidden bg-security-grid">
              <TopNav />
              <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                  {children}
                </div>
                <GlobalActivityFeed />
              </div>
            </div>
          </MockProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
