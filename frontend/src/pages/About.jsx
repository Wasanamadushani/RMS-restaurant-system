import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaHeart,
  FaUtensils,
  FaTruck,
} from "react-icons/fa";

const benefits = [
  {
    icon: <FaUtensils />,
    title: "Quality Food",
    text: "Enjoy delicious meals prepared with care using quality ingredients.",
  },
  {
    icon: <FaCheckCircle />,
    title: "Easy Ordering",
    text: "Browse our menu, customize your choices, and place your order with ease.",
  },
  {
    icon: <FaCreditCard />,
    title: "Secure Payments",
    text: "Choose convenient payment options with a secure and transparent payment process.",
  },
  {
    icon: <FaTruck />,
    title: "Reliable Delivery",
    text: "Track your order and receive your meals through an organized delivery process.",
  },
];

const steps = [
  { number: "01", icon: <FaUtensils />, title: "Browse", text: "Explore our menu and discover your favorite meals." },
  { number: "02", icon: <FaHeart />, title: "Order", text: "Add your meals to the cart and place your order." },
  { number: "03", icon: <FaClock />, title: "Prepare", text: "Our kitchen team prepares your order carefully." },
  { number: "04", icon: <FaTruck />, title: "Enjoy", text: "Receive your order and enjoy your meal." },
];

function About() {
  return (
    <main className="about-page">
      <header className="about-hero page-hero">
        <span className="eyebrow">THE FOODIEHUB STORY</span>
        <h1>About FoodieHub</h1>
        <p className="hero-subtitle">Good food, great people, and a better way to enjoy your favorite meals.</p>
        <p className="hero-intro">
          FoodieHub is a modern restaurant ordering platform designed to make discovering, ordering, and enjoying delicious food simple and convenient.
        </p>
      </header>

      <section className="about-story content-section">
        <div className="section-heading">
          <span className="eyebrow">BUILT AROUND YOUR TABLE</span>
          <h2>Who We Are</h2>
        </div>
        <div className="story-copy">
          <p>FoodieHub brings together delicious food, convenient ordering, secure payments, and reliable delivery in one simple platform. Our goal is to make every step of the food ordering experience easy for our customers.</p>
          <p>From browsing the menu to receiving your order at your doorstep, FoodieHub connects customers, restaurant staff, kitchen teams, cashiers, and delivery staff through one integrated system.</p>
        </div>
      </section>

      <section className="about-purpose content-section">
        <article className="purpose-panel">
          <span className="purpose-number">01</span>
          <h2>Our Mission</h2>
          <p>To provide a convenient, reliable, and enjoyable food ordering experience while helping restaurant teams manage orders efficiently.</p>
        </article>
        <article className="purpose-panel purpose-panel-dark">
          <span className="purpose-number">02</span>
          <h2>Our Vision</h2>
          <p>To become a trusted digital food ordering platform that connects customers with quality meals and creates a seamless restaurant experience.</p>
        </article>
      </section>

      <section className="benefits-section content-section">
        <div className="section-heading centered-heading">
          <span className="eyebrow">THE FOODIEHUB DIFFERENCE</span>
          <h2>Why Choose FoodieHub</h2>
        </div>
        <div className="benefit-grid">
          {benefits.map((benefit) => (
            <article className="benefit-card" key={benefit.title}>
              <div className="benefit-icon" aria-hidden="true">{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="steps-section content-section">
        <div className="section-heading centered-heading">
          <span className="eyebrow">FROM CRAVING TO DELIVERY</span>
          <h2>How FoodieHub Works</h2>
        </div>
        <div className="steps-grid">
          {steps.map((step) => (
            <article className="step-item" key={step.title}>
              <div className="step-topline"><span>{step.number}</span><div className="step-icon" aria-hidden="true">{step.icon}</div></div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-cta">
        <div>
          <span className="eyebrow">MAKE YOUR NEXT MEAL MEMORABLE</span>
          <h2>Ready to enjoy something delicious?</h2>
          <p>Explore our menu and place your next order with FoodieHub.</p>
        </div>
        <Link className="primary-action" to="/menu">Explore Menu</Link>
      </section>
    </main>
  );
}

export default About;
