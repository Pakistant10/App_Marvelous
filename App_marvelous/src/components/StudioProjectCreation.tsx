import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { useProjectStore } from '../store';
import { StudioProject } from '../types';
import CountrySelector from './CountrySelector';

const studioPackages = [
  {
    id: 'basic',
    name: 'Basic Studio',
    duration: 60,
    photos: 5,
    printIncluded: false,
    price: {
      fr: 150,
      cm: 75000
    }
  },
  {
    id: 'standard',
    name: 'Standard Studio',
    duration: 90,
    photos: 10,
    printIncluded: true,
    price: {
      fr: 250,
      cm: 125000
    }
  },
  {
    id: 'premium',
    name: 'Premium Studio',
    duration: 120,
    photos: 15,
    printIncluded: true,
    price: {
      fr: 350,
      cm: 175000
    }
  }
];

interface StudioProjectCreationProps {
  onClose: () => void;
}

function StudioProjectCreation({ onClose }: StudioProjectCreationProps) {
  const { addProject, activeSeason } = useProjectStore();
  const [formData, setFormData] = useState({
    client: '',
    date: '',
    email: '',
    phone: '',
    country: 'fr',
    sessionType: 'portrait' as StudioProject['sessionType'],
    selectedPackage: 'basic',
    backdrop: '',
    props: [] as string[],
    notes: '',
    documents: [] as File[],
    deliveryDays: 7,
    customPrice: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeSeason) return;

    const selectedPackage = studioPackages.find(p => p.id === formData.selectedPackage);
    if (!selectedPackage) return;

    const price = formData.customPrice || selectedPackage.price[formData.country as keyof typeof selectedPackage.price];

    addProject({
      couple: formData.client,
      date: formData.date,
      email: formData.email,
      phone: formData.phone,
      location: 'Studio',
      country: formData.country,
      seasonId: activeSeason.id,
      type: 'studio',
      sessionType: formData.sessionType,
      package: {
        name: selectedPackage.name,
        duration: selectedPackage.duration,
        photos: selectedPackage.photos,
        printIncluded: selectedPackage.printIncluded
      },
      price,
      backdrop: formData.backdrop,
      props: formData.props,
      notes: formData.notes,
      deliveryDays: formData.deliveryDays
    });

    onClose();
  };

  const formatPrice = (price: number) => {
    return formData.country === 'fr' 
      ? `${price}€`
      : `${price.toLocaleString()} FCFA`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Nouvelle séance studio</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client *
              </label>
              <input
                type="text"
                required
                value={formData.client}
                onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nom du client"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de la séance *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="email@exemple.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={formData.country === 'fr' ? '06 12 34 56 78' : '6 12 34 56 78'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pays *
            </label>
            <CountrySelector
              value={formData.country}
              onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de séance *
            </label>
            <select
              required
              value={formData.sessionType}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                sessionType: e.target.value as StudioProject['sessionType']
              }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="portrait">Portrait</option>
              <option value="family">Famille</option>
              <option value="pregnancy">Grossesse</option>
              <option value="newborn">Nouveau-né</option>
              <option value="product">Produit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forfait *
            </label>
            <div className="grid grid-cols-3 gap-4">
              {studioPackages.map(pkg => (
                <label
                  key={pkg.id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    formData.selectedPackage === pkg.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="package"
                    value={pkg.id}
                    checked={formData.selectedPackage === pkg.id}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      selectedPackage: e.target.value 
                    }))}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <h3 className="font-medium">{pkg.name}</h3>
                    <p className="text-sm text-gray-500">{pkg.duration} min</p>
                    <p className="text-sm text-gray-500">{pkg.photos} photos</p>
                    <p className="text-sm text-gray-500">
                      {pkg.printIncluded ? 'Tirages inclus' : 'Sans tirages'}
                    </p>
                    <p className="mt-2 font-medium text-blue-600">
                      {formatPrice(pkg.price[formData.country as keyof typeof pkg.price])}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix personnalisé (optionnel)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.customPrice || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  customPrice: e.target.value ? parseFloat(e.target.value) : 0
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                placeholder={`Prix en ${formData.country === 'fr' ? 'EUR' : 'FCFA'}`}
              />
              <span className="text-gray-500">
                {formData.country === 'fr' ? '€' : 'FCFA'}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Laissez vide pour utiliser le prix du forfait
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fond
            </label>
            <input
              type="text"
              value={formData.backdrop}
              onChange={(e) => setFormData(prev => ({ ...prev, backdrop: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ex: Blanc, Noir, Coloré..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Accessoires requis
            </label>
            <textarea
              value={formData.props.join('\n')}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                props: e.target.value.split('\n').filter(p => p.trim()) 
              }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Un accessoire par ligne"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Notes additionnelles..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Documents et fichiers
            </label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setFormData(prev => ({
                      ...prev,
                      documents: [...prev.documents, ...Array.from(e.target.files || [])]
                    }));
                  }
                }}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
                </span>
              </label>
              {formData.documents.length > 0 && (
                <div className="mt-4 text-sm text-gray-500">
                  {formData.documents.length} fichier(s) sélectionné(s)
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Créer la séance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudioProjectCreation;