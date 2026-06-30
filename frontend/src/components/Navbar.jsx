import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged Out Successfully");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">FoodieHub</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {!user ? (
          <>
            <Link to="/about">About</Link>

            <Link to="/contact">Contact</Link>

            <Link to="/login">Login</Link>

            <Link
              to="/register"
              className="signup-btn-nav"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            {user.role === "admin" ? (
              <>
                <Link to="/admin/dashboard">
                  Dashboard
                </Link>

                <Link to="/admin/orders">
                  Orders
                </Link>

                <Link to="/admin/foods">
                  Manage Foods
                </Link>
              </>
            ) : (
              <>
                <Link to="/menu">
                  Menu
                </Link>

                <Link to="/cart">
                  Cart
                </Link>

                <Link to="/my-orders">
                  My Orders
                </Link>

                <Link to="/order-history">
                  Order History
                </Link>
              </>
            )}

            <Link onClick={logoutHandler}>
              Logout
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;