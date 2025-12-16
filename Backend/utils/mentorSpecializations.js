const mentorSpecializations = [
  {
    id: 'business-startup',
    name: 'Business & Startup Mentors',
    badge: 'Growth Strategy',
    description: 'Scale operations, refine business models, and unlock funding strategies with founders who have been there before.',
    tags: ['business-startup', 'business']
  },
  {
    id: 'idea-innovation',
    name: 'Idea & Innovation Mentors',
    badge: 'Product-Market Fit',
    description: 'Validate new ideas, build MVP roadmaps, and design go-to-market plans with innovation experts.',
    tags: ['idea-innovation', 'business']
  },
  {
    id: 'technology-product',
    name: 'Technology & Product Mentors',
    badge: 'Tech Architecture',
    description: 'Ship reliable products, set up engineering culture, and adopt the right tech stack for scale.',
    tags: ['technology-product', 'technology', 'tech']
  },
  {
    id: 'finance-accounting',
    name: 'Finance, Accounting & Fundraising Mentors',
    badge: 'Financial Playbooks',
    description: 'Build investor-ready models, manage compliance, and streamline cash-flow with seasoned finance leaders.',
    tags: ['finance-accounting', 'finance']
  },
  {
    id: 'legal-compliance',
    name: 'Legal & Compliance Mentors',
    badge: 'Policy & Governance',
    description: 'Stay compliant, draft airtight contracts, and navigate regulatory frameworks with legal specialists.',
    tags: ['legal-compliance', 'legal']
  },
  {
    id: 'marketing-branding',
    name: 'Marketing, Branding & Sales Mentors',
    badge: 'Revenue Engine',
    description: 'Design high-converting funnels, storytelling, and sales playbooks that unlock sustainable demand.',
    tags: ['marketing-branding', 'marketing']
  },
  {
    id: 'leadership-personal',
    name: 'Leadership & Personal Development Mentors',
    badge: 'Executive Coaching',
    description: 'Build resilient leadership habits, scale teams, and foster high-performance culture.',
    tags: ['leadership-personal', 'personal']
  },
  {
    id: 'police-defence',
    name: 'Police & Defence Mentors',
    badge: 'Service Excellence',
    description: 'Get guidance from decorated officers on recruitment, fitness, and leadership in uniformed services.',
    tags: ['police-defence', 'career']
  },
  {
    id: 'design-creative',
    name: 'Design & Creative Mentors',
    badge: 'Creative Direction',
    description: 'Craft brand systems, UI/UX journeys, and visual identities with award-winning creative directors.',
    tags: ['design-creative', 'career']
  },
  {
    id: 'motivation-wellness',
    name: 'Motivation, Life Skills & Wellness Mentors',
    badge: 'Holistic Growth',
    description: 'Build mindset, resilience, and wellness routines with counsellors, coaches, and life-skill experts.',
    tags: ['motivation-wellness', 'personal']
  },
  {
    id: 'business-advisors',
    name: 'Business Advisors',
    badge: 'Boardroom Insight',
    description: 'Access strategic advisors for board setup, governance, and cross-industry partnership opportunities.',
    tags: ['business-advisors', 'business']
  }
];

const specializationById = new Map(mentorSpecializations.map(spec => [spec.id, spec]));
const specializationByName = new Map(mentorSpecializations.map(spec => [spec.name.toLowerCase(), spec]));

const resolveSpecialization = (input) => {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const normalized = input.trim().toLowerCase();
  return specializationById.get(normalized) || specializationByName.get(normalized) || null;
};

const getSpecializationIdFromName = (name) => {
  if (!name || typeof name !== 'string') {
    return null;
  }

  const normalized = name.trim().toLowerCase();
  const spec = specializationByName.get(normalized);
  return spec ? spec.id : null;
};

const getAllSpecializationIds = () => mentorSpecializations.map(spec => spec.id);

module.exports = {
  mentorSpecializations,
  resolveSpecialization,
  getSpecializationIdFromName,
  getAllSpecializationIds
};


