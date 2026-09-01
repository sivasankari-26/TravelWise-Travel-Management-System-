import { Outlet } from 'react-router-dom';
import CustomerNavbar from '../components/customer/CustomerNavbar.jsx';
import Footer from '../components/common/Footer.jsx';

export default function CustomerLayout() {
  return (
    <div className="flex-col" style={{ minHeight: '100vh' }}>
      <CustomerNavbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
