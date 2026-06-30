import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Shield, TrendingUp, Zap } from 'lucide-react';

export const HeroSection: React.FC = () => (
  <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden min-h-screen flex items-center">
    {/* Background decorations */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 opacity-10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-3xl" />
    </div>

    <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Propulsé par l'Intelligence Artificielle</span>
          </div>

          <div>
            <h1 className="text-5xl lg:text-6xl font-black leading-tight">
              Révolutionnez la
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400"> Gestion Universitaire</span>
              {' '}avec l'IA
            </h1>
            <p className="mt-6 text-xl text-blue-200 leading-relaxed">
              Automatisez vos flux administratifs, boostez la performance académique
              et{' '}
              <span className="text-white font-semibold">réduisez les coûts de 40%</span>{' '}
              grâce à notre plateforme SaaS multi-tenant pilotée par l'intelligence artificielle.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Démarrer un essai gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="inline-flex items-center gap-2 bg-white/10 border border-white/30 px-6 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-colors backdrop-blur">
              <Play className="w-5 h-5 fill-current" />
              Voir la démo
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-4">
            {[
              { icon: Shield, label: 'Sécurité RGPD', value: '100%' },
              { icon: TrendingUp, label: 'Réduction coûts', value: '-40%' },
              { icon: Zap, label: 'Déploiement', value: '24h' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <Icon className="w-6 h-6 mx-auto mb-1 text-blue-300" />
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-blue-300">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Illustration Dashboard Mock */}
        <div className="hidden lg:block">
          <div className="relative">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <div className="w-3 h-3 bg-green-400 rounded-full" />
                <div className="flex-1 bg-white/10 h-6 rounded ml-4" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Étudiants', value: '1,248', color: 'bg-blue-400' },
                  { label: 'Cours actifs', value: '84', color: 'bg-green-400' },
                  { label: 'Taux réussite', value: '92%', color: 'bg-purple-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white/10 rounded-xl p-3">
                    <div className={`w-8 h-8 ${color} rounded-lg mb-2`} />
                    <p className="text-lg font-bold">{value}</p>
                    <p className="text-xs text-blue-300">{label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-xs text-blue-300 mb-2">Performance académique</p>
                <div className="flex items-end gap-1 h-16">
                  {[40, 65, 55, 80, 70, 90, 75, 88, 92].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-blue-400 to-blue-300 rounded-t"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {['Martin Dupont', 'Sophie Laurent', 'Ahmad Karim'].map((name) => (
                  <div key={name} className="flex items-center gap-3 bg-white/10 rounded-lg p-2.5">
                    <div className="w-7 h-7 bg-blue-400 rounded-full" />
                    <div className="flex-1">
                      <div className="h-2 bg-white/30 rounded w-24 mb-1" />
                      <div className="h-1.5 bg-white/20 rounded w-16" />
                    </div>
                    <div className="text-xs bg-green-400/30 text-green-300 px-2 py-0.5 rounded-full">Actif</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -top-4 -right-4 bg-white text-gray-900 rounded-xl p-3 shadow-xl">
              <p className="text-xs text-gray-500">Nouveaux inscrits</p>
              <p className="text-xl font-bold text-green-600">+24</p>
              <p className="text-xs text-gray-400">ce mois</p>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white text-gray-900 rounded-xl p-3 shadow-xl">
              <p className="text-xs text-gray-500">Revenu mensuel</p>
              <p className="text-xl font-bold text-blue-600">8 400€</p>
              <p className="text-xs text-green-500">↑ 12%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="mt-16 pt-8 border-t border-white/10">
        <p className="text-center text-blue-300 text-sm mb-6">Déjà adopté par des établissements de premier plan</p>
        <div className="flex flex-wrap justify-center gap-8 opacity-50">
          {['Université Paris Tech', 'École Nationale Sup.', 'Institut Médical Lyon', 'Université Bordeaux'].map((uni) => (
            <span key={uni} className="text-white font-semibold text-sm">{uni}</span>
          ))}
        </div>
      </div>
    </div>
  </section>
);
