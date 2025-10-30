import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { mentorAPI } from '../../utils/api';

const MentorProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Default mentor profile data to avoid slow loading
  const defaultPricing = {
    quick: {
      duration: '20-25 minutes',
      price: 150,
      label: 'Quick consultation'
    },
    inDepth: {
      duration: '50-60 minutes',
      price: 300,
      label: 'In-depth session'
    },
    comprehensive: {
      duration: '90-120 minutes',
      price: 450,
      label: 'Comprehensive consultation'
    }
  };

  const defaultProfile = {
    firstName: 'Mentor',
    lastName: 'Name',
    title: 'Senior Mentor',
    company: 'Your Company',
    experience: '5+ years',
    specialization: 'Business & Strategy',
    bio: 'Experienced mentor helping businesses grow.',
    profileImage: null,
    rating: 0,
    totalSessions: 0,
    responseTime: '24 hours',
    pricing: defaultPricing,
    skills: ['Strategy', 'Business'],
    languages: ['English', 'Hindi'],
    education: [],
    certifications: [],
    categories: [],
    profileVisibility: true
  };
  
  // Mentor profile data
  const [profileData, setProfileData] = useState(defaultProfile);
  const [formData, setFormData] = useState(defaultProfile);

  // Fetch mentor profile on mount (optional, runs in background)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('mentorToken');
        if (!token) {
          return;
        }

        const response = await mentorAPI.getMe(token);
        if (response.success && response.data.mentor) {
          const mentor = response.data.mentor;

          const profile = {
            firstName: mentor.firstName || defaultProfile.firstName,
            lastName: mentor.lastName || defaultProfile.lastName,
            title: mentor.title || defaultProfile.title,
            company: mentor.company || defaultProfile.company,
            experience: mentor.experience || defaultProfile.experience,
            specialization: mentor.specialization || defaultProfile.specialization,
            bio: mentor.bio || defaultProfile.bio,
            profileImage: mentor.profileImage || null,
            rating: mentor.rating || 0,
            totalSessions: mentor.totalSessions || 0,
            responseTime: mentor.responseTime || defaultProfile.responseTime,
            pricing: mentor.pricing || defaultPricing,
            skills: mentor.skills || defaultProfile.skills,
            languages: mentor.languages || defaultProfile.languages,
            education: mentor.education || [],
            certifications: mentor.certifications || [],
            categories: mentor.categories || [],
            profileVisibility: mentor.profileVisibility !== false
          };

          setProfileData(profile);
          setFormData(profile);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        // Don't block UI for API errors
      }
    };

    fetchProfile();
  }, []);

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

  const handleSave = async () => {
    if (!formData) return;

    setIsSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('mentorToken');
      if (!token) {
        navigate('/mentors/login');
        return;
      }

      // Prepare data for API
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        title: formData.title,
        company: formData.company,
        specialization: formData.specialization,
        experience: formData.experience,
        bio: formData.bio,
        profileImage: formData.profileImage,
        skills: formData.skills,
        languages: formData.languages,
        education: formData.education,
        certifications: formData.certifications,
        pricing: formData.pricing,
        categories: formData.categories,
        responseTime: formData.responseTime,
        profileVisibility: formData.profileVisibility
      };

      const response = await mentorAPI.updateProfile(token, updateData);

      if (response.success) {
    setProfileData(formData);
    setIsEditing(false);
        // Update localStorage with new mentor data
        const updatedMentor = { ...response.data.mentor };
        localStorage.setItem('mentorData', JSON.stringify(updatedMentor));
    alert('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      alert(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('mentorToken');
    localStorage.removeItem('isMentorLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('mentorData');
    navigate('/mentors/login');
  };

  // Add skill
  const handleAddSkill = () => {
    const skill = prompt('Enter a skill:');
    if (skill && skill.trim() && !formData.skills.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  // Remove skill
  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Add language
  const handleAddLanguage = () => {
    const language = prompt('Enter a language:');
    if (language && language.trim() && !formData.languages.includes(language.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, language.trim()]
      }));
    }
  };

  // Remove language
  const handleRemoveLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  // Add education
  const handleAddEducation = () => {
    const degree = prompt('Enter degree:');
    const university = prompt('Enter university:');
    const year = prompt('Enter year:');
    if (degree && university && year) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, { degree: degree.trim(), university: university.trim(), year: year.trim() }]
      }));
    }
  };

  // Remove education
  const handleRemoveEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Add certification
  const handleAddCertification = () => {
    const cert = prompt('Enter certification:');
    if (cert && cert.trim() && !formData.certifications.includes(cert.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, cert.trim()]
      }));
    }
  };

  // Remove certification
  const handleRemoveCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };


  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
            {formData.profileImage ? (
              <img src={formData.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span>{formData.firstName?.[0] || 'M'}</span>
            )}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="bg-white/20 text-white placeholder-white/80 rounded-lg px-3 py-2 w-full"
                  placeholder="First Name"
                />
              <input
                type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="bg-white/20 text-white placeholder-white/80 rounded-lg px-3 py-2 w-full"
                  placeholder="Last Name"
                />
              </div>
            ) : (
              <h2 className="text-2xl font-bold">{`${profileData.firstName} ${profileData.lastName}`}</h2>
            )}
            {isEditing ? (
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="bg-white/20 text-white placeholder-white/80 rounded-lg px-3 py-2 w-full mt-2 mb-2"
                placeholder="Your Title"
              />
            ) : (
              <p className="text-orange-100">{profileData.title || 'No title set'}</p>
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
              <p className="text-orange-100">{profileData.company || 'No company set'}</p>
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
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Skills & Expertise</h3>
          {isEditing && (
            <button
              onClick={handleAddSkill}
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              + Add Skill
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.length > 0 ? (
            formData.skills.map((skill, index) => (
              <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              {skill}
                {isEditing && (
                  <button
                    onClick={() => handleRemoveSkill(index)}
                    className="text-orange-800 hover:text-orange-900"
                  >
                    ×
                  </button>
                )}
            </span>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No skills added yet</p>
          )}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Education</h3>
          {isEditing && (
            <button
              onClick={handleAddEducation}
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              + Add Education
            </button>
          )}
        </div>
        <div className="space-y-3">
          {formData.education.length > 0 ? (
            formData.education.map((edu, index) => (
              <div key={index} className="border-l-4 border-orange-500 pl-4 relative">
                {isEditing && (
                  <button
                    onClick={() => handleRemoveEducation(index)}
                    className="absolute top-0 right-0 text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        newEducation[index].degree = e.target.value;
                        setFormData(prev => ({ ...prev, education: newEducation }));
                      }}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                      placeholder="Degree"
                    />
                    <input
                      type="text"
                      value={edu.university}
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        newEducation[index].university = e.target.value;
                        setFormData(prev => ({ ...prev, education: newEducation }));
                      }}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                      placeholder="University"
                    />
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        newEducation[index].year = e.target.value;
                        setFormData(prev => ({ ...prev, education: newEducation }));
                      }}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                      placeholder="Year"
                    />
                  </div>
                ) : (
                  <>
              <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
              <p className="text-gray-600">{edu.university}</p>
              <p className="text-gray-500 text-sm">{edu.year}</p>
                  </>
                )}
            </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No education added yet</p>
          )}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Certifications</h3>
          {isEditing && (
            <button
              onClick={handleAddCertification}
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              + Add Certification
            </button>
          )}
        </div>
        <div className="space-y-2">
          {formData.certifications.length > 0 ? (
            formData.certifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
              <span className="text-orange-500">🏆</span>
              <span className="text-gray-700">{cert}</span>
            </div>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveCertification(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No certifications added yet</p>
          )}
        </div>
      </div>

      {/* Languages */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Languages</h3>
          {isEditing && (
            <button
              onClick={handleAddLanguage}
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              + Add Language
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.languages.length > 0 ? (
            formData.languages.map((language, index) => (
              <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                {language}
                {isEditing && (
                  <button
                    onClick={() => handleRemoveLanguage(index)}
                    className="text-purple-800 hover:text-purple-900"
                  >
                    ×
                  </button>
                )}
              </span>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No languages added yet</p>
          )}
      </div>
    </div>

      {/* Profile Visibility */}
      {isEditing && (
      <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Visibility</h3>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <span className="font-medium text-gray-800">Make Profile Visible to Users</span>
              <p className="text-sm text-gray-600 mt-1">
                When enabled, your profile will be visible to users searching for mentors
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                checked={formData.profileVisibility !== false}
                onChange={(e) => handleInputChange('profileVisibility', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
        </div>
      </div>
      )}

      {/* Experience & Specialization */}
      {isEditing && (
        <>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Experience</h3>
            <input
              type="text"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., 5+ years, 8 years"
            />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Specialization</h3>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => handleInputChange('specialization', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Full Stack Development, Business Strategy"
            />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Response Time</h3>
            <input
              type="text"
              value={formData.responseTime}
              onChange={(e) => handleInputChange('responseTime', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., 2 hours, 24 hours"
            />
          </div>
        </>
      )}

      {/* Pricing Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-3 md:p-6 shadow-lg">
          <h3 className="text-sm md:text-lg font-semibold text-gray-800 mb-2 md:mb-4">Session Pricing</h3>
          {!isEditing && (
            <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">Click "Edit Profile" to update pricing</p>
          )}
          <div className="space-y-3 md:space-y-4">
            {[
              {
                key: 'quick',
                duration: formData.pricing.quick?.duration || '20-25 minutes',
                price: formData.pricing.quick?.price || 150,
                label: formData.pricing.quick?.label || 'Quick consultation',
                icon: '⚡'
              },
              {
                key: 'inDepth',
                duration: formData.pricing.inDepth?.duration || '50-60 minutes',
                price: formData.pricing.inDepth?.price || 300,
                label: formData.pricing.inDepth?.label || 'In-depth session',
                icon: '💡'
              },
              {
                key: 'comprehensive',
                duration: formData.pricing.comprehensive?.duration || '90-120 minutes',
                price: formData.pricing.comprehensive?.price || 450,
                label: formData.pricing.comprehensive?.label || 'Comprehensive consultation',
                icon: '🎯'
              }
            ].map((session) => (
              <div key={session.key} className="p-3 md:p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <span className="text-lg md:text-2xl">{session.icon}</span>
                    <div>
                      <span className="font-semibold text-gray-800 text-xs md:text-base">{session.label}</span>
                      <p className="text-xs md:text-sm text-gray-600">{session.duration}</p>
                    </div>
                  </div>
                  {!isEditing && (
                    <div className="text-right">
                      <span className="text-base md:text-2xl font-bold text-orange-600">₹{session.price}</span>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        value={session.duration}
                        onChange={(e) => {
                          const newPricing = { ...formData.pricing };
                          newPricing[session.key].duration = e.target.value;
                          setFormData(prev => ({ ...prev, pricing: newPricing }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                        placeholder="e.g., 20-25 minutes"
                      />
              </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                      <input
                        type="text"
                        value={session.label}
                        onChange={(e) => {
                          const newPricing = { ...formData.pricing };
                          newPricing[session.key].label = e.target.value;
                          setFormData(prev => ({ ...prev, pricing: newPricing }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                        placeholder="e.g., Quick consultation"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">₹</span>
                      <input
                          type="number"
                          value={session.price}
                          onChange={(e) => {
                            const newPricing = { ...formData.pricing };
                            newPricing[session.key].price = parseInt(e.target.value) || 0;
                            setFormData(prev => ({ ...prev, pricing: newPricing }));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                          min="0"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

        <div className="hidden md:block bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 Pricing Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Consider your experience level when setting prices</li>
          <li>• Research market rates for your specialization</li>
          <li>• Start competitive and adjust based on demand</li>
            <li>• Session links will be shared via email after payment</li>
        </ul>
      </div>
    </div>

      {/* Edit Profile Button */}
      <div className="flex justify-center mt-6 md:mt-8">
        {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
            className="px-6 md:px-8 py-2 md:py-3 text-sm md:text-base bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-lg"
              >
            Edit Profile
              </button>
        ) : (
          <div className="flex space-x-3 md:space-x-4">
                <button
                  onClick={handleCancel}
              className="px-6 md:px-8 py-2 md:py-3 text-sm md:text-base bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
              disabled={isSaving}
              className="px-6 md:px-8 py-2 md:py-3 text-sm md:text-base bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
              {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
          </div>
            )}
          </div>
        </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-4 md:pb-6">
        {/* Content - Only Profile Tab */}
        <motion.div
          key="profile"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderProfileTab()}
        </motion.div>
      </div>
    </div>
  );
};

export default MentorProfilePage;
