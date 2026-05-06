import React, { useState } from "react";
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer'
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Users,
  Shield,
  Star,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Menu,
  X,
  Check,
} from "lucide-react";

const MatrimonialHomepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const { ref, inView } = useInView({
        triggerOnce: true ,  // trigger only once
        threshold: 0.5,      // 50% of the div should be visible
  });

  const navigate=useNavigate()

  const gotoMatch=()=>{
    navigate('/match')
  }
  
  const registerPage=()=>{
    navigate('/register')
  }

  const login=()=>{
    navigate('/login')
  }

  // check the authentication
  const handleStart = () => {
    const isLoggedIn = localStorage.getItem("token");
    console.log(isLoggedIn)
    if (isLoggedIn) {
      navigate("/match");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-800 mr-2" />
              <span className="text-xl font-bold text-red-800"> Manomilan</span>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-gray-700 cursor-pointer hover:text-red-800 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-700 cursor-pointer hover:text-red-800 px-3 py-2 text-sm font-medium transition-colors"
                >
                  About Us
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-gray-700 cursor-pointer hover:text-red-800 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Contact Us
                </button>
                <button
                  onClick={() => scrollToSection("membership")}
                  className="text-gray-700 cursor-pointer hover:text-red-800 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Membership Plans
                </button>
                <button
                  onClick={() => registerPage()}
                  className="bg-red-800 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-900 transition-colors"
                >
                  Register
                </button>
                <button
                  onClick={() => login()}
                  className="bg-red-800 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-900 transition-colors"
                >
                  Login
                </button>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection("home")}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-800"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-800"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-800"
              >
                Contact Us
              </button>
              <button
                onClick={() => scrollToSection("membership")}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-800"
              >
                Membership Plans
              </button>
              <button
                onClick={() => scrollToSection("reach")}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-800"
              >
                Reach Us
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative py-20 bg-gradient-to-r from-red-800 to-red-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white open-sans">Manomilan</h1>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Find Your <span className="text-yellow-300">Perfect</span> Match
          </h1>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
            Join thousands of happy couples who found their soulmate through our
            trusted matrimonial platform. Start your journey to eternal
            happiness today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white cursor-pointer text-red-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            onClick={handleStart}
            >
              Find Your Match
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-red-800 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              About Manomilan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've been bringing hearts together for over a decade, creating
              countless love stories and happy families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-red-800 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                10M+ Members
              </h3>
              <p className="text-gray-600">
                Join our vast community of verified profiles from diverse
                backgrounds and cultures.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-red-800 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                100% Secure
              </h3>
              <p className="text-gray-600">
                Your privacy and security are our top priorities with advanced
                verification systems.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Heart className="h-12 w-12 text-red-800 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                50K+ Success Stories
              </h3>
              <p className="text-gray-600">
                Thousands of happy couples have found their Manomilan through
                our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Couples Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from real couples who found love
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border">
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-gray-600 mb-4 italic">
                " Manomilan helped us find each other in this vast world. We
                couldn't be happier!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Rahul & Priya</p>
                  <p className="text-sm text-gray-500">Married in 2023</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border">
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-gray-600 mb-4 italic">
                "The best decision we ever made was joining Manomilan. Highly
                recommended!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Amit & Sneha</p>
                  <p className="text-sm text-gray-500">Married in 2024</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border">
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Professional, secure, and effective. Found my soulmate within 3
                months!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center text-white font-bold">
                  V
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Vikash & Anita</p>
                  <p className="text-sm text-gray-500">Married in 2024</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border">
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Amazing platform with genuine profiles. Thank you for bringing
                us together!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Suresh & Kavya</p>
                  <p className="text-sm text-gray-500">Married in 2023</p>
                </div>
              </div>
            </div>
          </div>

          <div className='mx-auto text-center'>
                <h1 className='text-4xl font-bold text-[#7d0a0a] mb-[50px]'>Why Choose Us</h1>
                <div className='w-[80%] mx-auto flex justify-between gap-8'>
                    <div ref={ref} className="text-center">
                        <h1 className="text-5xl font-bold text-[#7d0a0a]">
                        {inView && <CountUp start={0} end={100} duration={2} />}+
                        </h1>
                        <p className="mt-2 text-gray-700 text-xl">Happy Parents</p>
                    </div>
                    <div ref={ref} className="text-center">
                        <h1 className="text-5xl font-bold text-[#7d0a0a]">
                        {inView && <CountUp start={0} end={200} duration={2} />}+
                        </h1>
                        <p className="mt-2 text-gray-700 text-xl">Happy Faces</p>
                    </div>
                    <div ref={ref} className="text-center">
                        <h1 className="text-5xl font-bold text-[#7d0a0a]">
                        {inView && <CountUp start={0} end={10} duration={2} />}+
                        </h1>
                        <p className="mt-2 text-gray-700 text-xl">More Trust Partners</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section id="membership" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-gray-600">
              Find the membership that suits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
                <div className="text-4xl font-bold text-red-800 mb-4">
                  ₹999<span className="text-lg text-gray-500">/month</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    View up to 50 profiles
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Send 10 interests
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Basic search filters
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Email support
                  </li>
                </ul>
                <button className="w-full bg-red-800 text-white py-3 rounded-lg font-semibold hover:bg-red-900 transition-colors">
                  Get Started
                </button>
              </div>
            </div>

            <div className="bg-red-800 p-8 rounded-2xl shadow-2xl transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-6 py-2 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                <div className="text-4xl font-bold text-white mb-4">
                  ₹2999<span className="text-lg text-red-200">/month</span>
                </div>
                <ul className="text-left space-y-3 mb-8 text-white">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-yellow-400 mr-2" />
                    Unlimited profile views
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-yellow-400 mr-2" />
                    Unlimited interests
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-yellow-400 mr-2" />
                    Advanced search filters
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-yellow-400 mr-2" />
                    Direct messaging
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-yellow-400 mr-2" />
                    Priority support
                  </li>
                </ul>
                <button className="w-full bg-white text-red-800 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Choose Premium
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-yellow-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Elite</h3>
                <div className="text-4xl font-bold text-red-800 mb-4">
                  ₹4999<span className="text-lg text-gray-500">/month</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Everything in Premium
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Personal matchmaker
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Profile highlighting
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    VIP customer support
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Exclusive events access
                  </li>
                </ul>
                <button className="w-full bg-red-800 text-white py-3 rounded-lg font-semibold hover:bg-red-900 transition-colors">
                  Go Elite
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600">
              Have questions? We'd love to hear from you
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl shadow-lg p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  className="bg-red-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-900 transition-colors shadow-lg inline-flex items-center"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reach Us Section */}
      <section id="reach" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Reach Out to Us
            </h2>
            <p className="text-xl text-gray-600">
              Multiple ways to connect with our team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <Phone className="h-12 w-12 text-red-800 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Call Us
              </h3>
              <p className="text-gray-600 mb-2">
                Speak directly with our support team
              </p>
              <p className="text-red-800 font-semibold">+91 98765 43210</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <Mail className="h-12 w-12 text-red-800 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Email Us
              </h3>
              <p className="text-gray-600 mb-2">Send us your queries anytime</p>
              <p className="text-red-800 font-semibold">
                support@perfectmatch.com
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <MapPin className="h-12 w-12 text-red-800 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Visit Us
              </h3>
              <p className="text-gray-600 mb-2">
                Our office is always open for you
              </p>
              <p className="text-red-800 font-semibold">Mumbai, Maharashtra</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-red-800 mr-2" />
                <span className="text-2xl font-bold"> Manomilan</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Connecting hearts and creating beautiful love stories since
                2010. Your journey to finding the perfect partner starts here.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-6 w-6 text-gray-400 hover:text-red-800 cursor-pointer transition-colors" />
                <Twitter className="h-6 w-6 text-gray-400 hover:text-red-800 cursor-pointer transition-colors" />
                <Instagram className="h-6 w-6 text-gray-400 hover:text-red-800 cursor-pointer transition-colors" />
                <Linkedin className="h-6 w-6 text-gray-400 hover:text-red-800 cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("home")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("membership")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Membership
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Our Location</h3>
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center h-32 bg-gray-700 rounded text-gray-400">
                  <MapPin className="h-8 w-8 mr-2" />
                  <span>Interactive Map</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                123 Love Street, Heart City
                <br />
                Mumbai, Maharashtra 400001
                <br />
                India
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Manomilan. All rights reserved. | Privacy Policy | Terms of
              Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MatrimonialHomepage;
