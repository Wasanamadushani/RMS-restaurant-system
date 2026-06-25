import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Delicious Food Delivered To Your Door</h1>

        <p>Fresh, Fast and Affordable Meals</p>

        <Link to="/menu">
          <button className="hero-btn">
            Explore Menu
          </button>

        </Link>

        


      </section>

      <section className="featured-foods">
        <h2>Popular Dishes</h2>

        <div className="food-grid">

          <div className="food-item">
            <img src="/images/burger.jpg" alt="" />
            <h3>Burger</h3>
          </div>

          <div className="food-item">
            <img src="/images/pizza.jpg" alt="" />
            <h3>Pizza</h3>
          </div>

          <div className="food-item">
            <img src="/images/pasta.jpg" alt="" />
            <h3>Pasta</h3>
          </div>

        </div>
      </section>

      <section className="features">
        <div className="card">
          <h3>🍔 Fresh Food</h3>
          <p>Prepared by experienced chefs.</p>
        </div>

        <div className="card">
          <h3>🚚 Fast Delivery</h3>
          <p>Get your food delivered quickly.</p>
        </div>

        <div className="card">
          <h3>⭐ Best Quality</h3>
          <p>High quality ingredients every day.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;