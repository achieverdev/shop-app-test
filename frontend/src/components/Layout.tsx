import React from 'react';
import { ShoppingCart, Store as StoreIcon, ShieldCheck } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: 'shop' | 'cart' | 'admin';
    setActiveTab: (tab: 'shop' | 'cart' | 'admin') => void;
    cartCount: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, cartCount }) => {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
            <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <StoreIcon size={18} />
                        </div>
                        <span>LUXE<span className="text-blue-500">STORE</span></span>
                    </div>

                    <nav className="flex gap-1 bg-neutral-800/50 p-1 rounded-xl">
                        {[
                            { id: 'shop', label: 'Shop', icon: StoreIcon },
                            { id: 'cart', label: `Cart (${cartCount})`, icon: ShoppingCart },
                            { id: 'admin', label: 'Admin', icon: ShieldCheck },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${activeTab === item.id
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'
                                    }`}
                            >
                                <item.icon size={16} />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
                {children}
            </main>

            <footer className="border-t border-neutral-800 py-8 text-center text-neutral-500 text-sm">
                <p>&copy; 2026 Luxe Store. Minimalist Ecommerce Assignment.</p>
            </footer>
        </div>
    );
};

export default Layout;
