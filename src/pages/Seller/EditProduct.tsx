import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { authService } from '../../services/authService';
import { 
  PhotoIcon, 
  XMarkIcon, 
  PlusIcon,
  TagIcon,
  ArchiveBoxIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    condition: 'nuevo',
    is_active: true,
    attributes: {} as { [key: string]: string }
  });

  const [newAttrKey, setNewAttrKey] = useState('');
  const [newAttrValue, setNewAttrValue] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProductData();
  }, [id]);

  const loadProductData = async () => {
    try {
      setLoading(true);
      const [product, cats] = await Promise.all([
        productService.getProduct(parseInt(id!)),
        categoryService.getCategories()
      ]);

      setCategories(cats);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        stock: product.stock.toString(),
        category_id: product.category_id.toString(),
        condition: product.condition || 'nuevo',
        is_active: product.is_active,
        attributes: product.attributes || {}
      });
      setExistingImages(product.images || []);
    } catch (error) {
      console.error('Error loading product:', error);
      alert('Error al cargar el producto');
      navigate('/my-products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
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
    if (files.length + newImages.length + existingImages.length > 10) {
      alert('Máximo 10 imágenes permitidas');
      return;
    }

    setNewImages(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setNewPreviews(prev => [...prev, ...previews]);
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const markExistingForDeletion = (imageId: number) => {
    setImagesToDelete(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.category_id) newErrors.category_id = 'La categoría es obligatoria';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Precio inválido';
    if (formData.stock === '' || parseInt(formData.stock) < 0) newErrors.stock = 'Stock inválido';
    if (existingImages.length === 0 && newImages.length === 0) newErrors.images = 'Debes tener al menos una imagen';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('category_id', formData.category_id);
      data.append('condition', formData.condition);
      data.append('is_active', formData.is_active.toString());
      data.append('attributes', JSON.stringify(formData.attributes));
      
      if (imagesToDelete.length > 0) {
        data.append('images_to_delete', JSON.stringify(imagesToDelete));
      }

      newImages.forEach(image => data.append('images', image));

      await productService.updateProduct(parseInt(id!), data);
      navigate('/my-products');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar el producto');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate('/my-products')} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Producto</h1>
          <p className="text-gray-600">Actualiza la información de tu publicación.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Images */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 text-blue-600 mb-6">
            <PhotoIcon className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-gray-900">Galería de Imágenes *</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {/* Existing Images */}
            {existingImages.map((img) => (
              <div key={img.id} className="relative group aspect-square">
                <img src={img.image_url} alt="Product" className="w-full h-full object-cover rounded-lg border border-gray-200" />
                <button 
                  type="button"
                  onClick={() => markExistingForDeletion(img.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
                {img.is_primary && <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] px-1.5 rounded-full">Principal</span>}
              </div>
            ))}

            {/* New Previews */}
            {newPreviews.map((preview, index) => (
              <div key={`new-${index}`} className="relative group aspect-square">
                <img src={preview} alt="New Preview" className="w-full h-full object-cover rounded-lg border border-blue-200" />
                <button 
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {(existingImages.length + newImages.length) < 10 && (
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-400 hover:text-blue-500"
              >
                <PlusIcon className="h-8 w-8 mb-1" />
                <span className="text-xs">Agregar</span>
              </button>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageSelect} className="hidden" multiple accept="image/*" />
          {errors.images && <p className="text-red-500 text-xs mt-2">{errors.images}</p>}
        </div>

        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center space-x-2 text-blue-600 mb-4">
            <InformationCircleIcon className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-gray-900">Detalles del Producto</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input name="name" value={formData.name} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-200'}`} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
              <select name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condición</label>
              <select name="condition" value={formData.condition} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none">
                <option value="nuevo">Nuevo</option>
                <option value="usado">Usado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Estado de la Publicación</p>
              <p className="text-sm text-gray-500">{formData.is_active ? 'Visible en el marketplace' : 'Oculto al público'}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio (USD) *</label>
            <div className="relative">
              <span className="absolute left-4 top-2 text-gray-500">$</span>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.price ? 'border-red-500' : 'border-gray-200'}`} step="0.01" />
            </div>
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock disponible *</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.stock ? 'border-red-500' : 'border-gray-200'}`} />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/my-products')} className="px-8 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
          <button type="submit" disabled={saving} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center">
            {saving ? 'Guardando...' : (
              <>
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
