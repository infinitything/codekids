import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import SocialProof from './components/SocialProof';
import ProblemSolution from './components/ProblemSolution';
import Curriculum from './components/Curriculum';
import Comparison from './components/Comparison';
import Results from './components/Results';
import ParentFocused from './components/ParentFocused';
import Guarantee from './components/Guarantee';
import Urgency from './components/Urgency';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <SocialProof />
      <ProblemSolution />
      <Curriculum />
      <Comparison />
      <Results />
      <ParentFocused />
      <Guarantee />
      <Urgency />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default App;