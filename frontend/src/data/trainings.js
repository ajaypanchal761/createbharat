export const trainingCourse = {
  id: 'entrepreneurship-mastery',
  title: 'Complete Entrepreneurship Mastery Program',
  description: 'Master the art of entrepreneurship with our comprehensive 9-module training program. Learn from industry experts and get certified.',
  instructor: 'CreateBharat Expert Team',
  totalModules: 9,
  totalTopics: 54,
  totalDuration: '45+ hours',
  rating: '4.9',
  students: '12,458',
  studentsEnrolled: '12,458',
  language: 'Hindi & English',
  level: 'Beginner to Advanced',
  certificatePrice: 499,
  
  certificate: {
    price: 499,
    available: true,
    features: [
      'Government Recognized Certificate',
      'LinkedIn Shareable',
      'Lifetime Validity',
      'Personalized with Your Name',
      'Digital & Printable PDF'
    ]
  },

  benefits: [
    'Learn at your own pace',
    'Access on mobile & desktop',
    'Expert mentorship support',
    'Real-world case studies',
    'Practical assignments',
    'Community forum access',
    'Lifetime course access',
    'Regular content updates'
  ]
};

export const modules = [
  {
    id: 1,
    title: 'Business Fundamentals',
    description: 'Learn the core concepts of starting and running a successful business',
    duration: '5 hours',
    icon: '💼',
    color: 'from-blue-500 to-cyan-500',
    topics: [
      {
        id: '1.1',
        title: 'Introduction to Entrepreneurship',
        description: 'Understanding what it takes to be an entrepreneur',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '18 mins',
        questions: [
          {
            id: 1,
            question: 'What is the primary characteristic of an entrepreneur?',
            options: ['Risk-taking ability', 'High education', 'Large capital', 'Government support'],
            correctAnswer: 0
          },
          {
            id: 2,
            question: 'Which of the following is NOT a type of entrepreneurship?',
            options: ['Social Entrepreneurship', 'Small Business', 'Corporate Entrepreneurship', 'Passive Entrepreneurship'],
            correctAnswer: 3
          },
          {
            id: 3,
            question: 'What does MVP stand for in business?',
            options: ['Most Valuable Player', 'Minimum Viable Product', 'Maximum Value Proposition', 'Market Value Point'],
            correctAnswer: 1
          }
        ]
      },
      {
        id: '1.2',
        title: 'Types of Business Models',
        description: 'Explore different business models and choose the right one',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '22 mins',
        questions: [
          {
            id: 1,
            question: 'B2B stands for?',
            options: ['Business to Business', 'Business to Buyer', 'Brand to Business', 'Back to Business'],
            correctAnswer: 0
          },
          {
            id: 2,
            question: 'Which business model involves selling products directly to consumers?',
            options: ['B2B', 'B2C', 'C2C', 'B2G'],
            correctAnswer: 1
          }
        ]
      },
      {
        id: '1.3',
        title: 'Identifying Market Opportunities',
        description: 'Learn how to spot and validate business opportunities',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '25 mins',
        questions: [
          {
            id: 1,
            question: 'What is a market gap?',
            options: ['Empty space in mall', 'Unmet customer need', 'Price difference', 'Location barrier'],
            correctAnswer: 1
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Market Research & Analysis',
    description: 'Master the art of understanding your target market and competitors',
    duration: '6 hours',
    icon: 'chart',
    color: 'from-purple-500 to-pink-500',
    topics: [
      {
        id: '2.1',
        title: 'Understanding Your Target Audience',
        description: 'Define and analyze your ideal customer profile',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '20 mins',
        questions: [
          {
            id: 1,
            question: 'What is a customer persona?',
            options: ['Customer photo', 'Fictional ideal customer profile', 'Customer list', 'Price segment'],
            correctAnswer: 1
          }
        ]
      },
      {
        id: '2.2',
        title: 'Competitor Analysis',
        description: 'Analyze competitors and find your competitive advantage',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '24 mins',
        questions: [
          {
            id: 1,
            question: 'SWOT analysis stands for?',
            options: ['Strengths, Weaknesses, Opportunities, Threats', 'Sales, Workflow, Operations, Technology', 'Strategy, Work, Output, Testing', 'None of the above'],
            correctAnswer: 0
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Financial Planning',
    description: 'Learn budgeting, funding, and financial management for your business',
    duration: '7 hours',
    icon: 'money',
    color: 'from-green-500 to-emerald-500',
    topics: [
      {
        id: '3.1',
        title: 'Business Budgeting Basics',
        description: 'Create and manage your business budget effectively',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '28 mins',
        questions: [
          {
            id: 1,
            question: 'What is CAPEX?',
            options: ['Capital Expenditure', 'Cash Experience', 'Capital Export', 'Capacity Expansion'],
            correctAnswer: 0
          }
        ]
      }
    ]
  }
];

