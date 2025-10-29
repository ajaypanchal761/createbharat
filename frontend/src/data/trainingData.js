// Complete Entrepreneurship Mastery Program Training Data
export const trainingCourses = [
  {
    id: 'entrepreneurship-mastery',
    name: 'Complete Entrepreneurship Mastery Program',
    description: 'A comprehensive program to master entrepreneurship and startup development',
    provider: 'Innobharat (MSME Registered)',
    collaboration: 'In collaboration with MEPSC / NSDC (Proposed Partnership)',
    presenter: 'Koushik Chakraborty (Founder & CEO)',
    email: 'koushik@innobharat.com',
    website: 'www.innobharat.com',
    duration: '45 Hours',
    modules: 9,
    language: 'English',
    image: '/src/assets/training.jpg',
    color: 'from-indigo-500 to-purple-600',
    about: {
      english: 'Innobharat is a government-registered entrepreneurship and startup development platform committed to empowering India\'s youth, students, and business owners with real-world business knowledge. Our mission is to build a strong ecosystem of entrepreneurs who are trained, certified, and confident to build their ventures.',
      hindi: 'इननोभारत एक सरकारी पंजीकृत उद्यमिता और स्टार्टअप विकास प्लेटफार्म है जो युवाओं, विद्यार्थियों और व्यापारियों को वास्तविक व्यावसायिक ज्ञान प्रदान करने के लिए प्रतिबद्ध है। हमारा उद्देश्य एक ऐसा इकोसिस्टम बनाना है जहाँ प्रशिक्षित और प्रमाणित उद्यमी आत्मनिर्भर भारत का निर्माण करें।'
    },
    overview: {
      english: {
        modules: 'Total Modules: 9',
        duration: 'Minimum Duration: 45 Hours',
        certification: 'Certification: Generated only after completion of all 9 modules and assessments',
        eligibility: 'Eligibility: Students, Startup Founders, MSME Entrepreneurs, Business Enthusiasts'
      },
      hindi: {
        modules: 'कुल मॉड्यूल: 9',
        duration: 'न्यूनतम अवधि: 45 घंटे',
        certification: 'प्रमाणपत्र: सभी मॉड्यूल पूर्ण करने के बाद ही जारी किया जाएगा',
        eligibility: 'पात्रता: विद्यार्थी, स्टार्टअप संस्थापक, एमएसएमई उद्यमी और व्यापार उत्साही'
      }
    },
    assessment: {
      minScore: 70,
      method: 'Quiz + Assignment + Final Assessment'
    }
  }
];

