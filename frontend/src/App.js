import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import OrderHistory from "./pages/OrderHistory";

import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import ManageFoods from "./pages/ManageFoods";
import AdminReviews from "./pages/AdminReviews";
import AdminUsers from "./pages/AdminUsers";

import KitchenDashboard from "./pages/KitchenDashboard";
import KitchenAssignedOrders from "./pages/KitchenAssignedOrders";
import KitchenPreparing from "./pages/KitchenPreparing";
import KitchenCompleted from "./pages/KitchenCompleted";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import DeliveryAssigned from "./pages/DeliveryAssigned";
import DeliveryHistory from "./pages/DeliveryHistory";
import CashierDashboard from "./pages/CashierDashboard";
import CashierPayments from "./pages/CashierPayments";
import CashierHistory from "./pages/CashierHistory";

import {
  FaTachometerAlt,
  FaUtensils,
  FaShoppingCart,
  FaUsers,
  FaClipboardList,
  FaTruck,
  FaMoneyBillWave,
  FaReceipt,
} from "react-icons/fa";

const adminMenuItems = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    to: "/admin/foods",
    label: "Manage Foods",
    icon: <FaUtensils />,
  },
  {
    to: "/admin/orders",
    label: "Orders",
    icon: <FaShoppingCart />,
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: <FaUsers />,
  },
  {
    to: "/admin/reviews",
    label: "Reviews",
    icon: <FaClipboardList />,
  },
];

const kitchenMenuItems = [
  {
    to: "/kitchen/dashboard",
    label: "Dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    to: "/kitchen/assigned",
    label: "Assigned Orders",
    icon: <FaShoppingCart />,
  },
  {
    to: "/kitchen/preparing",
    label: "Preparing",
    icon: <FaUtensils />,
  },
  {
    to: "/kitchen/completed",
    label: "Completed",
    icon: <FaClipboardList />,
  },
];

const deliveryMenuItems = [
  {
    to: "/delivery/dashboard",
    label: "Dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    to: "/delivery/assigned",
    label: "Assigned Deliveries",
    icon: <FaTruck />,
  },
  {
    to: "/delivery/history",
    label: "History",
    icon: <FaClipboardList />,
  },
];

const cashierMenuItems = [
  {
    to: "/cashier/dashboard",
    label: "Dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    to: "/cashier/payments",
    label: "Pending Payments",
    icon: <FaMoneyBillWave />,
  },
  {
    to: "/cashier/history",
    label: "Payment History",
    icon: <FaReceipt />,
  },
];

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, []);

  const isAdminPage =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/kitchen") ||
    location.pathname.startsWith("/delivery") ||
    location.pathname.startsWith("/cashier");

  return (
    <div className="app-container">

      {/* User Navbar */}
      {!isAdminPage && <Navbar />}

      <div className="main-content">

        <Routes>

          {/* ================= USER ROUTES ================= */}

          <Route path="/" element={<Home />} />

          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/menu" element={<Menu />} />

          <Route path="/cart" element={<Cart />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "customer",
                  "admin",
                ]}
              >
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/my-orders"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "customer",
                ]}
              >
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-history"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "customer",
                ]}
              >
                <OrderHistory />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ROUTES ================= */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout menuItems={adminMenuItems}>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout menuItems={adminMenuItems}>
                  <AdminOrders />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/foods"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout menuItems={adminMenuItems}>
                  <ManageFoods />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout menuItems={adminMenuItems}>
                  <AdminUsers />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout menuItems={adminMenuItems}>
                  <AdminReviews />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/kitchen/dashboard"
            element={
              <ProtectedRoute allowedRoles={["kitchen"]}>
                <AdminLayout
                  brand="FoodieHub Kitchen"
                  menuItems={kitchenMenuItems}
                >
                  <KitchenDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/kitchen/assigned"
            element={
              <ProtectedRoute allowedRoles={["kitchen"]}>
                <AdminLayout
                  brand="FoodieHub Kitchen"
                  menuItems={kitchenMenuItems}
                >
                  <KitchenAssignedOrders />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/kitchen/preparing"
            element={
              <ProtectedRoute allowedRoles={["kitchen"]}>
                <AdminLayout
                  brand="FoodieHub Kitchen"
                  menuItems={kitchenMenuItems}
                >
                  <KitchenPreparing />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/kitchen/completed"
            element={
              <ProtectedRoute allowedRoles={["kitchen"]}>
                <AdminLayout
                  brand="FoodieHub Kitchen"
                  menuItems={kitchenMenuItems}
                >
                  <KitchenCompleted />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/delivery/dashboard"
            element={
              <ProtectedRoute allowedRoles={["delivery"]}>
                <AdminLayout
                  brand="FoodieHub Delivery"
                  menuItems={deliveryMenuItems}
                >
                  <DeliveryDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/delivery/assigned"
            element={
              <ProtectedRoute allowedRoles={["delivery"]}>
                <AdminLayout
                  brand="FoodieHub Delivery"
                  menuItems={deliveryMenuItems}
                >
                  <DeliveryAssigned />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/delivery/history"
            element={
              <ProtectedRoute allowedRoles={["delivery"]}>
                <AdminLayout
                  brand="FoodieHub Delivery"
                  menuItems={deliveryMenuItems}
                >
                  <DeliveryHistory />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cashier/dashboard"
            element={
              <ProtectedRoute allowedRoles={["cashier"]}>
                <AdminLayout
                  brand="FoodieHub Cashier"
                  menuItems={cashierMenuItems}
                >
                  <CashierDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cashier/payments"
            element={
              <ProtectedRoute allowedRoles={["cashier"]}>
                <AdminLayout
                  brand="FoodieHub Cashier"
                  menuItems={cashierMenuItems}
                >
                  <CashierPayments />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cashier/history"
            element={
              <ProtectedRoute allowedRoles={["cashier"]}>
                <AdminLayout
                  brand="FoodieHub Cashier"
                  menuItems={cashierMenuItems}
                >
                  <CashierHistory />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />

          <Route
            path="/kitchen"
            element={<Navigate to="/kitchen/dashboard" replace />}
          />

          <Route
            path="/delivery"
            element={<Navigate to="/delivery/dashboard" replace />}
          />

          <Route
            path="/cashier"
            element={<Navigate to="/cashier/dashboard" replace />}
          />

        </Routes>

      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      {/* User Footer */}
      {!isAdminPage && <Footer />}

    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;