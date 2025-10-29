import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import BottomNavbar from '../../components/common/BottomNavbar';

const MentorProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mentor profile data
  const [profileData, setProfileData] = useState({
    name: 'Dr. Sarah Johnson',
    title: 'Senior Software Engineer',
    company: 'Tech Solutions Inc.',
    experience: '8 years',
    specialization: 'Full Stack Development, React, Node.js',
    bio: 'Passionate mentor with 8 years of experience in software development. I love helping aspiring developers grow their skills and advance their careers.',
    profileImage: '👩‍💻',
    rating: 4.9,
    totalSessions: 156,
    responseTime: '2 hours',
    
    // Availability
    availability: {
      monday: { available: true, startTime: '09:00', endTime: '17:00' },
      tuesday: { available: true, startTime: '09:00', endTime: '17:00' },
      wednesday: { available: true, startTime: '09:00', endTime: '17:00' },
      thursday: { available: true, startTime: '09:00', endTime: '17:00' },
      friday: { available: true, startTime: '09:00', endTime: '17:00' },
      saturday: { available: false, startTime: '', endTime: '' },
      sunday: { available: false, startTime: '', endTime: '' }
    },
    
    // Pricing
    pricing: {
      videoCall: 50,
      phoneCall: 30,
      chat: 20,
      email: 15
    },
    
    // Contact methods
    contactMethods: {
      videoCall: true,
      phoneCall: true,
      chat: true,
      email: true
    },
    
    // Skills and expertise
    skills: [
      'React.js', 'Node.js', 'JavaScript', 'TypeScript', 
      'MongoDB', 'PostgreSQL', 'AWS', 'Docker'
    ],
    
    // Languages
    languages: ['English', 'Hindi', 'Spanish'],
    
    // Education
    education: [
      {
        degree: 'Master of Computer Science',
        university: 'Stanford University',
        year: '2015'
      },
      {
        degree: 'Bachelor of Engineering',
        university: 'IIT Delhi',
        year: '2013'
      }
    ],
    
    // Certifications
    certifications: [
      'AWS Certified Solutions Architect',
      'Google Cloud Professional Developer',
      'Certified Kubernetes Administrator'
    ]
  });

  const [formData, setFormData] = useState(profileData);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const handleSave = () => {
    setProfileData(formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    navigate('/mentors');
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'availability', label: 'Availability' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'settings', label: 'Settings' }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
            {isEditing ? formData.profileImage : profileData.profileImage}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-white/20 text-white placeholder-white/80 rounded-lg px-3 py-2 w-full mb-2"
                placeholder="Your Name"
              />
            ) : (
              <h2 className="text-2xl font-bold">{profileData.name}</h2>
            )}
            {isEditing ? (
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="bg-white/20 text-white placeholder-white/80 rounded-lg px-3 py-2 w-full mb-2"
                placeholder="Your Title"
              />
            ) : (
              <p className="text-orange-100">{profileData.title}</p>
            )}
            {isEditing ? (
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="bg-white/20 text-white placeholder-white/80 rounded-lg px-3 py-2 w-full"
                placeholder="Your Company"
              />
            ) : (
              <p className="text-orange-100">{profileData.company}</p>
            )}
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{profileData.rating}</div>
            <div className="text-orange-100 text-sm">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{profileData.totalSessions}</div>
            <div className="text-orange-100 text-sm">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{profileData.responseTime}</div>
            <div className="text-orange-100 text-sm">Response</div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">About Me</h3>
        {isEditing ? (
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            rows="4"
            placeholder="Tell us about yourself..."
          />
        ) : (
          <p className="text-gray-600 leading-relaxed">{profileData.bio}</p>
        )}
      </div>

      {/* Skills */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills & Expertise</h3>
        <div className="flex flex-wrap gap-2">
          {profileData.skills.map((skill, index) => (
            <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Education</h3>
        <div className="space-y-3">
          {profileData.education.map((edu, index) => (
            <div key={index} className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
              <p className="text-gray-600">{edu.university}</p>
              <p className="text-gray-500 text-sm">{edu.year}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Certifications</h3>
        <div className="space-y-2">
          {profileData.certifications.map((cert, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-orange-500">🏆</span>
              <span className="text-gray-700">{cert}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAvailabilityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Availability</h3>
        <div className="space-y-4">
          {Object.entries(formData.availability).map(([day, schedule]) => (
            <div key={day} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <input
                  type="checkbox"
                  checked={schedule.available}
                  onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                  className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                />
                <span className="font-medium text-gray-800 capitalize">{day}</span>
              </div>
              {schedule.available && (
                <div className="mt-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 font-medium">From</label>
                      <input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 font-medium">To</label>
                      <input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );

  const renderPricingTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Pricing (USD per hour)</h3>
        <div className="space-y-4">
          {Object.entries(formData.pricing)
            .filter(([method]) => method === 'email')
            .map(([method, price]) => (
              <div key={method} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📧</span>
                  <span className="font-medium text-gray-800">Email Consultation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">$</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => handleNestedInputChange('pricing', method, parseInt(e.target.value))}
                    className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-right"
                    min="0"
                  />
                  <span className="text-gray-500">/hr</span>
                </div>
              </div>
            ))}
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Note: Session links will be shared via email within 24 hours after booking confirmation.
        </p>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 Pricing Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Consider your experience level when setting prices</li>
          <li>• Research market rates for your specialization</li>
          <li>• Start competitive and adjust based on demand</li>
          <li>• Session links will be shared via email after payment</li>
        </ul>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="font-medium text-gray-800">Email Notifications</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500" />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="font-medium text-gray-800">SMS Notifications</span>
            <input type="checkbox" className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500" />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="font-medium text-gray-800">Profile Visibility</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Languages</h3>
        <div className="space-y-2">
          {formData.languages.map((language, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="font-medium text-gray-800">{language}</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Danger Zone</h3>
        <p className="text-red-600 text-sm mb-4">These actions cannot be undone.</p>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/mentors')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">Mentor Profile</h1>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-semibold"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/mentors')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">Mentor Profile</h1>
          </div>
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-semibold"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-20 md:pb-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-lg overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center justify-center py-2 px-3 rounded-lg transition-all duration-300 text-xs md:text-sm ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'availability' && renderAvailabilityTab()}
          {activeTab === 'pricing' && renderPricingTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavbar />
    </div>
  );
};

export default MentorProfilePage;
