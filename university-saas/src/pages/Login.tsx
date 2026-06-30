import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GraduationCap, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../lib/firebase/auth';
import { useAuthStore } from '../store/authStore';
import { getUserData } from '../lib/firebase/auth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { loginSchema, type LoginFormData } from '../lib/utils/validators';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setFirebaseUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      const fbUser = await loginUser(data.email, data.password);
      setFirebaseUser({ uid: fbUser.uid, email: fbUser.email });
      const userData = await getUserData(fbUser.uid);
      if (!userData) throw new Error('Compte introuvable.');
      setUser(userData);

      const dashboards: Record<string, string> = {
        super_admin_plateforme: '/dashboard/super-admin',
        admin_universite: '/dashboard/admin',
        teacher: '/dashboard/enseignant',
        student: '/dashboard/etudiant',
        parent: '/dashboard/parent',
      };
      navigate(dashboards[userData.role] ?? from, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur de connexion.';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError('Email ou mot de passe incorrect.');
      } else {
        setError(msg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900">University SaaS</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
          <p className="text-gray-500 text-sm mt-1">Accédez à votre espace de gestion</p>
        </div>

        {error && (
          <div className="mb-4">
            <Alert type="error" title="Erreur de connexion" message={error} onClose={() => setError(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Adresse email"
            type="email"
            placeholder="admin@universite.fr"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            required
            {...register('email')}
          />

          <div className="relative">
            <Input
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              required
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
              Se souvenir de moi
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          <Button type="submit" loading={isSubmitting} className="w-full justify-center" size="lg">
            Se connecter
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ?{' '}
          <Link to="/onboarding" className="text-blue-600 font-semibold hover:underline">
            Créer un espace université
          </Link>
        </p>

        {/* Demo accounts */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-500 font-medium mb-2">Comptes de démonstration :</p>
          <div className="space-y-1 text-xs text-gray-500">
            <p>Super Admin : admin@platform.fr / Admin2024!</p>
            <p>Université : admin@univ-demo.fr / Demo2024!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
