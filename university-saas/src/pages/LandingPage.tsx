import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesGrid } from '../components/landing/FeaturesGrid';
import { PricingTable } from '../components/landing/PricingTable';
import { SocialProof } from '../components/landing/SocialProof';
import { Footer } from '../components/common/Footer';
import { ArrowRight, GraduationCap } from 'lucide-react';

const LandingPage: React.FC = () => (
  <div className="font-sans">
    {/* Navigation */}
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black text-gray-900">University SaaS</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#fonctionnalites" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Fonctionnalités
          </a>
          <a href="#tarifs" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Tarifs
          </a>
          <a href="#temoignages" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Témoignages
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/connexion"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Connexion
          </Link>
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            Essai gratuit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>

    <div className="pt-16">
      <HeroSection />
      <FeaturesGrid />
      <SocialProof />
      <PricingTable />

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-br from-blue-900 to-indigo-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à transformer votre établissement ?
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Rejoignez plus de 50 universités qui ont choisi University SaaS pour moderniser leur gestion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              Commencer maintenant <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="mailto:demo@universitysaas.fr"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Demander une démo
            </a>
          </div>
          <p className="mt-6 text-blue-300 text-sm">14 jours d'essai gratuit · Aucune carte bancaire requise · Annulation à tout moment</p>
        </div>
      </section>

      <Footer />
    </div>
  </div>
);

export default LandingPage;
