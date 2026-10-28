import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { BoutiquesPage } from './pages/BoutiquesPage';
import { VendorPortalPage } from './pages/VendorPortalPage';
import { InfoPages } from './pages/InfoPages';
import { MessageCircle, Check, ArrowUp } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentView, toastMessage, storeSettings } = useShop();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-neutral-900 selection:bg-amber-800 selection:text-white">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-neutral-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-2.5 animate-in slide-in-from-top duration-200">
          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </span>
          <span className="text-stone-200">{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header />

      {/* Main Page View Switcher */}
      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'catalog' && <CatalogPage />}
        {currentView === 'product-detail' && <ProductDetailPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'order-success' && <OrderSuccessPage />}
        {(currentView === 'account' || currentView === 'tracking') && <AccountPage />}
        {currentView === 'boutiques' && <BoutiquesPage />}
        {currentView === 'vendor-portal' && <VendorPortalPage />}
        {currentView === 'admin' && <AdminDashboard />}
        {['about', 'contact', 'faq', 'cgv', 'guide-tailles'].includes(currentView) && <InfoPages />}
      </main>

      {/* Slide-over Shopping Cart Drawer */}
      <CartDrawer />

      {/* Main Footer */}
      <Footer />

      {/* Floating WhatsApp Quick Action Button (West Africa E-commerce standard) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
        <button
          onClick={scrollToTop}
          title="Retour en haut"
          className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md border border-stone-200 flex items-center justify-center transition hover:scale-105"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        <a
          href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Conseiller ZALY sur WhatsApp"
          className="group flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="text-xs font-bold hidden sm:inline tracking-wide">
            Assistance WhatsApp
          </span>
        </a>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainAppContent />
    </ShopProvider>
  );
}
