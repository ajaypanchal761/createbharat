import businessStartupImg from '../assets/mentor-categories/business-startup.svg';
import ideaInnovationImg from '../assets/mentor-categories/idea-innovation.svg';
import technologyProductImg from '../assets/mentor-categories/technology-product.svg';
import financeAccountingImg from '../assets/mentor-categories/finance-accounting.svg';
import legalComplianceImg from '../assets/mentor-categories/legal-compliance.svg';
import marketingBrandingImg from '../assets/mentor-categories/marketing-branding.svg';
import leadershipPersonalImg from '../assets/mentor-categories/leadership-personal.svg';
import policeDefenceImg from '../assets/mentor-categories/police-defence.svg';
import designCreativeImg from '../assets/mentor-categories/design-creative.svg';
import motivationWellnessImg from '../assets/mentor-categories/motivation-wellness.svg';
import businessAdvisorsImg from '../assets/mentor-categories/business-advisors.svg';

export const mentorCategories = [
  {
    id: 'business-startup',
    name: 'Business & Startup Mentors',
    image: businessStartupImg,
    gradient: 'from-orange-500 via-amber-500 to-red-500',
    badge: 'Growth Strategy',
    description:
      'Scale operations, refine business models, and unlock funding strategies with founders who have been there before.',
    tags: ['business-startup', 'business'],
  },
  {
    id: 'idea-innovation',
    name: 'Idea & Innovation Mentors',
    image: ideaInnovationImg,
    gradient: 'from-violet-500 via-indigo-500 to-blue-500',
    badge: 'Product-Market Fit',
    description:
      'Validate new ideas, build MVP roadmaps, and design go-to-market plans with innovation experts.',
    tags: ['idea-innovation', 'business'],
  },
  {
    id: 'technology-product',
    name: 'Technology & Product Mentors',
    image: technologyProductImg,
    gradient: 'from-sky-500 via-cyan-500 to-emerald-500',
    badge: 'Tech Architecture',
    description:
      'Ship reliable products, set up engineering culture, and adopt the right tech stack for scale.',
    tags: ['technology-product', 'technology', 'tech'],
  },
  {
    id: 'finance-accounting',
    name: 'Finance, Accounting & Fundraising Mentors',
    image: financeAccountingImg,
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    badge: 'Financial Playbooks',
    description:
      'Build investor-ready models, manage compliance, and streamline cash-flow with seasoned finance leaders.',
    tags: ['finance-accounting', 'finance'],
  },
  {
    id: 'legal-compliance',
    name: 'Legal & Compliance Mentors',
    image: legalComplianceImg,
    gradient: 'from-slate-600 via-slate-500 to-zinc-500',
    badge: 'Policy & Governance',
    description:
      'Stay compliant, draft airtight contracts, and navigate regulatory frameworks with legal specialists.',
    tags: ['legal-compliance', 'legal'],
  },
  {
    id: 'marketing-branding',
    name: 'Marketing, Branding & Sales Mentors',
    image: marketingBrandingImg,
    gradient: 'from-pink-500 via-rose-500 to-orange-500',
    badge: 'Revenue Engine',
    description:
      'Design high-converting funnels, storytelling, and sales playbooks that unlock sustainable demand.',
    tags: ['marketing-branding', 'marketing'],
  },
  {
    id: 'leadership-personal',
    name: 'Leadership & Personal Development Mentors',
    image: leadershipPersonalImg,
    gradient: 'from-lime-500 via-green-500 to-emerald-500',
    badge: 'Executive Coaching',
    description:
      'Build resilient leadership habits, scale teams, and foster high-performance culture.',
    tags: ['leadership-personal', 'personal'],
  },
  {
    id: 'police-defence',
    name: 'Police & Defence Mentors',
    image: policeDefenceImg,
    gradient: 'from-blue-700 via-slate-700 to-zinc-700',
    badge: 'Service Excellence',
    description:
      'Get guidance from decorated officers on recruitment, fitness, and leadership in uniformed services.',
    tags: ['police-defence', 'career'],
  },
  {
    id: 'design-creative',
    name: 'Design & Creative Mentors',
    image: designCreativeImg,
    gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
    badge: 'Creative Direction',
    description:
      'Craft brand systems, UI/UX journeys, and visual identities with award-winning creative directors.',
    tags: ['design-creative', 'career'],
  },
  {
    id: 'motivation-wellness',
    name: 'Motivation, Life Skills & Wellness Mentors',
    image: motivationWellnessImg,
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    badge: 'Holistic Growth',
    description:
      'Build mindset, resilience, and wellness routines with counsellors, coaches, and life-skill experts.',
    tags: ['motivation-wellness', 'personal'],
  },
  {
    id: 'business-advisors',
    name: 'Business Advisors',
    image: businessAdvisorsImg,
    gradient: 'from-amber-500 via-yellow-500 to-lime-500',
    badge: 'Boardroom Insight',
    description:
      'Access strategic advisors for board setup, governance, and cross-industry partnership opportunities.',
    tags: ['business-advisors', 'business'],
  },
];

export const getMentorCategoryById = (id) =>
  mentorCategories.find((category) => category.id === id);

