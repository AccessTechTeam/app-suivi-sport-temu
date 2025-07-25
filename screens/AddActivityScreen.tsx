import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/Button';
import Card from '../components/Card';

const AddActivityScreen: React.FC = () => {
  const { activityTypes, addActivity, setPage, addActivityType } = useAppContext();
  const [activityTypeId, setActivityTypeId] = useState<string>(activityTypes[0]?.id || '');
  const [duration, setDuration] = useState('');
  const [comment, setComment] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customIcon, setCustomIcon] = useState('💪');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityTypeId || !duration) return;

    await addActivity({
      activityTypeId,
      duration: parseInt(duration, 10),
      comment,
    });
    setPage('dashboard');
  };
  
  const handleAddCustom = async () => {
    if (!customName.trim()) return;
    await addActivityType({ name: customName, icon: customIcon });
    setCustomName('');
    setCustomIcon('💪');
    setShowCustom(false);
  };
  
  const handleActivityTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (value === 'add-new') {
        setShowCustom(true);
        setActivityTypeId('');
    } else {
        setActivityTypeId(value);
        setShowCustom(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{showCustom ? "Créer une activité" : "Déclarer une activité"}</h2>
        <p className="text-gray-500 mb-6">{showCustom ? "Ajoutez une nouvelle option à la liste pour tout le groupe." : "Enregistrez votre dernière séance pour atteindre votre objectif."}</p>
        
        {!showCustom ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="activityType" className="block text-sm font-medium text-gray-700">Type d'activité</label>
              <select
                id="activityType"
                value={activityTypeId}
                onChange={handleActivityTypeChange}
                className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm rounded-md"
              >
                <option value="" disabled>Sélectionnez une activité</option>
                {activityTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.name}
                  </option>
                ))}
                <option value="add-new">... Ajouter un nouveau type</option>
              </select>
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Durée (en minutes)</label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                required
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm"
                placeholder="ex: 30"
              />
            </div>
             <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Commentaire (optionnel)</label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm"
                    placeholder="Comment s'est passée votre séance ?"
                />
            </div>
            <div className="space-y-4 pt-2">
                <Button type="submit" disabled={!activityTypeId}>Ajouter l'activité</Button>
                <Button variant="secondary" onClick={() => setPage('dashboard')}>Retour au tableau de bord</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="customName" className="block text-sm font-medium text-gray-700">Nom de l'activité</label>
              <input
                type="text"
                id="customName"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm"
                placeholder="ex: Escalade"
              />
            </div>
             <div>
              <label htmlFor="customIcon" className="block text-sm font-medium text-gray-700">Icône (Emoji)</label>
              <input
                type="text"
                id="customIcon"
                value={customIcon}
                onChange={(e) => setCustomIcon(e.target.value)}
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm"
              />
            </div>
            <div className="space-y-4 pt-2">
                <Button onClick={handleAddCustom}>Enregistrer le type</Button>
                <Button variant="ghost" onClick={() => setShowCustom(false)}>Annuler</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AddActivityScreen;