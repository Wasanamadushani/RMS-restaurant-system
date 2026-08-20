import { useState } from "react";
import { FaClock, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

function Contact() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) nextErrors.name = "Please enter your name.";
    if (!formData.email.trim()) nextErrors.email = "Please enter your email address.";
    else if (!emailPattern.test(formData.email.trim())) nextErrors.email = "Please enter a valid email address.";
    if (formData.phone.trim() && !/^[+\d][\d\s()-]{6,}$/.test(formData.phone.trim())) nextErrors.phone = "Please enter a valid phone number.";
    if (!formData.subject.trim()) nextErrors.subject = "Please enter a subject.";
    if (!formData.message.trim()) nextErrors.message = "Please enter a message.";

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setFormData(initialForm);
    setErrors({});
    toast.success("Thank you for contacting FoodieHub! We'll get back to you soon.");
  };

  const contactDetails = [
    { icon: <FaPhoneAlt />, label: "Phone", content: <a href="tel:+94771234567">+94 77 123 4567</a> },
    { icon: <FaEnvelope />, label: "Email", content: <a href="mailto:support@foodiehub.com">support@foodiehub.com</a> },
    { icon: <FaMapMarkerAlt />, label: "Address", content: <span>FoodieHub Restaurant<br />Malabe, Sri Lanka</span> },
    { icon: <FaClock />, label: "Opening Hours", content: <span>Monday - Friday: 10:00 AM - 10:00 PM<br />Saturday - Sunday: 9:00 AM - 11:00 PM</span> },
  ];

  return (
    <main className="contact-page">
      <header className="contact-hero page-hero">
        <span className="eyebrow">WE ARE HERE TO HELP</span>
        <h1>Contact FoodieHub</h1>
        <p className="hero-subtitle">Have a question, need help with an order, or simply want to get in touch? We're here to help.</p>
      </header>

      <section className="contact-layout content-section">
        <div className="contact-information">
          <div className="section-heading">
            <span className="eyebrow">LET'S TALK</span>
            <h2>Contact Information</h2>
            <p>These sample business details are easy to update as FoodieHub grows.</p>
          </div>
          <div className="contact-details-grid">
            {contactDetails.map((detail) => (
              <article className="contact-detail-card" key={detail.label}>
                <div className="contact-detail-icon" aria-hidden="true">{detail.icon}</div>
                <div><h3>{detail.label}</h3><p>{detail.content}</p></div>
              </article>
            ))}
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="section-heading">
            <span className="eyebrow">SEND A NOTE</span>
            <h2>Get in Touch</h2>
            <p>Tell us how we can make your FoodieHub experience better.</p>
          </div>
          <div className="form-row">
            <div className="form-field"><label htmlFor="contact-name">Full Name</label><input id="contact-name" name="name" type="text" placeholder="Enter your name" value={formData.name} onChange={handleChange} aria-invalid={Boolean(errors.name)} />{errors.name && <span className="field-error">{errors.name}</span>}</div>
            <div className="form-field"><label htmlFor="contact-email">Email Address</label><input id="contact-email" name="email" type="email" placeholder="Enter your email address" value={formData.email} onChange={handleChange} aria-invalid={Boolean(errors.email)} />{errors.email && <span className="field-error">{errors.email}</span>}</div>
          </div>
          <div className="form-row">
            <div className="form-field"><label htmlFor="contact-phone">Phone Number <span>(optional)</span></label><input id="contact-phone" name="phone" type="tel" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} aria-invalid={Boolean(errors.phone)} />{errors.phone && <span className="field-error">{errors.phone}</span>}</div>
            <div className="form-field"><label htmlFor="contact-subject">Subject</label><input id="contact-subject" name="subject" type="text" placeholder="What can we help you with?" value={formData.subject} onChange={handleChange} aria-invalid={Boolean(errors.subject)} />{errors.subject && <span className="field-error">{errors.subject}</span>}</div>
          </div>
          <div className="form-field"><label htmlFor="contact-message">Message</label><textarea id="contact-message" name="message" rows="6" placeholder="Write your message here..." value={formData.message} onChange={handleChange} aria-invalid={Boolean(errors.message)} />{errors.message && <span className="field-error">{errors.message}</span>}</div>
          <button className="primary-action form-submit" type="submit">Send Message</button>
        </form>
      </section>
    </main>
  );
}

export default Contact;
