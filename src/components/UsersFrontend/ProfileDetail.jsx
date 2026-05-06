import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const mockUsers = [
    {
      id: 1,
      name: "Priya Sharma",
      age: 28,
      religion: "Hindu",
      caste: "Brahmin",
      education: "MBA",
      occupation: "Software Engineer",
      location: "Mumbai, Maharashtra",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      interests: ["Reading", "Travel", "Cooking"],
      bio: "Family-oriented person who loves exploring new cultures and cooking traditional recipes.",
      match: 95
    },
    {
      id: 2,
      name: "Arjun Patel",
      age: 32,
      religion: "Hindu",
      caste: "Patel",
      education: "Engineering",
      occupation: "Business Owner",
      location: "Ahmedabad, Gujarat",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      interests: ["Fitness", "Photography", "Music"],
      bio: "Passionate entrepreneur who believes in work-life balance and family values.",
      match: 92
    },
    {
      id: 3,
      name: "Sneha Reddy",
      age: 26,
      religion: "Hindu",
      caste: "Reddy",
      education: "Masters",
      occupation: "Teacher",
      location: "Hyderabad, Telangana",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      interests: ["Art", "Dancing", "Literature"],
      bio: "Creative soul with a passion for education and arts. Looking for a life partner to share beautiful moments.",
      match: 88
    },
    {
      id: 4,
      name: "Rohit Kumar",
      age: 30,
      religion: "Hindu",
      caste: "Kshatriya",
      education: "CA",
      occupation: "Chartered Accountant",
      location: "Delhi, India",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      interests: ["Finance", "Cricket", "Movies"],
      bio: "Dedicated professional with strong family values. Enjoys weekend cricket matches and movie nights.",
      match: 85
    },
    {
      id: 5,
      name: "Ananya Singh",
      age: 29,
      religion: "Hindu",
      caste: "Rajput",
      education: "MBBS",
      occupation: "Doctor",
      location: "Bangalore, Karnataka",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
      interests: ["Medicine", "Yoga", "Volunteering"],
      bio: "Compassionate doctor who loves helping others. Seeking a partner who shares similar values of service.",
      match: 90
    },
    {
      id: 6,
      name: "Vikram Joshi",
      age: 34,
      religion: "Hindu",
      caste: "Brahmin",
      education: "PhD",
      occupation: "Research Scientist",
      location: "Pune, Maharashtra",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
      interests: ["Research", "Technology", "Chess"],
      bio: "Intellectual and thoughtful person who loves deep conversations and scientific discoveries.",
      match: 87
    }
];

const ProfileDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = mockUsers.find(u => u.id === parseInt(id));

  if (!user) return <div className="p-6 text-center text-red-600">Profile not found.</div>;

  return (
    <div className="min-h-screen bg-red-50 p-6">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 bg-white text-red-800 px-4 py-2 rounded shadow hover:bg-red-100 transition"
      >
        ← Back to Matches
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <img src={user.image} alt={user.name} className="w-60 h-60 rounded-xl object-cover border-4 border-red-200" />
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">{user.name}, {user.age}</h2>
            <p><strong>Location:</strong> {user.location}</p>
            <p><strong>Religion:</strong> {user.religion} - {user.caste}</p>
            <p><strong>Education:</strong> {user.education}</p>
            <p><strong>Occupation:</strong> {user.occupation}</p>
            <p><strong>Bio:</strong> {user.bio}</p>
            <p><strong>Match Score:</strong> {user.match}%</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {user.interests.map((interest, index) => (
                <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailsPage;
