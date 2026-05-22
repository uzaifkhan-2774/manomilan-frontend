import React from "react";
import { Heart, Star, Users, Mail, Phone, MapPin, Facebook } from "lucide-react";
import CoupleHand from "../../assets/CoupleHand.jpeg";
import CoupleHandT from "../../assets/CoupleHand2.jpeg";
import CouplePhoto from "../../assets/CouplePhoto.jpeg";
import CouplePhotoT from "../../assets/CouplePhoto2.jpeg";
import ManomilanLogo from '../../assets/ManomilanLogo.png'
import { useNavigate } from "react-router-dom";
import Snehal from '../../assets/Snehal.jpg'


const SuccessStories = () => {
  const navigate = useNavigate()
  // Mock testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Snehal & Vishwasrao",
      rating: 5,
      text: "We found each other through this amazing platform. The journey from strangers to soulmates has been incredible. Thank you for bringing us together!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Sneha & Vikram",
      rating: 5,
      text: "After years of searching, we finally found our perfect match. The compatibility matching system is truly remarkable. Highly recommended!",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b812?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Anjali & Rohit",
      rating: 5,
      text: "From the first conversation to our wedding day, everything felt so natural. This platform helped us find not just love, but our best friend for life.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2 w-[40%] md:max-w-[200px] lg:max-w-[200px] xl:max-w-[200px]">
              <img src={ManomilanLogo} alt="" />
            </div>

            {/* Navigation & Auth Buttons */}
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-6 list-none">
                <li className="text-gray-700 hover:text-rose-600 transition-colors cursor-pointer" onClick={()=>navigate('/')} >Home</li>
                <li className="text-gray-700 hover:text-rose-600 transition-colors cursor-pointer" onClick={() => document.getElementById("stories").scrollIntoView({ behavior: "smooth" })}>Success Stories</li>
                <li className="text-gray-700 hover:text-rose-600 transition-colors cursor-pointer" onClick={() => document.getElementById("about").scrollIntoView({ behavior: "smooth" })}>About</li>
              </nav>
              
              <div className="flex space-x-3">
                <button className="px-4 py-2 text-rose-600 border border-rose-600 rounded-lg hover:bg-rose-50 transition-colors" onClick={()=>navigate('/')}>
                  Login
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all transform hover:scale-105" onClick={()=>navigate('/register-user')}>
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        {/* Success Stories Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Success Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real couples, real love stories. Discover how thousands of people found their perfect match through our platform.
          </p>
        </div>

        {/* Success Stories Cards */}
        <div className="w-[90%] max-w-7xl mx-auto" id="stories">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { image: Snehal, names: "Snehal Doifode" },
              { image: CoupleHandT, names: "Rushikesh" },
              { image: Snehal, names: "Sneha" },
              { image: CouplePhotoT, names: "Anjali" }
            ].map((couple, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden h-80 w-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                style={{
                  backgroundImage: `url(${couple.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-rose-600/80 via-transparent to-transparent group-hover:from-rose-700/90 transition-all duration-300"></div>

                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-xl font-semibold leading-tight">{couple.names.split(' & ')[0]}</div>
                  {/* <div className="text-xl font-semibold leading-tight">&</div> */}
                  <div className="text-xl font-semibold leading-tight">{couple.names.split(' & ')[1]}</div>
                </div>

                <div className="absolute bottom-4 right-4">
                  <button className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all duration-300 group-hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white py-16 mb-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-rose-600">10,000+</div>
                <div className="text-gray-600">Success Stories</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-rose-600">500K+</div>
                <div className="text-gray-600">Happy Members</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-rose-600">15+</div>
                <div className="text-gray-600">Years of Trust</div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-7xl mx-auto px-4 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our Couples Say
            </h2>
            <p className="text-lg text-gray-600">
              Read the heartwarming testimonials from couples who found love through our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* about section  */}
        <div id="about"></div>
        <div className="max-w-7xl mx-auto px-4 mb-16" >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              About Us
            </h2>
            <p className="text-lg text-gray-600">
              
            </p>
          </div>
          <div className="w-full">
            <p className="font-sans text-gray-600">
Manomilan combines traditional aspects with modern requirements through a most advanced matrimonial website application for different communities throughout India.
Candidates from all religions and castes can register free and access information through premium membership.
<br />
The website is a great help to candidates who are offshore or working/living away from home towns and cities for searching through thousands of registered candidates by minimising efforts and saving time. Specific information regarding expectations can be updated at all times online with accuracy, full reliability, confidentiality and privacy.

The site is designed specifically to save time and efforts for searching prospective candidates at far flung locations as photo images can be very easily uploaded.
<br />

With rapid increase in internet connectivity and preference for easy and comfortable time schedules this online web applicaton caters to all. Needless to say our offline facilities also help a great deal to search for a right partner.

REACH US Anytime! We are HERE!!!
<br />

Manomilan.com 
        </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r p-2 rounded-full">
                  <img src={ManomilanLogo} alt="" />
                </div>
              </div>
              <p className="text-gray-400">
                Connecting hearts and creating beautiful love stories since 2011. Your journey to finding true love starts here.
              </p>
              <div className="flex flex-col gap-3 items-start space-x-4">
                <div className="flex gap-3 items-center">
                  <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors">
                  <Facebook className="h-5 w-5" /> 
                </button>
                manomilan Matrimony
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400  list-none">
                <li className="hover:text-white transition-colors">Home</li>
                <li className="hover:text-white transition-colors">Success Stories</li>
                <li className="hover:text-white transition-colors">About Us</li>
                <li className="hover:text-white transition-colors">How It Works</li>
                <li className="hover:text-white transition-colors">Privacy Policy</li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Tips</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5" />
                  <span>manomilan20@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5" />
                  <span>+91 82082 80085</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5" />
                  <span>Shop No. SF/53, Vidarbha Sahitya Sangh Sankul, <br /> Jhansi Rani Sq., Sitabuldi, <br /> Nagpur- 440012</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>Powered By - Manisha Systems | Designed and Developed By - Alkesh Mahamune & Manas Kokate</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SuccessStories;