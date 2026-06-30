import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-400 py-12">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">U</span>
            </div>
            <span className="text-white font-bold">University SaaS</span>
          </div>
          <p className="text-sm leading-relaxed">
            La plateforme de gestion universitaire pilotée par l'IA pour l'éducation moderne.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Produit</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/#fonctionnalites" className="hover:text-white transition-colors">Fonctionnalités</Link></li>
            <li><Link to="/#tarifs" className="hover:text-white transition-colors">Tarifs</Link></li>
            <li><Link to="/onboarding" className="hover:text-white transition-colors">Démarrer</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Légal</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a></li>
            <li><a href="#" className="hover:text-white transition-colors">CGU</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm">© 2025 University SaaS. Tous droits réservés.</p>
        <p className="text-sm">Fait avec ❤️ pour l'éducation française</p>
      </div>
    </div>
  </footer>
);
