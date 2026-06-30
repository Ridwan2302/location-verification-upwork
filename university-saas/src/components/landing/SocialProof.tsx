import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Prof. Marie-Claire Fontaine',
    role: 'Doyenne de la Faculté des Sciences',
    university: 'Université Paris-Lumières',
    content:
      'University SaaS a transformé notre gestion administrative. La saisie des notes est désormais 3 fois plus rapide, et nos enseignants peuvent se concentrer sur ce qui compte vraiment : l\'enseignement. Le support client est exceptionnel.',
    rating: 5,
    initials: 'MF',
    color: 'bg-blue-500',
  },
  {
    name: 'Dr. Karim Benali',
    role: 'Directeur des Affaires Académiques',
    university: 'Institut Supérieur de Lyon',
    content:
      'La conformité RGPD intégrée et l\'isolation des données par tenant nous ont convaincu. Nos 1 800 étudiants bénéficient d\'une expérience numérique moderne, et notre direction dispose de tableaux de bord en temps réel pour prendre des décisions éclairées.',
    rating: 5,
    initials: 'KB',
    color: 'bg-green-500',
  },
  {
    name: 'Isabelle Marchand',
    role: 'Vice-Présidente Formation',
    university: 'École Nationale d\'Ingénierie de Bordeaux',
    content:
      'Le module de paiement Stripe et le suivi des scolarités ont éliminé 90% de notre charge administrative liée aux impayés. L\'onboarding était simple, et en moins de 48h notre établissement était opérationnel. Vraiment impressionnant.',
    rating: 5,
    initials: 'IM',
    color: 'bg-purple-500',
  },
];

export const SocialProof: React.FC = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <span className="inline-block bg-yellow-50 text-yellow-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
          Témoignages
        </span>
        <h2 className="text-4xl font-bold text-gray-900">
          Ce que disent nos clients
        </h2>
        <p className="mt-4 text-xl text-gray-500">
          Des directeurs et doyens qui ont transformé leur établissement
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-gray-50 rounded-2xl p-8 relative">
            <Quote className="w-8 h-8 text-blue-100 absolute top-6 right-6" />

            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>

            <p className="text-gray-600 leading-relaxed mb-6 text-sm">
              "{t.content}"
            </p>

            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold ${t.color}`}>
                {t.initials}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
                <p className="text-xs text-blue-600 font-medium">{t.university}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
        {[
          { value: '50+', label: 'Établissements partenaires' },
          { value: '35 000+', label: 'Étudiants gérés' },
          { value: '4.9/5', label: 'Note moyenne clients' },
          { value: '40%', label: 'Réduction des coûts admin' },
        ].map(({ value, label }) => (
          <div key={label}>
            <p className="text-3xl font-black">{value}</p>
            <p className="text-blue-200 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
