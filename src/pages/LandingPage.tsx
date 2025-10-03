import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import ScrollProgress from '../components/ScrollProgress';
import InfiniteTestimonials from '../components/InfiniteTestimonials';
import InteractiveFeatures from '../components/InteractiveFeatures';
import BeforeAfter from '../components/BeforeAfter';
import ParentDashboardPreview from '../components/ParentDashboardPreview';
import SoftSkills from '../components/SoftSkills';
import ProblemSolution from '../components/ProblemSolution';
import Comparison from '../components/Comparison';
import CurriculumJourney from '../components/CurriculumJourney';
import ParentFocused from '../components/ParentFocused';
import Results from '../components/Results';
import SocialProof from '../components/SocialProof';
import FAQ from '../components/FAQ';
import Guarantee from '../components/Guarantee';
import PricingJourney from '../components/PricingJourney';
import Urgency from '../components/Urgency';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export const LandingPage = () => {
  return (
    <>
      <ScrollProgress />
      <Navigation />
      <Hero />
      {/* Removed: Watch Your Child Transform section */}
      <InteractiveFeatures />
      <BeforeAfter />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        className="text-center px-4 -mt-12"
      >
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-2xl max-w-5xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start This Journey?
          </h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join 12,000+ kids who went from "What's coding?" to building real AI apps. Start the journey today.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/auth?mode=signup'}
            className="bg-white text-purple-600 font-bold px-10 py-4 rounded-xl shadow-lg transition-all duration-300 ring-4 ring-white/20 hover:ring-white/40"
          >
            Start Your Child's First Project →
          </motion.button>
        </div>
      </motion.div>
      <ProblemSolution />
      <ParentDashboardPreview />
      <SoftSkills />
      <Comparison />
      <div id="curriculum">
        <CurriculumJourney />
      </div>
      <ParentFocused />
      <div id="results">
        <Results />
      </div>
      <SocialProof />
      <div id="pricing">
        <PricingJourney />
      </div>
      <div id="faq">
        <FAQ />
      </div>
      <Guarantee />
      <FinalCTA />
      <Footer />
    </>
  );
};
