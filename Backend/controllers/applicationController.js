const Application = require('../models/application');
const Internship = require('../models/internship');
const Company = require('../models/company');
const User = require('../models/user');
const { uploadResumeToCloudinary } = require('../utils/cloudinary');
const { sendApplicationStatusEmail } = require('../services/emailService');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

// @desc    Apply to internship
// @route   POST /api/applications
// @access  Private (User)
const applyToInternship = async (req, res) => {
  try {
    const { internshipId } = req.body;

    // Check if internship exists
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    if (!internship.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This internship is no longer accepting applications'
      });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      internship: internshipId,
      user: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this internship'
      });
    }

    // Handle resume upload if file exists
    let resumeData = null;
    if (req.file) {
      try {
        console.log('=== RESUM UPLOAD START ===');
        console.log('File details:', {
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          path: req.file.path
        });
        console.log('Uploading to Cloudinary with public access mode...');

        const uploadResult = await uploadResumeToCloudinary(
          req.file.path,
          'resumes',
          `resume-${req.user.id}-${Date.now()}`
        );

        console.log('Resume upload successful:', {
          url: uploadResult.url,
          publicId: uploadResult.public_id,
          resourceType: uploadResult.resource_type,
          format: uploadResult.format,
          bytes: uploadResult.bytes
        });
        console.log('Resume URL (should be publicly accessible):', uploadResult.url);
        console.log('=== RESUM UPLOAD SUCCESS ===');

        resumeData = {
          url: uploadResult.url,
          fileName: req.file.originalname,
          uploadedAt: new Date()
        };
      } catch (uploadError) {
        console.error('=== RESUM UPLOAD ERROR ===');
        console.error('Resume upload error:', uploadError);
        console.error('Error message:', uploadError.message);
        console.error('Error stack:', uploadError.stack);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload resume. Please try again.',
          error: process.env.NODE_ENV === 'development' ? uploadError.message : undefined
        });
      }
    } else if (req.body.resume) {
      // Handle resume data if sent as JSON (fallback for old format)
      try {
        const resumeObj = typeof req.body.resume === 'string' ? JSON.parse(req.body.resume) : req.body.resume;
        if (resumeObj.fileName) {
          resumeData = {
            fileName: resumeObj.fileName,
            uploadedAt: resumeObj.uploadedAt ? new Date(resumeObj.uploadedAt) : new Date()
          };
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }

    // Create application
    const applicationData = {
      internship: internshipId,
      user: req.user.id,
      company: internship.company,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      position: req.body.position,
      ...(resumeData && { resume: resumeData }),
      ...(req.body.experience && { experience: req.body.experience }),
      ...(req.body.notes && { notes: req.body.notes })
    };

    const application = await Application.create(applicationData);

    // Increment applicants count
    internship.applicants += 1;
    await internship.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { application }
    });

  } catch (error) {
    console.error('Apply to internship error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private (User or Company)
const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('internship', 'title companyName location')
      .populate('user', 'firstName lastName email phone')
      .populate('company', 'companyName');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check authorization
    const isOwner = application.user._id.toString() === req.user.id;
    const isCompany = application.company._id.toString() === req.company?.id;

    if (!isOwner && !isCompany) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      data: { application }
    });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get company's applications