export const modules = [
  {
    id: 'module-1',
    courseId: 'entrepreneurship-mastery',
    number: 1,
    title: 'Startup Fundamentals',
    titleHindi: 'स्टार्टअप की बुनियादी जानकारी',
    objective: 'Understand the concept of business, difference between startup & traditional business.',
    outcome: 'Learners will be able to identify viable business ideas and structure basic business plans.',
    evaluationMethod: 'Quiz + Assignment + Final Assessment',
    topics: [
      {
        id: 'module-1-topic-1',
        number: 1,
        title: 'What is Business and Types of Businesses',
        content: {
          english: `Business means an activity where people sell goods or services and earn profit. 
The main goal of every business is to satisfy customer needs and earn money in return.

Types of Businesses in India:
1. Sole Proprietorship – A business owned by one person. Easy to start with few documents, but has unlimited liability. Example: Local tea shop, grocery store.
2. Partnership Firm – A business started by two or more people. They have a partnership deed. Example: Small law firms, CA firms.
3. Private Limited Company (Pvt Ltd) – Best for growth and funding. Has limited liability and can issue shares. Example: Ola, Zomato, Flipkart.
4. LLP (Limited Liability Partnership) – A mix of partnership and company. Partners have limited liability. Example: Consultancy firms, early-stage startups.
5. Franchise Model – Running your outlet under an established brand's license. Example: McDonald's, Domino's.`
        }
      },
      {
        id: 'module-1-topic-2',
        number: 2,
        title: 'Difference Between Startup and Small Business',
        content: {
          english: `A small business is a traditional business focused on stability and regular income. Example: Boutique, stationery shop, bakery.
A startup is a new business focused on innovation and high growth. Its goal is to scale fast, attract investors, and capture a large market.

Key Differences:
- Small Business = Self-funded.
- Startup = Funded by investors or crowdfunding.
- Small Business = Slow and stable growth.
- Startup = Fast and disruptive growth.

Example: Small business = Local bakery. Startup = Zomato (online food delivery with rapid growth).`
        }
      },
      {
        id: 'module-1-topic-3',
        number: 3,
        title: 'How to Find and Validate an Idea',
        content: {
          english: `Before starting a business, it's important to test your idea in the market. 
First, identify a problem, then think of a solution.

Steps for Validation:
1. Identify the problem – Example: Students need affordable food delivery.
2. Think of a solution – Example: An app connecting mess food to students.
3. Take feedback – Explain your idea to 10–20 people and collect feedback.
4. Run a pilot test (MVP) – Create a small prototype or survey using Google Forms, Instagram Polls, or WhatsApp groups.

The main goal of an MVP (Minimum Viable Product) is to test the market with minimum effort.`
        }
      },
      {
        id: 'module-1-topic-4',
        number: 4,
        title: 'Market Research Basics',
        content: {
          english: `Market Research means understanding the demand and competition for your product or service.

Types of Market Research:
- Primary Research: Direct surveys, interviews, or feedback.
- Secondary Research: Using reports, Google data, or articles.

Framework:
- TAM (Total Addressable Market): Total potential market size.
- SAM (Serviceable Available Market): The realistic portion of the market you can target.
- SOM (Serviceable Obtainable Market): The short-term market share you can capture.

Example: For Ola Cabs – TAM = India's transport market; SAM = Metro city cab market; SOM = Ola's initial Delhi + Bangalore market.`
        }
      },
      {
        id: 'module-1-topic-5',
        number: 5,
        title: 'Co-founder and Team Building Basics',
        content: {
          english: `A startup cannot be built by one person alone. A strong co-founder and team are always needed.

Rules for Co-founders:
- Complementary skills: If you are technical, find someone skilled in business or marketing.
- Trust and shared vision: Both should work toward the same goal.
- Hire slow, fire fast: Hire carefully and remove the wrong person quickly.

Example: Flipkart → Sachin Bansal (Tech) + Binny Bansal (Operations & Business).`
        }
      }
    ]
  },
  {
    id: 'module-2',
    courseId: 'entrepreneurship-mastery',
    number: 2,
    title: 'Legal & Compliance',
    titleHindi: 'कानूनी एवं अनुपालन',
    objective: 'Learn about company registration, licenses, and basic taxation.',
    evaluationMethod: 'Quiz + Assignment + Final Assessment',
    topics: [
      {
        id: 'module-2-topic-1',
        number: 1,
        title: 'Company Registration Types',
        content: {
          english: `When an entrepreneur starts a business, the very first step is to choose the right type of company registration.
This decision defines your business's legal structure, your level of responsibility, and how easily you can attract investors.

Types of Registrations in India:
1. Sole Proprietorship – A business owned by one person. It's simple and quick to start but comes with unlimited liability.
2. Partnership Firm – Started by two or more people together. A partnership deed is mandatory.
3. LLP (Limited Liability Partnership) – A hybrid model that provides the benefit of limited liability.
4. Private Limited Company (Pvt. Ltd.) – Best for growth and investor attraction. Example: Ola, Flipkart, Zomato.`
        }
      },
      {
        id: 'module-2-topic-2',
        number: 2,
        title: 'MSME Registration Process',
        content: {
          english: `MSME stands for Micro, Small, and Medium Enterprises. Once registered, the business becomes eligible for various government benefits.

Process:
1. Visit the official website → udyamregistration.gov.in
2. Required documents: Aadhaar card, PAN card, address proof, and bank details.
3. After submission, you receive a Udyam Registration Number.

Benefits:
- Loan subsidy
- Low-interest credit
- Tax benefits
- Preference in government tenders`
        }
      },
      {
        id: 'module-2-topic-3',
        number: 3,
        title: 'GST Basics for Startups',
        content: {
          english: `GST stands for Goods & Services Tax — a single indirect tax that replaced older systems like VAT and Service Tax.

When is GST registration mandatory?
- When goods turnover exceeds ₹40 lakh per year.
- When services turnover exceeds ₹20 lakh per year.

Benefits:
- One unified tax system across India.
- Input tax credit.
- More transparency for customers and investors.

Process: Apply through gst.gov.in to receive a GSTIN (Goods and Services Tax Identification Number).`
        }
      },
      {
        id: 'module-2-topic-4',
        number: 4,
        title: 'Trademark & Intellectual Property Rights (IPR)',
        content: {
          english: `Protecting Intellectual Property (IP) is essential for every startup.

Types of IPR:
- Trademark → Protects your logo, brand name, and tagline. Example: Nike's ✔ symbol.
- Copyright → Protects creative works like books, music, and software.
- Patent → Protects new inventions.

Process: Apply via ipindia.gov.in

Benefits:
- Prevents brand copying.
- Serves as legal proof of ownership.
- Builds trust in the market.`
        }
      },
      {
        id: 'module-2-topic-5',
        number: 5,
        title: 'Contracts & NDA Importance',
        content: {
          english: `In business, legal contracts and NDAs (Non-Disclosure Agreements) are extremely important.

- Contract: A legal agreement between two parties defining their rights and responsibilities.
- NDA: Signed when you share your business idea with someone, ensuring your idea stays confidential.

Why are they important?
- Build trust.
- Serve as legal proof during disputes.
- Keep your business idea safe.`
        }
      }
    ]
  }
];

