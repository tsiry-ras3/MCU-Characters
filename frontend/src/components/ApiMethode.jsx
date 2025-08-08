
export function DeleteButton(id, setBackendData) {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce personnage ?");
    
    if (!confirmDelete) return; 
    fetch(`/characters/${id}`, {
        method: 'DELETE',
    }).then(res => {
        if (!res.ok) throw new Error('Erreur lors de la suppression');
        setBackendData(prev => prev.filter(char => char.id !== id));
    })
        .catch(err => console.error("Erreur DELETE :", err));
}


export function UpdateButton(id, setBackendData, character, setEditingCharacter) {
  setEditingCharacter({...character});
  console.log("perso a editer", character)
}

export function UpdateCharacter(id, setBackendData, updatedData, setEditingCharacter) {
  const response = fetch(`http://localhost:8080/characters/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData)
  })
  .then(res => {
    if (!res.ok) throw new Error('Erreur lors de la mise à jour');
    console.log(res.json())
    return response.json();
  })
  .then(updatedCharacter => {
    setBackendData(prev => 
      prev.map(char => char.id === id ? updatedCharacter : char)
    );
    setEditingCharacter(null); 
    alert("Personnage mis à jour avec succès !");
  })
  .catch(err => {
    console.error("Erreur UPDATE:", err);
    alert("Erreur lors de la mise à jour: " + err.message);
  });
}