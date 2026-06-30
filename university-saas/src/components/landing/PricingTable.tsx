import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Star } from 'lucide-react';
import { PLAN_DETAILS } from '../../types';

export const PricingTable: React.FC = () => (
  <section id="tarifs" className="py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
          Tarifs
        </span>
        <h2 className="text-4xl font-bold text-gray-900">
          Des plans adaptés à chaque établissement
        </h2>
        <p className="mt-4 text-xl text-gray-500">
          Commencez gratuitement, évoluez selon vos besoins
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {(['standard', 'premium', 'enterprise'] as const).map((plan, idx) => {
          const details = PLAN_DETAILS[plan];
          const isPremium = plan === 'premium';

          return (
            <div
              key={plan}
              className={`rounded-2xl p-8 relative ${
                isPremium
                  ? 'bg-blue-600 text-white shadow-2xl scale-105'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              {isPremium && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> POPULAIRE
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-1 ${isPremium ? 'text-white' : 'text-gray-900'}`}>
                  {details.name}
                </h3>
                <p className={`text-sm ${isPremium ? 'text-blue-200' : 'text-gray-500'}`}>
                  {details.maxStudents === 999999 ? 'Étudiants illimités' : `Jusqu'à ${details.maxStudents.toLocaleString('fr-FR')} étudiants`}
                </p>
              </div>

              <div className="mb-8">
                <span className={`text-5xl font-black ${isPremium ? 'text-white' : 'text-gray-900'}`}>
                  {details.price}€
                </span>
                <span className={`text-sm ${isPremium ? 'text-blue-200' : 'text-gray-500'}`}>/mois</span>
              </div>

              <ul className="space-y-3 mb-8">
                {details.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isPremium ? 'bg-blue-500' : 'bg-blue-50'
                    }`}>
                      <Check className={`w-3 h-3 ${isPremium ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                    <span className={`text-sm ${isPremium ? 'text-blue-100' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to={`/onboarding?plan=${plan}`}
                className={`block text-center py-3 px-6 rounded-xl font-semibold transition-colors ${
                  isPremium
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Commencer
              </Link>

              {idx === 0 && (
                <p className="text-center text-xs text-gray-400 mt-3">14 jours d'essai gratuit</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-500">
          Besoin d'un devis sur mesure ?{' '}
          <a href="mailto:contact@universitysaas.fr" className="text-blue-600 font-semibold hover:underline">
            Contactez-nous
          </a>
        </p>
      </div>
    </div>
  </section>
);
