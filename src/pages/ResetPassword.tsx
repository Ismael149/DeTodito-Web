import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      validateToken(token);
    } else {
      setError('Token de recuperación no proporcionado');
      setValidating(false);
    }
  }, [token]);

  const validateToken = async (resetToken: string) => {
    try {
      const response = await authService.validateResetToken(resetToken);
      setTokenValid(true);
      setEmail(response.email);
    } catch (error: any) {
      setError(error.message || 'Token inválido o expirado');
      setTokenValid(false);
    } finally {
      setValidating(false);
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {
      newPassword: '',
      confirmPassword: ''
    };

    if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return !newErrors.newPassword && !newErrors.confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      await authService.resetPassword(token!, formData.newPassword);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Validando enlace...</h2>
            <p className="text-gray-600 mt-2">Por favor espera...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Enlace Inválido
            </h2>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-gray-600 mb-6">
                Este enlace de recuperación ha expirado o es inválido.
              </p>
              
              <div className="space-y-3">
                <Link
                  to="/forgot-password"
                  className="w-full btn-primary py-2 block text-center"
                >
                  Solicitar Nuevo Enlace
                </Link>
                <Link
                  to="/login"
                  className="w-full text-blue-600 hover:text-blue-700 py-2 block text-center"
                >
                  Volver al Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              ¡Contraseña Actualizada!
            </h2>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <div className="text-green-500 text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Contraseña Restablecida
              </h3>
              
              <p className="text-gray-600 mb-4">
                Tu contraseña ha sido restablecida exitosamente.
              </p>
              <p className="text-gray-600 mb-6">
                Ahora puedes iniciar sesión con tu nueva contraseña.
              </p>

              <div className="space-y-3">
                <Link
                  to="/login"
                  className="w-full btn-primary py-2 block text-center"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Nueva Contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tu nueva contraseña para la cuenta: <strong>{email}</strong>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Nueva Contraseña
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              value={formData.newPassword}
              onChange={(e) => setFormData({
                ...formData,
                newPassword: e.target.value
              })}
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Mínimo 6 caracteres"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({
                ...formData,
                confirmPassword: e.target.value
              })}
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Repite tu contraseña"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;