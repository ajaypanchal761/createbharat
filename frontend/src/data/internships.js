export const internshipCategories = [
  { id: 'all', name: 'All Internships', icon: '🌐' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'design', name: 'Design', icon: '🎨' },
  { id: 'marketing', name: 'Marketing', icon: '📢' },
  { id: 'finance', name: 'Finance', icon: '💰' },
  { id: 'legal', name: 'Legal', icon: '⚖️' },
  { id: 'operations', name: 'Operations', icon: '🔧' },
];

// Updated with emoji icons for all internships

export const internships = [
  {
    id: 'web-dev-intern-techsolutions',
    title: 'Web Development Intern',
    company: 'TechSolutions Pvt Ltd',
    location: 'Remote',
    duration: '3-6 months',
    stipend: '₹15,000 - ₹25,000',
    stipendPerMonth: '/month',
    type: 'Full-time',
    category: 'Technology',
    postedDate: '2 days ago',
    applicants: '45 applied',
    openings: '3 positions',
    featured: true,
    popular: true,
    urgent: false,
    remote: true,

    description: 'Join our dynamic team as a Web Development Intern and gain hands-on experience in building modern web applications. You will work on real-world projects using cutting-edge technologies and collaborate with experienced developers.',

    responsibilities: [
      'Develop and maintain web applications using React.js and Node.js',
      'Collaborate with the design team to implement UI/UX designs',
      'Write clean, maintainable, and efficient code',
      'Participate in code reviews and team meetings',
      'Debug and troubleshoot application issues',
      'Learn and implement best practices in web development',
    ],

    requirements: [
      'Currently pursuing or recently completed B.Tech/BCA/MCA in Computer Science or related field',
      'Basic understanding of HTML, CSS, and JavaScript',
      'Familiarity with React.js is a plus',
      'Good problem-solving skills',
      'Ability to work in a team environment',
      'Excellent communication skills',
    ],

    skills: [
      'HTML/CSS',
      'JavaScript',
      'React.js',
      'Node.js',
      'Git/GitHub',
      'REST APIs',
      'Responsive Design',
      'Problem Solving',
    ],

    perks: [
      'Certificate of completion',
      'Letter of recommendation for top performers',
      'Flexible work hours',
      'Learning & development opportunities',
      'Mentorship from senior developers',
      'Potential for full-time offer',
      'Work from home',
    ],

    aboutCompany: 'TechSolutions is a leading IT services company specializing in web and mobile application development. We work with clients across various industries to deliver innovative digital solutions.',

    applicationProcess: [
      'Submit your resume and portfolio through our application portal',
      'Initial screening by HR team (2-3 days)',
      'Technical assignment (if shortlisted)',
      'Technical interview with the development team',
      'HR round and final discussion',
      'Offer letter (if selected)',
    ],

    applicationLink: 'https://techsolutions.com/careers/apply',

    color: 'from-blue-500 to-cyan-500',
    icon: '💻',
  },
  {
    id: 'ui-ux-design-intern-creativestudio',
    title: 'UI/UX Design Intern',
    company: 'CreativeStudio Design',
    location: 'Hybrid (Mumbai)',
    duration: '4-6 months',
    stipend: '₹12,000 - ₹20,000',
    stipendPerMonth: '/month',
    type: 'Full-time',
    category: 'Design',
    postedDate: '5 days ago',
    applicants: '32 applied',
    openings: '2 positions',
    featured: true,
    popular: false,
    urgent: false,
    remote: false,

    description: 'We are looking for a creative and passionate UI/UX Design Intern to join our design team. You will work on exciting projects for various clients and learn from experienced designers.',

    responsibilities: [
      'Create wireframes, mockups, and prototypes for web and mobile applications',
      'Conduct user research and usability testing',
      'Design user interfaces following brand guidelines',
      'Collaborate with developers to ensure design implementation',
      'Present design concepts to clients and team members',
      'Stay updated with latest design trends and tools',
    ],

    requirements: [
      'Currently pursuing or completed degree in Design, Fine Arts, or related field',
      'Portfolio showcasing UI/UX design work',
      'Proficiency in Figma, Adobe XD, or Sketch',
      'Understanding of design principles and user-centered design',
      'Creative thinking and attention to detail',
      'Good communication and presentation skills',
    ],

    skills: [
      'Figma',
      'Adobe XD',
      'Sketch',
      'Prototyping',
      'User Research',
      'Wireframing',
      'Visual Design',
      'Design Systems',
    ],

    perks: [
      'Work on real client projects',
      'Certificate and recommendation letter',
      'Access to premium design tools',
      'Networking opportunities',
      'Creative freedom in projects',
      'Portfolio building support',
      'Office snacks and amenities',
    ],

    aboutCompany: 'CreativeStudio is a boutique design agency focused on creating beautiful and functional digital experiences. We work with startups and established brands to bring their visions to life.',

    applicationProcess: [
      'Submit your resume along with portfolio link',
      'Portfolio review by design team (3-5 days)',
      'Design assignment (if shortlisted)',
      'Interview with senior designers',
      'Final discussion with Creative Director',
      'Offer letter',
    ],

    applicationLink: 'https://creativestudio.com/careers',

    color: 'from-purple-500 to-pink-500',
    icon: '🎨',
  },
  {
    id: 'digital-marketing-intern-brandboost',
    title: 'Digital Marketing Intern',
    company: 'BrandBoost Marketing',
    location: 'On-site (Bangalore)',
    duration: '3 months',
    stipend: '₹10,000 - ₹15,000',
    stipendPerMonth: '/month',
    type: 'Full-time',
    category: 'Marketing',
    postedDate: '1 week ago',
    applicants: '58 applied',
    openings: '4 positions',
    featured: false,
    popular: true,
    urgent: true,
    remote: false,

    description: 'Join our marketing team and learn the ins and outs of digital marketing. You will work on social media campaigns, content creation, and analytics for various brands.',

    responsibilities: [
      'Manage social media accounts and create engaging content',
      'Assist in planning and executing digital marketing campaigns',
      'Conduct market research and competitor analysis',
      'Create content for blogs, social media, and email campaigns',
      'Monitor and report on campaign performance using analytics tools',
      'Support SEO and SEM initiatives',
    ],

    requirements: [
      'Currently pursuing or completed degree in Marketing, Communications, or related field',
      'Strong written and verbal communication skills',
      'Familiarity with social media platforms',
      'Basic knowledge of digital marketing concepts',
      'Creative mindset and ability to think out of the box',
      'Analytical skills to interpret data',
    ],

    skills: [
      'Social Media Marketing',
      'Content Writing',
      'Google Analytics',
      'SEO/SEM',
      'Canva/Adobe Creative Suite',
      'Email Marketing',
      'Market Research',
      'Communication',
    ],

    perks: [
      'Hands-on experience with multiple brands',
      'Certificate of internship',
      'Performance-based incentives',
      'Networking with industry professionals',
      'Learning sessions on latest marketing trends',
      'Potential for pre-placement offer',
    ],

    aboutCompany: 'BrandBoost is a full-service digital marketing agency helping businesses grow their online presence through innovative marketing strategies and campaigns.',

    applicationProcess: [
      'Apply with resume and cover letter',
      'Initial screening call',
      'Marketing case study assignment',
      'Interview with Marketing Manager',
      'Final round with CEO',
      'Offer letter',
    ],

    applicationLink: 'https://brandboost.com/careers/internship',

    color: 'from-orange-500 to-red-500',
    icon: '📢',
  },
  {
    id: 'financial-analyst-intern-fincorp',
    title: 'Financial Analyst Intern',
    company: 'FinCorp Solutions',
    location: 'Remote',
    duration: '6 months',
    stipend: '₹18,000 - ₹25,000',
    stipendPerMonth: '/month',
    type: 'Full-time',
    category: 'Finance',
    postedDate: '3 days ago',
    applicants: '28 applied',
    openings: '2 positions',
    featured: true,
    popular: false,
    urgent: false,
    remote: true,

    description: 'Gain practical experience in financial analysis and investment research. Work with our team of financial experts on real projects involving financial modeling, data analysis, and market research.',

    responsibilities: [
      'Assist in financial modeling and data analysis',
      'Conduct market research and industry analysis',
      'Prepare financial reports and presentations',
      'Support investment research activities',
      'Monitor financial markets and economic trends',
      'Help maintain financial databases and tools',
    ],

    requirements: [
      'Currently pursuing or completed degree in Finance, Accounting, Economics, or related field',
      'Strong analytical and numerical skills',
      'Proficiency in MS Excel',
      'Basic understanding of financial statements',
      'Attention to detail and accuracy',
      'Good research and presentation skills',
    ],

    skills: [
      'MS Excel',
      'Financial Modeling',
      'Data Analysis',
      'Financial Reporting',
      'Market Research',
      'Bloomberg Terminal',
      'PowerPoint',
      'Analytical Thinking',
    ],

    perks: [
      'Mentorship from experienced financial analysts',
      'Certificate and letter of recommendation',
      'Flexible remote work',
      'Access to financial databases and tools',
      'Industry networking opportunities',
      'Potential for full-time conversion',
    ],

    aboutCompany: 'FinCorp Solutions is a financial services firm providing investment research, advisory, and wealth management services to institutional and retail clients.',

    applicationProcess: [
      'Submit resume and academic transcripts',
      'Aptitude test (quantitative and analytical)',
      'Case study on financial analysis',
      'Interview with senior analysts',
      'HR discussion',
      'Offer letter',
    ],

    applicationLink: 'https://fincorp.com/careers/internships',

    color: 'from-green-500 to-emerald-500',
    icon: '💰',
  },
  {
    id: 'legal-research-intern-lawfirm',
    title: 'Legal Research Intern',
    company: 'Supreme Law Associates',
    location: 'On-site (Delhi)',
    duration: '2-3 months',
    stipend: '₹8,000 - ₹12,000',
    stipendPerMonth: '/month',
    type: 'Part-time',
    category: 'Legal',
    postedDate: '4 days ago',
    applicants: '19 applied',
    openings: '3 positions',
    featured: false,
    popular: false,
    urgent: false,
    remote: false,

    description: 'Join our law firm as a Legal Research Intern and gain exposure to various areas of law. Assist lawyers with legal research, drafting, and case preparation.',

    responsibilities: [
      'Conduct legal research on various topics',
      'Draft legal documents and memorandums',
      'Assist in case preparation and documentation',
      'Review and summarize case laws and statutes',
      'Attend court proceedings (when permitted)',
      'Maintain case files and legal databases',
    ],

    requirements: [
      'Currently pursuing LLB or LLM degree',
      'Strong legal research and writing skills',
      'Knowledge of Indian legal system',
      'Proficiency in legal databases (Manupatra, SCC Online)',
      'Attention to detail',
      'Ability to handle confidential information',
    ],

    skills: [
      'Legal Research',
      'Legal Writing',
      'Case Analysis',
      'Contract Drafting',
      'Legal Databases',
      'MS Office',
      'Critical Thinking',
      'Documentation',
    ],

    perks: [
      'Practical legal experience',
      'Certificate of internship',
      'Exposure to court proceedings',
      'Mentorship from senior lawyers',
      'Networking in legal community',
      'Stipend certificate for college',
    ],

    aboutCompany: 'Supreme Law Associates is a full-service law firm with expertise in corporate law, litigation, intellectual property, and regulatory compliance.',

    applicationProcess: [
      'Submit resume and cover letter',
      'Legal writing test',
      'Interview with partner',
      'Background verification',
      'Offer letter',
    ],

    applicationLink: 'https://supremelaw.com/internships',

    color: 'from-indigo-500 to-violet-500',
    icon: '⚖️',
  },
  {
    id: 'content-writing-intern-mediahouse',
    title: 'Content Writing Intern',
    company: 'MediaHouse Publications',
    location: 'Remote',
    duration: '3-4 months',
    stipend: '₹8,000 - ₹15,000',
    stipendPerMonth: '/month',
    type: 'Full-time',
    category: 'Marketing',
    postedDate: '1 day ago',
    applicants: '67 applied',
    openings: '5 positions',
    featured: false,
    popular: true,
    urgent: true,
    remote: true,

    description: 'We are looking for creative content writers to create engaging articles, blogs, and social media content. Perfect opportunity for aspiring writers to build their portfolio.',

    responsibilities: [
      'Write articles, blogs, and website content',
      'Create social media posts and captions',
      'Research topics and industry trends',
      'Edit and proofread content',
      'Collaborate with marketing and design teams',
      'Optimize content for SEO',
    ],

    requirements: [
      'Currently pursuing or completed degree in Journalism, English, Communications, or related field',
      'Excellent writing and grammar skills',
      'Creative thinking and storytelling ability',
      'Basic SEO knowledge is a plus',
      'Ability to meet deadlines',
      'Portfolio of writing samples',
    ],

    skills: [
      'Content Writing',
      'Creative Writing',
      'Blogging',
      'SEO Writing',
      'Research',
      'Editing',
      'Social Media',
      'WordPress',
    ],

    perks: [
      'Build professional writing portfolio',
      'Certificate and bylines',
      'Flexible work hours',
      'Work from anywhere',
      'Writing workshops and training',
      'Performance-based bonuses',
    ],

    aboutCompany: 'MediaHouse Publications is a digital media company creating content across various platforms including blogs, websites, and social media for clients worldwide.',

    applicationProcess: [
      'Submit resume and writing samples',
      'Writing test assignment',
      'Interview with Content Head',
      'Trial period (1 week)',
      'Confirmation letter',
    ],

    applicationLink: 'https://mediahouse.com/write-for-us',

    color: 'from-rose-500 to-pink-500',
    icon: '✍️',
  },
  {
    id: 'data-science-intern-ailabs',
    title: 'Data Science Intern',
    company: 'AI Labs India',
    location: 'Hybrid (Pune)',
    duration: '6 months',
    stipend: '₹20,000 - ₹30,000',
    stipendPerMonth: '/month',
    type: 'Full-time',
    category: 'Technology',
    postedDate: '6 days ago',
    applicants: '41 applied',
    openings: '2 positions',
    featured: true,
    popular: true,
    urgent: false,
    remote: false,

    description: 'Join our AI/ML team to work on cutting-edge data science projects. Gain hands-on experience with machine learning, data analysis, and AI model development.',

    responsibilities: [
      'Develop and train machine learning models',
      'Analyze large datasets and extract insights',
      'Build data pipelines and automation scripts',
      'Create data visualizations and reports',
      'Assist in AI/ML research projects',
      'Document findings and present results',
    ],

    requirements: [
      'Currently pursuing or completed degree in Computer Science, Data Science, Statistics, or related field',
      'Knowledge of Python and data science libraries',
      'Understanding of machine learning algorithms',
      'Experience with SQL and data manipulation',
      'Strong analytical and problem-solving skills',
      'Passion for AI and emerging technologies',
    ],

    skills: [
      'Python',
      'Machine Learning',
      'Pandas/NumPy',
      'TensorFlow/PyTorch',
      'SQL',
      'Data Visualization',
      'Statistics',
      'Jupyter Notebook',
    ],

    perks: [
      'Work on AI/ML research projects',
      'Certificate and recommendation letter',
      'Access to GPU infrastructure',
      'Mentorship from data scientists',
      'Conference and workshop attendance',
      'High potential for PPO',
      'Hybrid work model',
    ],

    aboutCompany: 'AI Labs India is a research and development company focused on artificial intelligence, machine learning, and data science solutions for various industries.',

    applicationProcess: [
      'Submit resume and GitHub profile',
      'Online coding and ML test',
      'Technical assignment on data analysis',
      'Technical interview with data science team',
      'HR round',
      'Offer letter',
    ],

    applicationLink: 'https://ailabs.in/careers/internships',

    color: 'from-cyan-500 to-blue-500',
    icon: '🤖',
  },
  {
    id: 'hr-intern-peoplefirst',
    title: 'Human Resources Intern',
    company: 'PeopleFirst HR Solutions',
    location: 'On-site (Hyderabad)',
    duration: '3 months',
    stipend: '₹10,000 - ₹15,000',
    stipendPerMonth: '/month',
    type: 'Full-time',
    category: 'Operations',
    postedDate: '2 weeks ago',
    applicants: '52 applied',
    openings: '3 positions',
    featured: false,
    popular: false,
    urgent: false,
    remote: false,

    description: 'Learn about HR operations, recruitment, employee engagement, and organizational development. Great opportunity to start your career in Human Resources.',

    responsibilities: [
      'Assist in recruitment and onboarding processes',
      'Screen resumes and schedule interviews',
      'Maintain employee records and databases',
      'Support employee engagement activities',
      'Help organize training and development programs',
      'Assist in HR policy documentation',
    ],

    requirements: [
      'Currently pursuing or completed MBA in HR, BBA, or related field',
      'Good communication and interpersonal skills',
      'Organizational and multitasking abilities',
      'Proficiency in MS Office',
      'Discretion in handling confidential information',
      'Positive attitude and willingness to learn',
    ],

    skills: [
      'Recruitment',
      'MS Office',
      'Communication',
      'Organization',
      'HR Operations',
      'Employee Relations',
      'Documentation',
      'Time Management',
    ],

    perks: [
      'Hands-on HR experience',
      'Certificate of internship',
      'Networking opportunities',
      'Learning sessions on HR practices',
      'Exposure to various HR functions',
      'Potential for full-time role',
    ],

    aboutCompany: 'PeopleFirst HR Solutions is a leading HR consulting and staffing company helping organizations build strong teams and improve workplace culture.',

    applicationProcess: [
      'Submit resume and cover letter',
      'HR aptitude test',
      'Group discussion',
      'Personal interview',
      'Final HR round',
      'Offer letter',
    ],

    applicationLink: 'https://peoplefirst.com/careers/internship',

    color: 'from-amber-500 to-orange-500',
    icon: '👥',
  },
];

