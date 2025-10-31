const LegalService = require('../models/legalService');
const { validationResult } = require('express-validator');

// @desc    Get all legal services (for users - only active)
// @route   GET /api/legal/services
// @access  Public
const getAllServices = async (req, res) => {
  try {
    const services = await LegalService.find({ isActive: true })
      .select('-totalSubmissions')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });

  } catch (error) {
    console.error('Get all legal services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get legal service by ID (for users)
// @route   GET /api/legal/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await LegalService.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { service }
    });

  } catch (error) {
    console.error('Get legal service by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all legal services (for CA - includes inactive)
// @route   GET /api/ca/legal-services
// @access  Private/CA
const getCAServices = async (req, res) => {
  try {
    const services = await LegalService.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });

  } catch (error) {
    console.error('Get CA legal services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create legal service (CA)
// @route   POST /api/ca/legal-services
// @access  Private/CA
const createService = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      name,
      description,
      icon,
      category,
      heading,
      paragraph,
      price,
      duration,
      benefits,
      process,
      requiredDocuments,
      documentUploads,
      isActive
    } = req.body;

    const service = await LegalService.create({
      name,
      description,
      icon: icon || '⚖️',
      category: category || 'Business',
      heading: heading || '',
      paragraph: paragraph || '',
      price: price || '₹0',
      duration: duration || '',
      benefits: benefits || [],
      process: process || [],
      requiredDocuments: requiredDocuments || [],
      documentUploads: documentUploads || [],
      isActive: isActive !== false
    });

    res.status(201).json({
      success: true,
      message: 'Legal service created successfully',
      data: { service }
    });

  } catch (error) {
    console.error('Create legal service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update legal service (CA)
// @route   PUT /api/ca/legal-services/:id
// @access  Private/CA
const updateService = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const service = await LegalService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const {
      name,
      description,
      icon,
      category,
      heading,
      paragraph,
      price,
      duration,
      benefits,
      process,
      requiredDocuments,
      documentUploads,
      isActive
    } = req.body;

    // Update fields
    if (name !== undefined) service.name = name;
    if (description !== undefined) service.description = description;
    if (icon !== undefined) service.icon = icon;
    if (category !== undefined) service.category = category;
    if (heading !== undefined) service.heading = heading;
    if (paragraph !== undefined) service.paragraph = paragraph;
    if (price !== undefined) service.price = price;
    if (duration !== undefined) service.duration = duration;
    if (benefits !== undefined) service.benefits = benefits;
    if (process !== undefined) service.process = process;
    if (requiredDocuments !== undefined) service.requiredDocuments = requiredDocuments;
    if (documentUploads !== undefined) service.documentUploads = documentUploads;
    if (isActive !== undefined) service.isActive = isActive;

    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: { service }
    });

  } catch (error) {
    console.error('Update legal service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete legal service (CA)
// @route   DELETE /api/ca/legal-services/:id
// @access  Private/CA
const deleteService = async (req, res) => {
  try {
    const service = await LegalService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    await LegalService.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('Delete legal service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  getCAServices,
  createService,
  updateService,
  deleteService
};

