import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { settingsService } from '../../services/settingsService';
import { 
  BellIcon, 
  EyeIcon, 
  LockClosedIcon, 
  UserIcon, 
  ArrowPathIcon,
  TrashIcon,
  InformationCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'light');
  const [settingsData, setSettingsData] = useState({
    pushNotifications: true,
    emailNotifications: true,
    orderUpdates: true,
    showOnlineStatus: true,
    showInSearch: true,
    twoFactorAuth: false,
    syncData: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      if (data.settings) {
        setSettingsData(prev => ({ ...prev, ...data.settings }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (setting: string) => {
    setSettingsData(prev => ({ ...prev, [setting]: !prev[setting as keyof typeof settingsData] }));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('app_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      await settingsService.updateSettings({ ...settingsData, theme });
      alert('Configuración guardada');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">Personaliza tu experiencia en DeTodito.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Appearance */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-6 text-blue-600">
            <EyeIcon className="h-6 w-6 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Apariencia</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Modo Oscuro</p>
              <p className="text-sm text-gray-500">Tema oscuro para toda la aplicación</p>
            </div>
            <button 
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-6 text-blue-600">
            <BellIcon className="h-6 w-6 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Notificaciones</h2>
          </div>
          <div className="space-y-6">
            {[
              { id: 'pushNotifications', label: 'Notificaciones Push', desc: 'Alertas en tiempo real' },
              { id: 'emailNotifications', label: 'Correo Electrónico', desc: 'Resumen diario y noticias' },
              { id: 'orderUpdates', label: 'Actualizaciones de Pedidos', desc: 'Estado de tus compras' }
            ].map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <button 
                  onClick={() => handleToggle(item.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settingsData[item.id as keyof typeof settingsData] ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settingsData[item.id as keyof typeof settingsData] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-6 text-blue-600">
            <LockClosedIcon className="h-6 w-6 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Privacidad y Seguridad</h2>
          </div>
          <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Autenticación de Dos Factores</p>
              <p className="text-sm text-gray-500">Aumenta la seguridad al iniciar sesión</p>
            </div>
            <button 
              onClick={() => handleToggle('twoFactorAuth')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settingsData.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settingsData.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          </div>
        </section>

        {/* Data Actions */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-6 text-blue-600">
            <ArrowPathIcon className="h-6 w-6 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Datos y Almacenamiento</h2>
          </div>
          <button className="flex items-center text-red-600 hover:text-red-700 transition-colors">
            <TrashIcon className="h-5 w-5 mr-2" />
            Limpiar caché y datos locales
          </button>
        </section>

        <div className="flex justify-end space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="px-8 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={saveSettings}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
