import React, { useState } from 'react';
import Layout from './components/Layout';
import { StoreProvider, useStore } from './context/StoreContext';
import Shop from './components/Shop';
import Cart from './components/Cart';
import type { CartItem } from './types';

const AppContent: React.FC = () => {
  const { cart, loading } = useStore();
  const [activeTab, setActiveTab] = useState<'shop' | 'cart' | 'admin'>('shop');

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const cartCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} cartCount={cartCount}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === 'shop' && <Shop />}
        {activeTab === 'cart' && <Cart />}
        {activeTab === 'admin' && (
          <section>
            <h2 className="text-3xl font-bold mb-2">Admin Panel</h2>
            <p className="text-neutral-400 mb-8">Store performance and discount system management.</p>
            <div className="p-20 border border-dashed border-neutral-800 rounded-3xl text-center text-neutral-500">
              Admin dashboard coming in next commit...
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