// This is a simplified structure - you'll need to add the remaining modules 3-9 with similar structure
// For now, I'll create a complete structure file

export const completeModules = [
  // Module 1
  {
    id: 'module-1',
    number: 1,
    title: 'Startup Fundamentals',
    topics: [
      'What is Business and Types of Businesses',
      'Difference Between Startup and Small Business',
      'How to Find and Validate an Idea',
      'Market Research Basics',
      'Co-founder and Team Building Basics'
    ]
  },
  // Module 2
  {
    id: 'module-2',
    number: 2,
    title: 'Legal & Compliance',
    topics: [
      'Company Registration Types',
      'MSME Registration Process',
      'GST Basics for Startups',
      'Trademark & Intellectual Property Rights (IPR)',
      'Contracts & NDA Importance'
    ]
  },
  // Module 3
  {
    id: 'module-3',
    number: 3,
    title: 'Finance & Fundraising',
    topics: [
      'Basics of Accounting & Bookkeeping',
      'How to Make a Financial Projection',
      'Unit Economics (COGS, Profit Margin, Break-even)',
      'Bootstrapping vs External Funding',
      'How to Pitch to Angel Investors & VCs'
    ]
  },
  // Module 4
  {
    id: 'module-4',
    number: 4,
    title: 'Product & Technology',
    topics: [
      'What is MVP (Minimum Viable Product)?',
      'Tools for Making an App or Website (No-code & Tech Options)',
      'Product Roadmap & Versioning',
      'Cybersecurity Basics',
      'Scaling the Product for More Users'
    ]
  },
  // Module 5
  {
    id: 'module-5',
    number: 5,
    title: 'Marketing & Growth',
    topics: [
      'Branding & Positioning',
      'Digital Marketing Basics (SEO, Social Media, Google Ads)',
      'Building a Community Around Your Startup',
      'Customer Acquisition Strategies',
      'Growth Hacking Case Studies'
    ]
  },
  // Module 6
  {
    id: 'module-6',
    number: 6,
    title: 'Leadership & Team',
    topics: [
      'Founder Mindset & Resilience',
      'Building a Strong Culture',
      'Hiring the Right Team',
      'Conflict Management',
      'Leadership Skills for Startup Founders'
    ]
  },
  // Module 7
  {
    id: 'module-7',
    number: 7,
    title: 'Investor Readiness',
    topics: [
      'How to Prepare a Pitch Deck',
      'Common Questions Investors Ask',
      'Valuation Basics',
      'Term Sheets & Equity Dilution',
      'Post-Investment Responsibilities'
    ]
  },
  // Module 8
  {
    id: 'module-8',
    number: 8,
    title: 'Practical Labs',
    topics: [
      'Business Plan Writing Lab',
      'Pitch Deck Building Workshop',
      'Financial Model Excel Practice',
      'Marketing Campaign Simulation',
      'Legal Document Templates Usage'
    ]
  },
  // Module 9
  {
    id: 'module-9',
    number: 9,
    title: 'Business Shortcuts',
    topics: [
      'Common Financial Terms',
      'Startup & Investment Terms',
      'Marketing & Growth Terms',
      'Legal & Compliance Terms'
    ]
  }
];