// @route   GET /api/applications/company/my-applications
// @access  Private (Company)
const getCompanyApplications = async (req, res) => {
  try {
    const { status, internshipId } = req.query;

    const filter = { company: req.company.id };

    if (status) {
      filter.status = status;
    }

    if (internshipId) {
      filter.internship = internshipId;
    }

    const applications = await Application.find(filter)
      .populate('internship', 'title location duration type category companyName')
      .populate('user', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { applications }
    });

  } catch (error) {
    console.error('Get company applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/user/my-applications
// @access  Private (User)
const getUserApplications = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = { user: req.user.id };

    if (status) {
      filter.status = status;
    }

    const applications = await Application.find(filter)
      .populate({
        path: 'internship',
        select: 'title companyName location duration type category stipend stipendPerMonth description isActive applicationDeadline',
        populate: {
          path: 'company',
          select: 'companyName'
        }
      })
      .populate('company', 'companyName industry')
      .populate('user', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { applications }
    });

  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Company)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if company owns this application
    if (application.company.toString() !== req.company.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'shortlisted', 'rejected', 'hired', 'withdrawn'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    application.status = status;
    application.statusUpdatedAt = new Date();
    if (notes) {
      application.notes = notes;
    }

    await application.save();

    // Populate application data for email
    await application.populate([
      { path: 'internship', select: 'title companyName' },
      { path: 'user', select: 'firstName lastName email' },
      { path: 'company', select: 'companyName' }
    ]);

    // Send email notification to user
    try {
      const internshipTitle = application.internship?.title || 'Internship Position';
      const companyName = application.company?.companyName || 'Company';
      
      await sendApplicationStatusEmail(
        application,
        status,
        companyName,
        internshipTitle
      );
      console.log(`Email notification sent for application ${application._id} status: ${status}`);
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated',
      data: { application }
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    View application (mark as viewed)
// @route   PUT /api/applications/:id/view
// @access  Private (Company)
const viewApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.company.toString() !== req.company.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    application.viewed = true;
    application.viewedAt = new Date();
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application marked as viewed',
      data: { application }
    });

  } catch (error) {
    console.error('View application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Download resume for company
// @route   GET /api/applications/:id/resume
// @access  Private (Company only)
const downloadResume = async (req, res) => {
  try {
    console.log('=== DOWNLOAD RESUME REQUEST ===');
    console.log('Application ID:', req.params.id);
    console.log('Company ID:', req.company?.id);

    const application = await Application.findById(req.params.id)
      .populate('company', 'companyName');

    if (!application) {
      console.log('Application not found');
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    console.log('Application found:', {
      id: application._id,
      companyId: application.company?._id?.toString(),
      hasResume: !!(application.resume && application.resume.url)
    });

    // Check if the requesting company owns this application
    if (!req.company || application.company._id.toString() !== req.company.id) {
      console.log('Authorization failed');
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this resume'
      });
    }

    // Check if resume exists
    if (!application.resume || !application.resume.url) {
      console.log('Resume not found in application');
      return res.status(404).json({
        success: false,
        message: 'Resume not found for this application'
      });
    }

    const resumeUrl = application.resume.url;
    const fileName = application.resume.fileName || `resume-${application._id}.pdf`;

    console.log('Resume URL:', resumeUrl);
    console.log('File name:', fileName);

    let fileResponse = null;
    let downloadMethod = 'unknown';

    try {
      if (resumeUrl.includes('cloudinary.com')) {
        // Parse Cloudinary URL to extract public_id
        // URL format: https://res.cloudinary.com/{cloud_name}/raw/upload/{version}/{folder}/{public_id}.{format}
        // Example: https://res.cloudinary.com/createbharat/raw/upload/v1761740919/createbharat/resumes/resume-690075546bb658a5dd34f737-1761740866665.pdf
        // Note: For raw files, public_id stored in Cloudinary includes the extension (.pdf)
        const urlMatch = resumeUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
        let publicId = null;
        let publicIdWithExtension = null;

        if (urlMatch && urlMatch[1]) {
          publicIdWithExtension = urlMatch[1]; // Keep extension (as stored in Cloudinary)
          publicId = urlMatch[1].replace(/\.(pdf|doc|docx)$/i, ''); // Without extension (for signed URLs)
        }

        console.log('Extracted public_id (with extension):', publicIdWithExtension);
        console.log('Extracted public_id (without extension):', publicId);
        console.log('Cloudinary config:', {
          cloudName: cloudinary.config().cloud_name ? 'SET' : 'NOT SET',
          apiKey: cloudinary.config().api_key ? 'SET' : 'NOT SET',
          apiSecret: cloudinary.config().api_secret ? 'SET' : 'NOT SET'
        });

        // Strategy 1: Try original URL first (file was uploaded as public)
        console.log('Strategy 1: Trying original URL (file should be public)...');
        let originalResponse = null;
        let originalError = null;

        try {
          originalResponse = await axios.get(resumeUrl, {
            responseType: 'arraybuffer',
            maxRedirects: 5,
            timeout: 30000,
            validateStatus: (status) => status < 500, // Don't throw on 4xx
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
              'Accept': 'application/pdf, application/octet-stream, */*'
            }
          });

          if (originalResponse.status === 200) {
            fileResponse = Buffer.from(originalResponse.data);
            downloadMethod = 'original-url';
            console.log('✅ SUCCESS: Fetched using original URL (file is public), size:', fileResponse.length, 'bytes');
          } else {
            console.log(`❌ Original URL returned ${originalResponse.status}`);
            // Store status in error object for later check
            originalError = { response: { status: originalResponse.status }, message: `Original URL returned ${originalResponse.status}` };
            throw originalError;
          }
        } catch (error) {
          originalError = error;
          console.log('=== ORIGINAL URL ERROR DETAILS ===');
          console.log('Error message:', error.message);
          console.log('Error response exists:', !!error.response);
          console.log('Error response status:', error.response?.status);
          console.log('Error response statusText:', error.response?.statusText);
          console.log('Error code:', error.code);
          console.log('Error name:', error.name);

          // Extract status from response or error message
          const statusCode = error.response?.status || (error.message?.match(/\d{3}/) ? parseInt(error.message.match(/\d{3}/)[0]) : null);
          console.log('Extracted status code:', statusCode);

          // Check if error message contains 401/403 or if response status is 401/403
          const is401Or403 = statusCode === 401 ||
            statusCode === 403 ||
            error.response?.status === 401 ||
            error.response?.status === 403 ||
            error.message?.includes('401') ||
            error.message?.includes('403');

          console.log('Is 401/403 error?', is401Or403);

          // Strategy 2: If 401/403, try to make file explicitly public using Admin API
          if (is401Or403) {
            if (publicId && cloudinary.config().cloud_name && cloudinary.config().api_secret) {
              try {
                console.log('Strategy 2: File appears private. Attempting to make it public using Admin API...');

                // Try both with and without extension for raw files
                let explicitResult = null;
                let triedPublicId = null;

                // Try with extension first (as upload result shows public_id includes .pdf)
                try {
                  console.log('Trying explicit() with extension:', publicIdWithExtension);
                  triedPublicId = publicIdWithExtension;
                  explicitResult = await cloudinary.uploader.explicit(publicIdWithExtension, {
                    resource_type: 'raw',
                    type: 'upload',
                    access_mode: 'public'
                  });
                  console.log('✅ explicit() succeeded with extension');
                } catch (extError) {
                  console.log('explicit() with extension failed:', extError.message);
                  // Try without extension
                  try {
                    console.log('Trying explicit() without extension:', publicId);
                    triedPublicId = publicId;
                    explicitResult = await cloudinary.uploader.explicit(publicId, {
                      resource_type: 'raw',
                      type: 'upload',
                      access_mode: 'public'
                    });
                    console.log('✅ explicit() succeeded without extension');
                  } catch (noExtError) {
                    console.error('Both explicit() attempts failed');
                    console.error('With extension error:', extError.message);
                    console.error('Without extension error:', noExtError.message);
                    throw noExtError; // Throw the last error
                  }
                }

                console.log('Using public_id:', triedPublicId);

                console.log('Admin API explicit() result:', {
                  public_id: explicitResult.public_id,
                  url: explicitResult.secure_url,
                  access_mode: explicitResult.access_mode,
                  secure_url: explicitResult.secure_url
                });
                console.log('✅ File access_mode set to public via Admin API');

                // Try to update the file access mode using uploader.update instead
                // Sometimes explicit() sets it but doesn't make it immediately accessible
                try {
                  console.log('Attempting uploader.update() to ensure public access...');
                  await cloudinary.uploader.update(triedPublicId, {
                    resource_type: 'raw',
                    access_mode: 'public'
                  });
                  console.log('✅ uploader.update() successful');
                } catch (updateError) {
                  console.log('uploader.update() failed (non-critical):', updateError.message);
                }

                // Wait a bit longer for Cloudinary to propagate
                console.log('Waiting 2 seconds for Cloudinary to propagate changes...');
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Retry original URL
                console.log('Retrying original URL after making file public...');
                const retryResponse = await axios.get(resumeUrl, {
                  responseType: 'arraybuffer',
                  maxRedirects: 5,
                  timeout: 30000,
                  validateStatus: (status) => status < 500,
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'Accept': 'application/pdf, application/octet-stream, */*'
                  }
                });

                if (retryResponse.status === 200) {
                  fileResponse = Buffer.from(retryResponse.data);
                  downloadMethod = 'original-url-after-explicit';
                  console.log('✅ SUCCESS: Fetched after making file public, size:', fileResponse.length, 'bytes');
                } else {
                  console.log(`❌ Retry still returned ${retryResponse.status}`);

                  // Try with the explicit URL from the result
                  console.log('Trying with explicit() returned URL...');
                  const explicitUrlResponse = await axios.get(explicitResult.secure_url, {
                    responseType: 'arraybuffer',
                    maxRedirects: 5,
                    timeout: 30000,
                    validateStatus: (status) => status < 500,
                    headers: {
                      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                      'Accept': 'application/pdf, application/octet-stream, */*'
                    }
                  });

                  if (explicitUrlResponse.status === 200) {
                    fileResponse = Buffer.from(explicitUrlResponse.data);
                    downloadMethod = 'explicit-url';
                    console.log('✅ SUCCESS: Fetched using explicit URL, size:', fileResponse.length, 'bytes');
                  } else {
                    // Even explicit URL failed - file might still be private
                    // Continue to signed URL strategy
                    console.log(`❌ Explicit URL also returned ${explicitUrlResponse.status}`);
                    throw new Error(`File still not accessible after explicit(). Original: ${retryResponse.status}, Explicit URL: ${explicitUrlResponse.status}`);
                  }
                }
              } catch (explicitError) {
                console.error('=== EXPLICIT API ERROR ===');
                console.error('Failed to make file public via Admin API:', explicitError.message);
                console.error('Explicit error details:', explicitError);
                if (explicitError.http_code) {
                  console.error('Cloudinary HTTP code:', explicitError.http_code);
                }

                // Strategy 3: Try signed URL as last resort
                try {
                  console.log('Strategy 3: Trying signed URL...');
                  let signedUrl = null;
                  let signedSuccess = false;
                  let signedExtError = null;
                  let signedNoExtError = null;

                  // Try signed URL with extension first (since that's how it's stored)
                  try {
                    console.log('Trying signed URL with extension:', publicIdWithExtension);
                    signedUrl = cloudinary.url(publicIdWithExtension, {
                      resource_type: 'raw',
                      type: 'upload',
                      secure: true,
                      sign_url: true
                    });

                    console.log('Generated signed URL with extension (first 120 chars):', signedUrl.substring(0, 120));

                    const signedResponseWithExt = await axios.get(signedUrl, {
                      responseType: 'arraybuffer',
                      maxRedirects: 5,
                      timeout: 30000,
                      validateStatus: (status) => status < 500,
                      headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                        'Accept': 'application/pdf, application/octet-stream, */*'
                      }
                    });

                    if (signedResponseWithExt.status === 200) {
                      fileResponse = Buffer.from(signedResponseWithExt.data);
                      downloadMethod = 'signed-url-with-ext';
                      console.log('✅ SUCCESS: Fetched using signed URL (with extension), size:', fileResponse.length, 'bytes');
                      signedSuccess = true;
                    } else {
                      throw new Error(`Signed URL with extension returned ${signedResponseWithExt.status}`);
                    }
                  } catch (extError) {
                    signedExtError = extError;
                    console.log('Signed URL with extension failed:', extError.message);
                    console.log('Response status:', extError.response?.status);
                  }

                  // If signed URL with extension failed, try without extension
                  if (!signedSuccess) {
                    try {
                      console.log('Trying signed URL without extension:', publicId);
                      signedUrl = cloudinary.url(publicId, {
                        resource_type: 'raw',
                        type: 'upload',
                        secure: true,
                        sign_url: true
                      });

                      console.log('Generated signed URL without extension (first 120 chars):', signedUrl.substring(0, 120));

                      const signedResponse = await axios.get(signedUrl, {
                        responseType: 'arraybuffer',
                        maxRedirects: 5,
                        timeout: 30000,
                        validateStatus: (status) => status < 500,
                        headers: {
                          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                          'Accept': 'application/pdf, application/octet-stream, */*'
                        }
                      });

                      if (signedResponse.status === 200) {
                        fileResponse = Buffer.from(signedResponse.data);
                        downloadMethod = 'signed-url-without-ext';
                        console.log('✅ SUCCESS: Fetched using signed URL (without extension), size:', fileResponse.length, 'bytes');
                        signedSuccess = true;
                      } else {
                        throw new Error(`Signed URL returned ${signedResponse.status}`);
                      }
                    } catch (noExtError) {
                      signedNoExtError = noExtError;
                      console.error('Signed URL without extension also failed:', noExtError.message);
                      console.error('Response status:', noExtError.response?.status);
                    }
                  }

                  if (!signedSuccess) {
                    const errorMessage = `Both signed URL attempts failed. With ext: ${signedExtError?.response?.status || signedExtError?.message || 'unknown'}, Without ext: ${signedNoExtError?.response?.status || signedNoExtError?.message || 'unknown'}`;
                    console.error('=== ALL STRATEGIES FAILED ===');
                    console.error(errorMessage);
                    throw new Error(errorMessage);
                  }
                } catch (signedError) {
                  console.error('=== ALL STRATEGIES FAILED ===');
                  console.error('Signed URL error:', signedError.message);
                  console.error('Signed URL response status:', signedError.response?.status);
                  throw new Error(`Failed to download resume. Original: ${statusCode || 'unknown'}, Explicit: ${explicitError.message}, Signed: ${signedError.message}`);
                }
              }
            } else {
              console.error('Cannot use Admin API - Cloudinary not configured properly');
              console.error('publicId:', publicId);
              console.error('cloud_name:', !!cloudinary.config().cloud_name);
              console.error('api_secret:', !!cloudinary.config().api_secret);
              throw new Error(`Cannot use Admin API. Cloudinary not configured (missing api_secret or publicId). Original URL error: ${statusCode || 'unknown'}`);
            }
          } else {
            // Not a 401/403 error - rethrow
            console.log('Error is not 401/403, rethrowing...');
            throw originalError;
          }
        }
      } else {
        // Non-Cloudinary URL
        console.log('Non-Cloudinary URL, fetching directly...');
        const response = await axios.get(resumeUrl, {
          responseType: 'arraybuffer',
          maxRedirects: 5,
          timeout: 30000
        });
        fileResponse = Buffer.from(response.data);
        downloadMethod = 'non-cloudinary';
        console.log('SUCCESS: Fetched non-Cloudinary URL, size:', fileResponse.length, 'bytes');
      }

      // Validate fileResponse
      if (!fileResponse || !Buffer.isBuffer(fileResponse) || fileResponse.length === 0) {
        throw new Error('Resume file data is empty or invalid after fetch');
      }

      console.log('Setting response headers...');
      console.log('File size:', fileResponse.length, 'bytes');

      // Set headers for download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
      res.setHeader('Content-Length', fileResponse.length);
      res.setHeader('Cache-Control', 'no-cache');

      console.log('Sending file response...');

      // Send the file
      res.send(fileResponse);

      console.log(`✅ Resume downloaded successfully via ${downloadMethod}: ${fileName} (${fileResponse.length} bytes)`);
      console.log('=== DOWNLOAD RESUME SUCCESS ===');

    } catch (fetchError) {
      console.error('=== ERROR FETCHING RESUME ===');
      console.error('Error name:', fetchError.name);
      console.error('Error message:', fetchError.message);

      if (fetchError.response) {
        console.error('Response status:', fetchError.response.status);
        console.error('Response statusText:', fetchError.response.statusText);
        if (fetchError.response.data) {
          const dataPreview = typeof fetchError.response.data === 'string'
            ? fetchError.response.data.substring(0, 500)
            : JSON.stringify(fetchError.response.data).substring(0, 500);
          console.error('Response data preview:', dataPreview);
        }
      }

      if (fetchError.stack) {
        console.error('Error stack:', fetchError.stack);
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch resume from storage',
        error: process.env.NODE_ENV === 'development' ? fetchError.message : undefined
      });
    }

  } catch (error) {
    console.error('=== DOWNLOAD RESUME OUTER ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);

    if (error.stack) {
      console.error('Error stack:', error.stack);
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  applyToInternship,
  getApplication,
  getCompanyApplications,
  getUserApplications,
  updateApplicationStatus,
  viewApplication,
  downloadResume
};
