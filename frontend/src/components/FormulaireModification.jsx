import { useEffect, useState } from 'react';

export default function FormulaireModification({
  editingCharacter,
  setEditingCharacter,
  setBackendData
}) {
  const [formData, setFormData] = useState({
    name: '',
    realName: '',
    universe: '',
    id: null
  });

  useEffect(() => {
    if (editingCharacter) {
      setFormData({
        name: editingCharacter.name || '',
        realName: editingCharacter.realName || '',
        universe: editingCharacter.universe || '',
        id: editingCharacter.id
      });
    }
  }, [editingCharacter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id) {
      alert("Erreur: ID manquant");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/characters/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur serveur');
      }

      const updatedCharacter = await response.json();

      setBackendData(prev => {
        if (!Array.isArray(prev)) return [updatedCharacter];
        return prev.map(char => char.id === formData.id ? updatedCharacter : char);
      });

      setEditingCharacter(null);
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur: ' + (err.message || 'Échec de la modification'));
    }
  };

  if (!editingCharacter) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Modifier le personnage</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Vrai nom:</label>
            <input
              type="text"
              name="realName"
              value={formData.realName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Univers:</label>
            <input
              type="text"
              name="universe"
              value={formData.universe}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setEditingCharacter(null)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}