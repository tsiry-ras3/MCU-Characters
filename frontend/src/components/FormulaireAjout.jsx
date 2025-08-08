import { useState } from 'react';

export default function FormulaireAjout({ onClose, setBackendData }) {
  const [formData, setFormData] = useState({
    name: '',
    realName: '',
    universe: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Erreur lors de l\'ajout');

      const newCharacter = await response.json();
      
      setBackendData(prev => [...prev, newCharacter]);
      onClose();
      
    } catch (err) {
      console.error('Erreur:', err);
      alert('Échec de l\'ajout: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Ajouter un nouveau personnage</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Vrai nom:</label>
            <input
              type="text"
              name="realName"
              value={formData.realName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Univers:</label>
            <input
              type="text"
              name="universe"
              value={formData.universe}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300/90 text-gray-700 rounded-md hover:bg-gray-400/90 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600/90 text-white rounded-md hover:bg-green-700/90 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}