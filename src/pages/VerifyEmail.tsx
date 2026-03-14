import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | 'loading'>('loading');
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false);

  useEffect(() => {
    if (token && !hasVerified.current) {
      hasVerified.current = true;
      verifyEmail(token);
    } else if (!token) {
      setVerificationStatus('error');
      setMessage('Token de verificación no proporcionado');
      setLoading(false);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      setLoading(true);
      console.log('🔐 Verificando email con token:', verificationToken);
      
      const response = await authService.verifyEmail(verificationToken);
      
      setVerificationStatus('success');
      setMessage(response.message);
    } catch (error: any) {
      console.error('❌ Error en verificación:', error);
      setVerificationStatus('error');
      setMessage(error.message || 'Error al verificar el email');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = () => {
    navigate('/resend-verification');
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificando tu email...</h2>
            <p className="text-gray-600">Estamos procesando tu solicitud</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Email Verificado!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="w-full btn-primary py-2 block text-center"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error de Verificación</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={handleResendEmail}
                className="w-full btn-secondary py-2"
              >
                Reenviar Email de Verificación
              </button>
              <Link
                to="/login"
                className="w-full text-blue-600 hover:text-blue-700 py-2 block text-center"
              >
                Volver al Login
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verificar Email
          </h2>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {renderContent()}
        </div>

        {loading && (
          <div className="text-center">
            <p className="text-gray-600">Verificando email...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;