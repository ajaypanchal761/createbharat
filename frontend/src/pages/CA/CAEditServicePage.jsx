import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const CAEditServicePage = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    icon: '⚖️',
    color: 'from-blue-500 to-cyan-500',
    description: '',
    price: '',
    duration: '',
    benefits: [''],
    process: [''],
    requiredDocuments: [''],
    documentUploadFields: ['']
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const iconOptions = [
    '⚖️', '📋', '📄', '💰', '🏢', '🚢', '🏭', '™️', '🍽️', '👥', '🏆', 
    '👤', '🤝', '🏛️', '❤️', '📊', '📝', '📑', '📌', '✅', '🔐', '💼'
  ];

  const colorOptions = [
    { value: 'from-blue-500 to-cyan-500', label: 'Blue to Cyan' },
    { value: 'from-green-500 to-emerald-500', label: 'Green to Emerald' },
    { value: 'from-purple-500 to-violet-500', label: 'Purple to Violet' },
    { value: 'from-orange-500 to-red-500', label: 'Orange to Red' },
    { value: 'from-indigo-500 to-blue-500', label: 'Indigo to Blue' },
    { value: 'from-teal-500 to-green-500', label: 'Teal to Green' },
    { value: 'from-pink-500 to-rose-500', label: 'Pink to Rose' },
    { value: 'from-yellow-500 to-orange-500', label: 'Yellow to Orange' },
    { value: 'from-cyan-500 to-blue-500', label: 'Cyan to Blue' },
    { value: 'from-emerald-500 to-teal-500', label: 'Emerald to Teal' },
    { value: 'from-violet-500 to-purple-500', label: 'Violet to Purple' },
    { value: 'from-red-500 to-pink-500', label: 'Red to Pink' },
    { value: 'from-blue-600 to-indigo-600', label: 'Blue to Indigo (Dark)' },
    { value: 'from-green-600 to-emerald-600', label: 'Green to Emerald (Dark)' },
    { value: 'from-amber-500 to-yellow-500', label: 'Amber to Yellow' }
  ];

  // Load existing service data
  useEffect(() => {
    const loadService = () => {
      try {
        // First try to load from localStorage (CA-added services)
        const caServices = JSON.parse(localStorage.getItem('caLegalServices') || '[]');
        let service = caServices.find(s => s.id === parseInt(serviceId));

        // If not found, load from LegalServiceDetailPage structure
        if (!service) {
          const legalServicesData = {
            1: { name: 'GST Registration', icon: '📋', color: 'from-blue-500 to-cyan-500', description: 'Register your business for Goods and Services Tax (GST) to comply with Indian tax regulations.', benefits: ['Legal compliance with tax regulations', 'Ability to collect GST from customers', 'Input tax credit benefits', 'Enhanced business credibility'], documents: ['PAN Card of the business/proprietor', 'Aadhaar Card', 'Business Address Proof', 'Bank Account Details', 'Digital Signature Certificate (DSC)', 'Business Registration Certificate', 'Partnership Deed (if applicable)', 'Board Resolution (for companies)'], process: ['Submit application with required documents', 'Verification by tax authorities', 'GST registration certificate issued', 'GSTIN number provided'], timeline: '7-15 business days', fees: '₹1,999' },
            2: { name: 'GST Filing', icon: '📄', color: 'from-green-500 to-emerald-500', description: 'File your GST returns accurately and on time to maintain compliance.', benefits: ['Maintain GST compliance', 'Avoid penalties and interest', 'Claim input tax credit', 'Smooth business operations'], documents: ['GST Registration Certificate', 'Sales and Purchase Records', 'Bank Statements', 'Tax Invoices', 'Credit/Debit Notes', 'E-way Bills', 'HSN/SAC Codes', 'Previous GST Returns'], process: ['Compile sales and purchase data', 'Prepare GST returns', 'File returns online', 'Pay any tax due'], timeline: 'Monthly/Quarterly', fees: '₹999 per return' }
          };
          
          const defaultService = legalServicesData[parseInt(serviceId)];
          if (defaultService) {
            service = {
              id: parseInt(serviceId),
              name: defaultService.name,
              icon: defaultService.icon,
              color: defaultService.color,
              description: defaultService.description,
              price: defaultService.fees,
              duration: defaultService.timeline,
              benefits: defaultService.benefits || [],
              process: defaultService.process || [],
              requiredDocuments: defaultService.documents || [],
              documentUploadFields: []
            };
          }
        }

        if (service) {
          setFormData({
            name: service.name || '',
            icon: service.icon || '⚖️',
            color: service.color || 'from-blue-500 to-cyan-500',
            description: service.description || '',
            price: service.price || service.fees || '',
            duration: service.duration || service.timeline || '',
            benefits: service.benefits && service.benefits.length > 0 ? service.benefits : [''],
            process: service.process && service.process.length > 0 ? service.process : [''],
            requiredDocuments: service.requiredDocuments || (service.documents && service.documents.length > 0 ? service.documents : ['']),
            documentUploadFields: service.documentUploadFields || ['']
          });
        } else {
          alert('Service not found!');
          navigate('/ca/dashboard');
        }
      } catch (error) {
        console.error('Error loading service:', error);
        alert('Error loading service data');
        navigate('/ca/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadService();
  }, [serviceId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayItem = (field, index) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };

  const updateArrayItem = (field, index, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    }
    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    // Filter out empty array items
    const cleanedData = {
      ...formData,
      benefits: formData.benefits.filter(b => b.trim() !== ''),
      process: formData.process.filter(p => p.trim() !== ''),
      requiredDocuments: formData.requiredDocuments.filter(d => d.trim() !== ''),
      documentUploadFields: formData.documentUploadFields.filter(u => u.trim() !== '')
    };

    // Update service in localStorage
    const services = JSON.parse(localStorage.getItem('caLegalServices') || '[]');
    const serviceIndex = services.findIndex(s => s.id === parseInt(serviceId));
    
    if (serviceIndex !== -1) {
      services[serviceIndex] = { ...services[serviceIndex], ...cleanedData };
      localStorage.setItem('caLegalServices', JSON.stringify(services));
      alert('Service updated successfully!');
      navigate('/ca/dashboard');
    } else {
      // If service doesn't exist in CA services, create it
      const newService = {
        id: parseInt(serviceId),
        ...cleanedData
      };
      services.push(newService);
      localStorage.setItem('caLegalServices', JSON.stringify(services));
      alert('Service saved successfully!');
      navigate('/ca/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/ca/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Legal Service</h1>
          </div>
        </motion.div>

        {/* Form - Same as Add Service */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., GST Registration"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon *
              </label>
              <div className="grid grid-cols-8 gap-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all ${
                      formData.icon === icon
                        ? 'border-blue-500 bg-blue-50 scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">Selected: {formData.icon}</p>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Gradient *
              </label>
              <select
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {colorOptions.map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the service in detail..."
                required
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Price and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price/Fees *
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., ₹1,999"
                  required
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration/Timeline *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.duration ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 7-15 business days"
                  required
                />
                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits
              </label>
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => updateArrayItem('benefits', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={`Benefit ${index + 1}`}
                  />
                  {formData.benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('benefits', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('benefits')}
                className="mt-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
              >
                + Add Benefit
              </button>
            </div>

            {/* Process */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Process Steps
              </label>
              {formData.process.map((step, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => updateArrayItem('process', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={`Step ${index + 1}`}
                  />
                  {formData.process.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('process', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('process')}
                className="mt-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
              >
                + Add Process Step
              </button>
            </div>

            {/* Required Documents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Documents
              </label>
              {formData.requiredDocuments.map((doc, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={doc}
                    onChange={(e) => updateArrayItem('requiredDocuments', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={`Document ${index + 1}`}
                  />
                  {formData.requiredDocuments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('requiredDocuments', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('requiredDocuments')}
                className="mt-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
              >
                + Add Required Document
              </button>
            </div>

            {/* Document Upload Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Upload Fields
              </label>
              {formData.documentUploadFields.map((field, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={field}
                    onChange={(e) => updateArrayItem('documentUploadFields', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={`Upload Field ${index + 1}`}
                  />
                  {formData.documentUploadFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('documentUploadFields', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('documentUploadFields')}
                className="mt-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
              >
                + Add Upload Field
              </button>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/ca/dashboard')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-medium shadow-lg"
              >
                Update Service
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CAEditServicePage;

