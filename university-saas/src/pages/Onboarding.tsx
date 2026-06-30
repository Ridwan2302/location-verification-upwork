import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building, User, CreditCard, Upload, Check,
  GraduationCap, ChevronRight, ArrowLeft, Eye, EyeOff
} from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase/config';
import { createUniversity } from '../lib/firebase/database';
import { ref, set } from 'firebase/database';
import { database } from '../lib/firebase/config';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { registerSchema, type RegisterFormData } from '../lib/utils/validators';
import { generateSlug } from '../lib/utils/helpers';
import { PLAN_DETAILS } from '../types';
import type { SubscriptionPlan } from '../types';

const STEPS = [
  { id: 1, title: 'Votre Université', icon: Building },
  { id: 2, title: 'Compte Admin', icon: User },
  { id: 3, title: 'Paiement', icon: CreditCard },
  { id: 4, title: 'Import données', icon: Upload },
];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planParam = (searchParams.get('plan') ?? 'standard') as SubscriptionPlan;

  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(planParam);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState<Partial<RegisterFormData>>({});
  const [cardData, setCardData] = useState({ number: '4242424242424242', expiry: '12/26', cvc: '123' });
  const [completed, setCompleted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const universityName = watch('universityName');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = generateSlug(e.target.value);
    setValue('slug', slug);
  };

  const onStep1Submit = handleSubmit((data) => {
    setFormData(data);
    setStep(2);
  });

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simuler paiement Stripe sandbox
      await new Promise((r) => setTimeout(r, 1500));

      // Créer l'université
      const universityId = await createUniversity({
        name: formData.universityName!,
        slug: formData.slug!,
        subscriptionPlan: selectedPlan,
        maxStudents: PLAN_DETAILS[selectedPlan].maxStudents,
        status: 'trial',
        createdAt: Date.now(),
        subscriptionStatus: {
          tier: selectedPlan,
          startDate: Date.now(),
          endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
          isActive: true,
        },
        config: {
          academicYears: ['2024-2025', '2025-2026'],
          departments: ['Sciences', 'Lettres', 'Droit', 'Économie'],
          programs: ['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2'],
          gradingScale: { A: 90, B: 75, C: 60, D: 45, F: 0 },
        },
        adminEmail: formData.adminEmail!,
        stripeCustomerId: `cus_demo_${Date.now()}`,
        stripeSubscriptionId: `sub_demo_${Date.now()}`,
      });

      // Créer le compte admin
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.adminEmail!,
        formData.password!
      );
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      });

      await set(ref(database, `users/${userCredential.user.uid}`), {
        id: userCredential.user.uid,
        email: formData.adminEmail,
        role: 'admin_universite',
        universityId,
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        createdAt: Date.now(),
        isActive: true,
      });

      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    setCompleted(true);
    setTimeout(() => navigate('/connexion'), 2000);
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Félicitations !</h2>
          <p className="text-gray-500">Votre université a été créée avec succès. Redirection vers la connexion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900">University SaaS</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Créez votre espace universitaire</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-8 gap-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <React.Fragment key={s.id}>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive ? 'bg-blue-600 text-white' : isDone ? 'bg-green-100 text-green-700' : 'bg-white text-gray-400 border border-gray-200'
                }`}>
                  {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  <span className="hidden sm:block">{s.title}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {error && (
          <div className="mb-4">
            <Alert type="error" title="Erreur" message={error} onClose={() => setError(null)} />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Étape 1 : Informations Université */}
          {step === 1 && (
            <form onSubmit={onStep1Submit} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Informations de l'établissement</h2>
                <p className="text-sm text-gray-500">Configurez votre espace université</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Plan sélectionné <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['standard', 'premium', 'enterprise'] as SubscriptionPlan[]).map((plan) => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => setSelectedPlan(plan)}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        selectedPlan === plan
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-sm capitalize">{plan}</p>
                      <p className="text-blue-600 font-bold">{PLAN_DETAILS[plan].price}€/mois</p>
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Nom de l'établissement"
                placeholder="Université Paris Tech"
                error={errors.universityName?.message}
                required
                {...register('universityName', { onChange: handleNameChange })}
              />

              <Input
                label="Identifiant unique (slug)"
                placeholder="universite-paris-tech"
                hint="Lettres minuscules, chiffres et tirets uniquement"
                error={errors.slug?.message}
                required
                {...register('slug')}
              />

              <Input
                label="Email administrateur"
                type="email"
                placeholder="admin@universite.fr"
                error={errors.adminEmail?.message}
                required
                {...register('adminEmail')}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  placeholder="Jean"
                  error={errors.firstName?.message}
                  required
                  {...register('firstName')}
                />
                <Input
                  label="Nom"
                  placeholder="Dupont"
                  error={errors.lastName?.message}
                  required
                  {...register('lastName')}
                />
              </div>

              <div className="relative">
                <Input
                  label="Mot de passe"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Minimum 8 caractères"
                  error={errors.password?.message}
                  required
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-9 text-gray-400"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Input
                label="Confirmer le mot de passe"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                required
                {...register('confirmPassword')}
              />

              <Button type="submit" className="w-full justify-center" size="lg">
                Continuer <ChevronRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          {/* Étape 2 : Récapitulatif avant paiement */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Récapitulatif</h2>
                <p className="text-sm text-gray-500">Vérifiez vos informations avant le paiement</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Établissement</span>
                  <span className="font-medium">{formData.universityName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Identifiant</span>
                  <span className="font-mono text-blue-600">{formData.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Administrateur</span>
                  <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium">{formData.adminEmail}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <span className="font-semibold">Plan {selectedPlan}</span>
                  <span className="font-bold text-blue-600">{PLAN_DETAILS[selectedPlan].price}€/mois</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} icon={<ArrowLeft className="w-4 h-4" />}>
                  Retour
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1 justify-center" size="lg">
                  Procéder au paiement <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Étape 3 : Paiement */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Paiement sécurisé</h2>
                <p className="text-sm text-gray-500">Environnement sandbox Stripe — Aucun vrai paiement effectué</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-blue-900">Plan {PLAN_DETAILS[selectedPlan].name}</span>
                  <span className="text-2xl font-black text-blue-600">{PLAN_DETAILS[selectedPlan].price}€/mois</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Numéro de carte (test)
                  </label>
                  <input
                    type="text"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono"
                    placeholder="4242 4242 4242 4242"
                  />
                  <p className="text-xs text-gray-400 mt-1">Utilisez 4242 4242 4242 4242 pour une carte test valide</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date d'expiration</label>
                    <input
                      type="text"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
                      placeholder="MM/AA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                    <input
                      type="text"
                      value={cardData.cvc}
                      onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
                <CreditCard className="w-4 h-4 flex-shrink-0" />
                Paiement 100% sécurisé par Stripe — Mode sandbox
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} icon={<ArrowLeft className="w-4 h-4" />}>
                  Retour
                </Button>
                <Button onClick={handlePayment} loading={loading} className="flex-1 justify-center" size="lg">
                  Payer {PLAN_DETAILS[selectedPlan].price}€/mois
                </Button>
              </div>
            </div>
          )}

          {/* Étape 4 : Import de données */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Import de données (optionnel)</h2>
                <p className="text-sm text-gray-500">Importez vos étudiants et enseignants en masse</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-900">Université créée avec succès !</p>
                  <p className="text-sm text-green-700">Votre espace est prêt. Vous pouvez maintenant importer vos données.</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 transition-colors">
                <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="font-medium text-gray-600 mb-1">Importer des étudiants (CSV/Excel)</p>
                <p className="text-sm text-gray-400 mb-3">Colonnes requises : prénom, nom, email, programme, département</p>
                <Button variant="outline" size="sm" icon={<Upload className="w-4 h-4" />}>
                  Choisir un fichier
                </Button>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 transition-colors">
                <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="font-medium text-gray-600 mb-1">Importer des enseignants (CSV/Excel)</p>
                <p className="text-sm text-gray-400 mb-3">Colonnes requises : prénom, nom, email, département, spécialisation</p>
                <Button variant="outline" size="sm" icon={<Upload className="w-4 h-4" />}>
                  Choisir un fichier
                </Button>
              </div>

              <Button onClick={handleFinish} className="w-full justify-center" size="lg">
                Accéder à mon espace <ChevronRight className="w-4 h-4" />
              </Button>
              <button
                onClick={handleFinish}
                className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Passer cette étape et importer plus tard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
