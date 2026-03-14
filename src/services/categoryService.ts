import { api } from './api';
import { 
  phonePortrait, tv, home, bicycle, shirt, gameController, 
  cut, construct, car, cart, time, laptop, watch, book,
  musicalNotes, restaurant, medical, flower, colorPalette, fitness,
  cube
} from 'ionicons/icons';

// Mapeo de iconos para categorías (igual que en la app móvil)
export const categoryIcons: { [key: string]: string } = {
  'Tecnología': phonePortrait,
  'Electrodomésticos': tv,
  'Hogar': home,
  'Deportes': bicycle,
  'Moda': shirt,
  'Juguetes': gameController,
  'Belleza': cut,
  'Herramientas': construct,
  'Vehículos': car,
  'Supermercado': cart,
  'Historial': time,
  'Celulares': phonePortrait,
  'Computación': laptop,
  'Relojes': watch,
  'Libros': book,
  'Música': musicalNotes,
  'Comida': restaurant,
  'Salud': medical,
  'Jardín': flower,
  'Arte': colorPalette,
  'Fitness': fitness
};

export const categoryService = {
  async getCategories() {
    try {
      const response = await api.get('/categories');
      // Agregar iconos a las categorías
      return response.data.map((category: any) => ({
        ...category,
        icon: categoryIcons[category.name] || cube
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  getIconForCategory(categoryName: string): string {
    return categoryIcons[categoryName] || cube;
  }
};
