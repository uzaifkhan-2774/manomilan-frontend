import React, { useState } from 'react';
import { Heart, MapPin, Briefcase, GraduationCap, Phone, Mail, Camera, Edit3, Star, Calendar, Users, Home, Save, X, Check } from 'lucide-react';

const MatrimonyProfile = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState('');

  const [profileData, setProfileData] = useState({
    name: "Priya Sharma",
    age: 26,
    profileId: "MAT123456",
    location: "Mumbai, Maharashtra",
    profession: "Software Engineer",
    education: "B.Tech Computer Science",
    photos: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&crop=face"
    ],
    isOnline: true,
    lastSeen: "2 hours ago",
    verified: true,
    premium: true,
    phone: "+91 98765 43210",
    email: "priya.sharma@email.com"
  });

  const [aboutInfo, setAboutInfo] = useState({
    height: "5'4\"",
    weight: "55 kg",
    complexion: "Fair",
    bodyType: "Slim",
    maritalStatus: "Never Married",
    religion: "Hindu",
    caste: "Brahmin",
    motherTongue: "Hindi",
    diet: "Vegetarian",
    drinking: "Never",
    smoking: "Never",
    aboutText: "I am a passionate software engineer with a love for technology and innovation. I believe in maintaining a balance between career and personal life. I enjoy reading, traveling, and spending time with family. Looking for a life partner who shares similar values and interests."
  });

  const [familyInfo, setFamilyInfo] = useState({
    fatherOccupation: "Business Owner",
    motherOccupation: "Homemaker",
    siblings: "1 Brother (Younger)",
    familyType: "Nuclear Family",
    familyValues: "Traditional",
    familyText: "We are a close-knit family that values traditions while embracing modernity. My father runs a successful business and my mother is a homemaker who takes care of the family. We believe in supporting each other through all phases of life."
  });

  const [preferences, setPreferences] = useState({
    ageRange: "25-30 years",
    heightRange: "5'6\" - 6'0\"",
    education: "Graduate or above",
    profession: "Any",
    location: "Mumbai, Delhi, Bangalore",
    preferencesText: "I am looking for a life partner who is understanding, caring, and shares similar values. Someone who is educated, has a good sense of humor, and believes in building a strong relationship based on mutual respect and love. Family values and compatibility are important to me."
  });

  const [tempValue, setTempValue] = useState('');

  const handleEdit = (field, currentValue, category = 'profile') => {
    setEditingField(`${category}.${field}`);
    setTempValue(currentValue || '');
  };

  const handleSave = (field, category = 'profile') => {
    if (category === 'profile') {
      setProfileData(prev => ({ ...prev, [field]: tempValue }));
    } else if (category === 'about') {
      setAboutInfo(prev => ({ ...prev, [field]: tempValue }));
    } else if (category === 'family') {
      setFamilyInfo(prev => ({ ...prev, [field]: tempValue }));
    } else if (category === 'preferences') {
      setPreferences(prev => ({ ...prev, [field]: tempValue }));
    }
    setEditingField('');
    setTempValue('');
  };

  const handleCancel = () => {
    setEditingField('');
    setTempValue('');
  };

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 font-medium rounded-lg transition-all ${
        isActive 
          ? 'bg-[#7d0a0a] text-white shadow-lg' 
          : 'bg-white text-[#7d0a0a] border border-[#7d0a0a] hover:bg-[#7d0a0a] hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  const EditableField = ({ label, value, field, category = 'profile', icon: Icon, isTextArea = false }) => {
    const fieldKey = `${category}.${field}`;
    const isEditing = editingField === fieldKey;

    return (
      <div className="flex items-start gap-3 py-3 border-b border-gray-100">
        {Icon && <Icon size={18} className="text-[#7d0a0a] mt-1" />}
        <div className="flex-1">
          <span className="font-medium text-gray-700">{label}:</span>
          {isEditing ? (
            <div className="mt-2">
              {isTextArea ? (
                <textarea
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent resize-none"
                  rows="4"
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent"
                  autoFocus
                />
              )}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleSave(field, category)}
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between group">
              <span className="ml-2 text-gray-900">{value}</span>
              <button
                onClick={() => handleEdit(field, value, category)}
                className="opacity-0 group-hover:opacity-100 text-[#7d0a0a] hover:bg-[#7d0a0a] hover:text-white p-1 rounded transition-all"
              >
                <Edit3 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const EditableText = ({ title, text, field, category }) => {
    const fieldKey = `${category}.${field}`;
    const isEditing = editingField === fieldKey;

    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
          {!isEditing && (
            <button
              onClick={() => handleEdit(field, text, category)}
              className="text-[#7d0a0a] hover:bg-[#7d0a0a] hover:text-white p-2 rounded-lg transition-all"
            >
              <Edit3 size={16} />
            </button>
          )}
        </div>
        {isEditing ? (
          <div>
            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent resize-none"
              rows="5"
              autoFocus
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleSave(field, category)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Check size={16} />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed">{text}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Header */}
      <div className="bg-[#7d0a0a] text-white py-6 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              
              <h1 className="text-2xl font-bold">My Profile</h1>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => window.location.href = '/match'}
                className="flex items-center gap-2 bg-white text-[#7d0a0a] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                <Home size={18} />
                Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={profileData.photos[0]}
                  alt={profileData.name}
                  className="w-full h-80 object-cover"
                />
              </div>

              {/* Profile Info */}
              <div className="p-6">
                <div className="group">
                  <div className="flex items-center justify-between mb-1">
                    {editingField === 'profile.name' ? (
                      <div className="flex-1">
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          className="text-2xl font-bold w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent"
                          autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleSave('name', 'profile')}
                            className="bg-green-500 text-white p-1 rounded"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-500 text-white p-1 rounded"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                        <button
                          onClick={() => handleEdit('name', profileData.name, 'profile')}
                          className="opacity-0 group-hover:opacity-100 text-[#7d0a0a] hover:bg-[#7d0a0a] hover:text-white p-1 rounded transition-all"
                        >
                          <Edit3 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-2">ID: {profileData.profileId}</p>
                
                <div className="space-y-3 mb-6">
                  <EditableField 
                    label="Age" 
                    value={`${profileData.age} years old`} 
                    field="age" 
                    category="profile" 
                    icon={Calendar} 
                  />
                  <EditableField 
                    label="Location" 
                    value={profileData.location} 
                    field="location" 
                    category="profile" 
                    icon={MapPin} 
                  />
                  <EditableField 
                    label="Profession" 
                    value={profileData.profession} 
                    field="profession" 
                    category="profile" 
                    icon={Briefcase} 
                  />
                  <EditableField 
                    label="Education" 
                    value={profileData.education} 
                    field="education" 
                    category="profile" 
                    icon={GraduationCap} 
                  />
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowContactInfo(!showContactInfo)}
                    className="w-full bg-[#7d0a0a] text-white py-3 rounded-lg font-medium hover:bg-[#5f0808] transition-colors"
                  >
                    {showContactInfo ? 'Hide Contact Info' : 'Show Contact Info'}
                  </button>
                  
                  {showContactInfo && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <EditableField 
                        label="Phone" 
                        value={profileData.phone} 
                        field="phone" 
                        category="profile" 
                        icon={Phone} 
                      />
                      <EditableField 
                        label="Email" 
                        value={profileData.email} 
                        field="email" 
                        category="profile" 
                        icon={Mail} 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="bg-white rounded-2xl shadow-xl mt-6 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Camera className="text-[#7d0a0a]" />
                Photos ({profileData.photos.length})
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {profileData.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex flex-wrap gap-4 mb-6">
              <TabButton id="about" label="About" isActive={activeTab === 'about'} onClick={setActiveTab} />
              <TabButton id="family" label="Family" isActive={activeTab === 'family'} onClick={setActiveTab} />
              <TabButton id="preferences" label="Preferences" isActive={activeTab === 'preferences'} onClick={setActiveTab} />
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {activeTab === 'about' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">About Me</h3>
                  <div className="space-y-1">
                    <EditableField label="Height" value={aboutInfo.height} field="height" category="about" />
                    <EditableField label="Weight" value={aboutInfo.weight} field="weight" category="about" />
                    <EditableField label="Complexion" value={aboutInfo.complexion} field="complexion" category="about" />
                    <EditableField label="Body Type" value={aboutInfo.bodyType} field="bodyType" category="about" />
                    <EditableField label="Marital Status" value={aboutInfo.maritalStatus} field="maritalStatus" category="about" />
                    <EditableField label="Religion" value={aboutInfo.religion} field="religion" category="about" />
                    <EditableField label="Caste" value={aboutInfo.caste} field="caste" category="about" />
                    <EditableField label="Mother Tongue" value={aboutInfo.motherTongue} field="motherTongue" category="about" />
                    <EditableField label="Diet" value={aboutInfo.diet} field="diet" category="about" />
                    <EditableField label="Drinking" value={aboutInfo.drinking} field="drinking" category="about" />
                    <EditableField label="Smoking" value={aboutInfo.smoking} field="smoking" category="about" />
                  </div>
                  
                  <EditableText 
                    title="About Myself" 
                    text={aboutInfo.aboutText} 
                    field="aboutText" 
                    category="about" 
                  />
                </div>
              )}

              {activeTab === 'family' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Users className="text-[#7d0a0a]" />
                    Family Details
                  </h3>
                  <div className="space-y-1">
                    <EditableField label="Father's Occupation" value={familyInfo.fatherOccupation} field="fatherOccupation" category="family" />
                    <EditableField label="Mother's Occupation" value={familyInfo.motherOccupation} field="motherOccupation" category="family" />
                    <EditableField label="Siblings" value={familyInfo.siblings} field="siblings" category="family" />
                    <EditableField label="Family Type" value={familyInfo.familyType} field="familyType" category="family" />
                    <EditableField label="Family Values" value={familyInfo.familyValues} field="familyValues" category="family" />
                  </div>
                  
                  <EditableText 
                    title="About My Family" 
                    text={familyInfo.familyText} 
                    field="familyText" 
                    category="family" 
                  />
                </div>
              )}

              {activeTab === 'preferences' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Heart className="text-[#7d0a0a]" />
                    Partner Preferences
                  </h3>
                  <div className="space-y-1">
                    <EditableField label="Age Range" value={preferences.ageRange} field="ageRange" category="preferences" />
                    <EditableField label="Height Range" value={preferences.heightRange} field="heightRange" category="preferences" />
                    <EditableField label="Education" value={preferences.education} field="education" category="preferences" />
                    <EditableField label="Profession" value={preferences.profession} field="profession" category="preferences" />
                    <EditableField label="Location" value={preferences.location} field="location" category="preferences" />
                  </div>
                  
                  <EditableText 
                    title="What I'm Looking For" 
                    text={preferences.preferencesText} 
                    field="preferencesText" 
                    category="preferences" 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrimonyProfile;