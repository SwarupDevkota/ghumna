import React, { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Your message has been sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // Reset form
      } else {
        toast.error("Failed to send your message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#FFD700] py-12 px-6 md:px-12 rounded-lg shadow-lg">
      <ToastContainer />
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
        Get in Touch
      </h2>
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
        {/* Contact Info */}
        <div>
          <p className="text-gray-700">
            We'd love to hear from you! Reach out to us with your queries,
            feedback, or partnership ideas.
          </p>
          <div className="mt-4 flex items-center text-gray-700">
            <Mail className="mr-2" />
            <strong>Email:</strong> contact@ghumnajam.com
          </div>
          <div className="mt-2 flex items-center text-gray-700">
            <Phone className="mr-2" />
            <strong>Phone:</strong> +1 (123) 456-7890
          </div>
        </div>

        {/* Contact Form */}
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
            rows="4"
            required
          ></textarea>
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white rounded-lg hover:bg-gray-700 ${
              isSubmitting ? "bg-gray-600 cursor-not-allowed" : "bg-gray-800"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
