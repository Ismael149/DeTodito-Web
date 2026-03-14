import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { imageService } from '../services/imageService';
import { 
  UserCircleIcon, 
  CameraIcon, 
  MapPinIcon, 
  ShieldCheckIcon,
  ShoppingBagIcon,
  Cog6ToothIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    country: '',
    gender: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        country: user.country || '',
        gender: user.gender || ''
      });
    }
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const imageUrl = await imageService.uploadSingleImage(file);
      const updatedUser = await userService.updateProfile({ avatar_url: imageUrl });
      updateUser(updatedUser);
      alert('Avatar actualizado con éxito');
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('Error al subir la imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedUser = await userService.updateProfile(formData);
      updateUser(updatedUser);
      setEditing(false);
      alert('Perfil actualizado con éxito');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header section with cover color */}
      <div className="relative h-48 rounded-t-3xl bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <div className="relative -mt-24 px-8 pb-12 bg-white rounded-b-3xl shadow-xl border border-gray-100">
        <div className="flex flex-col md:flex-row items-end md:items-center space-y-4 md:space-y-0 md:space-x-8">
          {/* Avatar with Camera Overlay */}
          <div className="relative group">
            <div className="w-40 h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircleIcon className="w-32 h-32 text-gray-200" />
              )}
            </div>
            <label className="absolute bottom-2 right-2 p-3 bg-blue-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-all hover:scale-110 active:scale-95 group-hover:block">
              <CameraIcon className="w-6 h-6" />
              <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
            </label>
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-lg text-gray-500 font-medium">{user.username}</p>
            <div className="flex items-center mt-3 text-gray-600">
              <MapPinIcon className="w-5 h-5 mr-1 text-blue-500" />
              <span>{user.country || 'Sin ubicación'}</span>
              <span className="mx-2">•</span>
              <ShieldCheckIcon className="w-5 h-5 mr-1 text-green-500" />
              <span className="text-sm font-semibold capitalize font-mono text-green-600 bg-green-50 px-2 py-0.5 rounded-md">Cuenta {user.role || 'Usuario'}</span>
            </div>
          </div>

          <div className="flex space-x-3">
             <button 
              onClick={() => setEditing(!editing)}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-95"
            >
              {editing ? 'Cancelar' : 'Editar Perfil'}
            </button>
            <button 
              onClick={() => navigate('/settings')}
              className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all active:scale-95 border border-blue-100"
            >
              <Cog6ToothIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
          {/* Main Info Form/Display */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4 flex items-center">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
              Información Personal
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Nombre</label>
                  <input 
                    disabled={!editing}
                    value={formData.first_name}
                    onChange={e => setFormData({...formData, first_name: e.target.value})}
                    placeholder="Ej. Juan"
                    className="w-full px-5 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Apellido</label>
                  <input 
                    disabled={!editing}
                    value={formData.last_name}
                    onChange={e => setFormData({...formData, last_name: e.target.value})}
                    placeholder="Ej. Pérez"
                    className="w-full px-5 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Teléfono</label>
                  <input 
                    disabled={!editing}
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+58 412..."
                    className="w-full px-5 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Género</label>
                  <select 
                    disabled={!editing}
                    value={formData.gender}
                    onChange={e => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-5 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium text-gray-900 appearance-none"
                  >
                    <option value="">No especificado</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              {editing && (
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 mt-4 uppercase tracking-widest"
                >
                  {loading ? 'Guardando...' : 'Aplicar Cambios'}
                </button>
              )}
            </form>
          </div>

          {/* Quick Access Sidebar */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4 flex items-center">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full mr-3"></span>
              Atajos
            </h2>

            <div className="space-y-4">
              <button 
                onClick={() => navigate('/orders')}
                className="w-full flex items-center justify-between p-5 bg-orange-50 rounded-2xl border border-orange-100 hover:bg-orange-100 transition-all group"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-orange-500 text-white rounded-xl mr-4 shadow-lg shadow-orange-100">
                    <ShoppingBagIcon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-orange-900">Mis Compras</p>
                    <p className="text-sm text-orange-600">Historial y trackeo</p>
                  </div>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-orange-400 transform group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => navigate('/settings')}
                className="w-full flex items-center justify-between p-5 bg-blue-50 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-all group"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-blue-600 text-white rounded-xl mr-4 shadow-lg shadow-blue-100">
                    <Cog6ToothIcon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-blue-900">Seguridad</p>
                    <p className="text-sm text-blue-600">Contraseña y privacidad</p>
                  </div>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-blue-400 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Email</h3>
              <p className="font-bold text-gray-900 mb-6 truncate">{user.email}</p>
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Antigüedad</h3>
              <p className="font-bold text-gray-900">{new Date(user.created_at).toLocaleDateString('es-ES', { 
                month: 'long', 
                year: 'numeric' 
              })}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;