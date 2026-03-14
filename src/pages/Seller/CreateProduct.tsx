import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { authService } from '../../services/authService';
import { paymentService } from '../../services/paymentService';
import { 
  PhotoIcon, 
  XMarkIcon, 
  PlusIcon,
  TagIcon,
  ArchiveBoxIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const CreateProduct: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    condition: 'nuevo',
    attributes: {
      'Marca': '',
      'Modelo': '',
      'Color': ''
    } as { [key: string]: string }
  });

  const [newAttrKey, setNewAttrKey] = useState('');
  const [newAttrValue, setNewAttrValue] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPaymentWarning, setShowPaymentWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadCategories();
    checkPaymentMethod();
  }, []);

  const loadCategories = async () => {
    const data = await categoryService.getCategories();
    setCategories(data);
  };

  const checkPaymentMethod = async () => {
    try {
      const methods = await paymentService.getUserPaymentMethods();
      if (!methods || methods.length === 0) {
        setShowPaymentWarning(true);
      }
    } catch (error) {
      console.error('Error checking payment methods:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAttributeChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: { ...prev.attributes, [key]: value }
    }));
  };

  const addCustomAttribute = () => {
    if (newAttrKey && newAttrValue) {
      handleAttributeChange(newAttrKey, newAttrValue);
      setNewAttrKey('');
      setNewAttrValue('');
    }
  };

  const removeAttribute = (key: string) => {
    const newAttrs = { ...formData.attributes };
    delete newAttrs[key];
    setFormData(prev => ({ ...prev, attributes: newAttrs }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      alert('Máximo 10 imágenes permitidas');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.category_id) newErrors.category_id = 'La categoría es obligatoria';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Precio inválido';
    if (formData.stock === '' || parseInt(formData.stock) < 0) newErrors.stock = 'Stock inválido';
    if (images.length === 0) newErrors.images = 'Debes subir al menos una imagen';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (showPaymentWarning) {
      alert('Debes registrar un método de pago antes de publicar.');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('category_id', formData.category_id);
      data.append('condition', formData.condition);
      data.append('attributes', JSON.stringify(formData.attributes));
      
      images.forEach(image => data.append('images', image));

      await productService.createProduct(data);
      navigate('/my-products');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Publicar Producto</h1>
      <p className="text-gray-600 mb-8">Completa los detalles para empezar a vender.</p>

      {showPaymentWarning && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 rounded-r-lg">
          <div className="flex">
            <InformationCircleIcon className="h-6 w-6 text-amber-400 mr-3" />
            <div>
              <p className="text-sm text-amber-700">
                <span className="font-bold">Atención:</span> No tienes un método de pago registrado. 
                Necesitas uno para recibir los pagos de tus ventas. 
                <button 
                  onClick={() => navigate('/profile')} 
                  className="ml-2 font-bold underline"
                >
                  Registrar ahora
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center space-x-2 text-blue-600 mb-4">
            <InformationCircleIcon className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-gray-900">Información Básica</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto *</label>
              <input 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Eje: iPhone 15 Pro Max"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
              <select 
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condición</label>
              <select 
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="nuevo">Nuevo</option>
                <option value="usado">Usado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Describe tu producto..."
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center space-x-2 text-blue-600 mb-4">
            <TagIcon className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-gray-900">Precio e Inventario</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio (USD) *</label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-gray-500">$</span>
                <input 
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.price ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Disponible *</label>
              <input 
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.stock ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Cantidad"
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center space-x-2 text-blue-600 mb-4">
            <ArchiveBoxIcon className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-gray-900">Especificaciones</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Marca', 'Modelo', 'Color'].map(key => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
                <input 
                  value={formData.attributes[key]}
                  onChange={(e) => handleAttributeChange(key, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={key}
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-3">Agregar especificaciones personalizadas</p>
            <div className="flex space-x-3">
              <input 
                value={newAttrKey}
                onChange={e => setNewAttrKey(e.target.value)}
                placeholder="Nombre (ej: Material)"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none"
              />
              <input 
                value={newAttrValue}
                onChange={e => setNewAttrValue(e.target.value)}
                placeholder="Valor (ej: Cuero)"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none"
              />
              <button 
                type="button" 
                onClick={addCustomAttribute}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {Object.entries(formData.attributes)
                .filter(([key]) => !['Marca', 'Modelo', 'Color'].includes(key))
                .map(([key, value]) => (
                  <span key={key} className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {key}: {value}
                    <button type="button" onClick={() => removeAttribute(key)} className="ml-2">
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 text-blue-600 mb-6">
            <PhotoIcon className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-gray-900">Imágenes del Producto *</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group aspect-square">
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg border border-gray-200" />
                <button 
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {images.length < 10 && (
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-400 hover:text-blue-500"
              >
                <PhotoIcon className="h-8 w-8 mb-1" />
                <span className="text-xs">Agregar</span>
              </button>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageSelect}
            className="hidden"
            multiple
            accept="image/*"
          />
          {errors.images && <p className="text-red-500 text-xs mt-2">{errors.images}</p>}
          <p className="text-xs text-gray-500 mt-4">Sube hasta 10 imágenes. La primera será la principal.</p>
        </div>

        <div className="flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={() => navigate('/my-products')}
            className="px-8 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            {loading ? 'Publicando...' : 'Publicar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
