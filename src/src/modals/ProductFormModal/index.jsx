import React, { useEffect, useState } from 'react';
import searchProducts from '../../utils/searchFn';
import useFirestoreContext from '../../hooks/useFirestoreContext';
import LoadingComponent from '../../components/Loading';
import './styles.css';

function ProductFormModal({ handleSubmit, newProduct, setNewProduct, setIsModalOpen }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState([]);

  const {getProducts} = useFirestoreContext();

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      console.log(fetchedProducts);
      setIsLoading(false)
    };
    loadProducts();
  }, []);


  const handleNameChange = async (e) => {
    const value = e.target.value;
    console.log(value)
    setNewProduct({ ...newProduct, name: value });
    
    // Realizamos la búsqueda cuando el texto tiene al menos 3 caracteres
    if (value.length >= 3) {
      console.log('working search')
      try {
        const results = await searchProducts(products, value);
        setSuggestions(results);
      } catch (error) {
        console.error("Error al buscar productos:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Al hacer click en la sugerencia, se completan los datos deseados
    setNewProduct({
      ...newProduct,
      name: suggestion.name,
      price: suggestion.price,
      color: suggestion.color,
      category: suggestion.category,
    });
    setSuggestions([]);
  };

  return (
    <div className="modal">
      {isLoading && LoadingComponent}
      <form onSubmit={handleSubmit} className="modalContent">
        <h3 className="subtitle">Nuevo Producto</h3>

        {/* Campo para "Nombre del producto" con autocompletado */}
        <div className="formGroup">
          <label className="label">Nombre del producto</label>
          <input
            type="text"
            value={newProduct.name}
            onChange={handleNameChange}
            className="input"
            required
          />
          {suggestions.length > 0 && (
            <ul className="suggestionsList">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index} 
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestionItem"
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/*
          Se renderizan los demás campos del formulario.
          En este ejemplo, se excluye "name" ya que lo gestionamos de manera especial.
        */}
        {['category', 'price', 'size', 'color', 'stock'].map((field) => (
          <div key={field} className="formGroup">
            <label className="label">
              {field === 'price'
                ? 'Precio'
                : field === 'size'
                ? 'Talle'
                : field === 'color'
                ? 'Color'
                : field === 'category'
                ? 'Categoria'
                : field === 'stock'
                ? 'Cantidad en inventario'
                : field}
            </label>
            <input
              type={field === 'price' || field === 'stock' ? 'number' : 'text'}
              value={newProduct[field]}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  [field]: e.target.value,
                })
              }
              className="input"
              required
            />
          </div>
        ))}

        <div className="buttonGroup">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            style={{ backgroundColor: 'red', color: '#fff' }}
            className="button"
          >
            Salir
          </button>

          <button type="submit" className="button">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductFormModal;
