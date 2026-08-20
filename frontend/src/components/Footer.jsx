import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <h2>FoodieHub</h2>
          <p>Delicious food. Easy ordering. Better experiences.</p>
        </div>
        <div className="footer-links">
          <div>
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/menu">Menu</Link>
          </div>
          <div>
            <h3>Customer Support</h3>
            <Link to="/contact">Contact Us</Link>
            <Link to="/order-history">Order Tracking</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 FoodieHub. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;