import { useState } from 'react';
import { X } from 'lucide-react';
import './styles.css';

const ImageModal = ({setImages}) => {

  const [previews, setPreviews] = useState({
    image1: '',
    image2: '',
    image3: ''
  });


  const handleImageUpload = (e, imageKey) => {
    const file = e.target.files[0];
    if (file) {
      setImages(prev => ({ //aqui me da el error
        ...prev,
        [imageKey]: file
      }));
      
      const previewUrl = URL.createObjectURL(file);
      setPreviews(prev => ({
        ...prev,
        [imageKey]: previewUrl
      }));
    }
  };


  const handleRemoveImage = (imageKey) => {
    setImages(prev => ({
      ...prev,
      [imageKey]: null
    }));
    
    if (previews[imageKey]) {
      URL.revokeObjectURL(previews[imageKey]);
    }
    setPreviews(prev => ({
      ...prev,
      [imageKey]: ''
    }));
  };

  return (
    <div className="image-form--container">
      <h2 className="image-form--title">Subir Imágenes</h2>
      
      <div className="image-form--grid">
        {[1, 2, 3].map((num) => {
          const imageKey = `image${num}`;
          return (
            <div key={imageKey} className="image-form--item">
              {previews[imageKey] ? (
                <div className="image-form--preview-container">
                  <img 
                    src={previews[imageKey]} 
                    alt={`Preview ${num}`} 
                    className="image-form--preview-image"
                  />
                  <button
                    onClick={() => handleRemoveImage(imageKey)}
                    className="image-form--remove-button"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="image-form--upload-label">
                  <div className="image-form--upload-content">
                    <p className="image-form--upload-text">Click para subir</p>
                    <p className="image-form--upload-subtext">PNG, JPG, GIF</p>
                  </div>
                  <input
                    type="file"
                    className="image-form--input"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, imageKey)}
                  />
                </label>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ImageModal;