import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { DeleteButton, UpdateButton } from './components/ApiMethode';
import FormulaireModification from './components/FormulaireModification';
import FormulaireAjout from './components/FormulaireAjout';

function App() {
  const [backendData, setBackendData] = useState([{}]);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetch("/characters")
      .then(response => {
        console.log("Réponse brute du serveur :", response);
        return response.json();
      })
      .then(data => {
        console.log("Données JSON reçues :", data);
        setBackendData(data.characters);
      })
      .catch(err => {
        console.error("Erreur lors du fetch :", err);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-5xl font-bold text-center mb-6 text-blue-700">MCU Characters</h1>

      {backendData.length === 0 || (Object.keys(backendData[0]).length === 0) ? (
        <p className="text-center text-gray-500">Chargement des données...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-xl shadow-xl bg-indigo-50">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Real Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Universe</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 pl-14">Action</th>
              </tr>
            </thead>
            <tbody>
              {backendData.map((character) => (
                <tr key={character.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 align-top">{character.id}</td>
                  <td className="py-3 px-4 align-top">
                    <div className="font-medium">{character.name}</div>
                    {character.description && (
                      <div className="text-sm text-gray-600 mt-1">{character.description}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 align-top">{character.realName}</td>
                  <td className="py-3 px-4 align-top">{character.universe}</td>
                  <td className="py-3 px-4 align-top">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => UpdateButton(character.id, setBackendData, character, setEditingCharacter)}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors border border-blue-200 hover:border-blue-300 text-sm font-medium"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => DeleteButton(character.id, setBackendData)}
                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors border border-red-200 hover:border-red-300 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors border border-green-200 hover:border-green-300 text-sm font-medium"        >
          Ajouter
        </button>
      </div>

      {showAddForm && (
        <FormulaireAjout
          onClose={() => setShowAddForm(false)}
          setBackendData={setBackendData}
        />
      )}

      {editingCharacter && (
        <FormulaireModification
          editingCharacter={editingCharacter}
          setEditingCharacter={setEditingCharacter}
          setBackendData={setBackendData}
        />
      )}
    </div>
  );
}

export default App;