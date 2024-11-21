import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { useProjectStore } from '../store';
import { CorporateProject } from '../types';
import CountrySelector from './CountrySelector';

const corporatePackages = {
  conference: {
    base: {
      fr: 1500,
      cm: 750000
    },
    streaming: {
      fr: 500,
      cm: 250000
    }
  },
  team_building: {
    base: {
      fr: 1200,
      cm: 600000
    }
  },
  product_launch: {
    base: {
      fr: 2000,
      cm: 1000000
    },
    video: {
      fr: 800,
      cm: 400000
    }
  }
};

interface CorporateProjectCreationProps {
  onClose: () => void;
}

function CorporateProjectCreation({ onClose }: CorporateProjectCreationProps) {
  const { addProject, activeSeason } = useProjectStore();
  const [formData, setFormData] = useState({
    eventName: '',
    date: '',
    company: {
      name: '',
      contact: '',
      position: ''
    },
    email: '',
    phone: '',
    country: 'fr',
    location: '',
    eventType: 'conference' as CorporateProject['eventType'],
    attendees: 0,
    requirements: [] as string[],
    deliverables: {
      photos: true,
      video: false,
      streaming: false,
      prints: false
    },
    notes: '',
    documents: [] as File[],
    deliveryDays: 14,
    customPrice: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeSeason) return;

    const calculatedPrice = formData.customPrice || calculateBasePrice();

    addProject({
      couple: `${formData.company.name} - ${formData.eventName}`,
      date: formData.date,
      location: formData.location,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      seasonId: activeSeason.id,
      type: 'corporate',
      eventType: formData.eventType,
      company: formData.company,
      attendees: formData.attendees,
      requirements: formData.requirements,
      deliverables: formData.deliverables,
      notes: formData.notes,
      deliveryDays: formData.deliveryDays,
      price: calculatedPrice
    });

    onClose();
  };

  const calculateBasePrice = () => {
    const prices = corporatePackages[formData.eventType as keyof typeof corporatePackages];
    let total = prices.base[formData.country as keyof typeof prices.base];
    
    if (formData.deliverables.streaming && prices.streaming) {
      total += prices.streaming[formData.country as keyof typeof prices.streaming];
    }
    
    if (formData.deliverables.video && prices.video) {
      total += prices.video[formData.country as keyof typeof prices.video];
    }

    return total;
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
          <h2 className="text-lg font-semibold">Nouveau projet corporate</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'événement *
              </label>
              <input
                type="text"
                required
                value={formData.eventName}
                onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nom de l'événement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type d'événement *
              </label>
              <select
                required
                value={formData.eventType}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  eventType: e.target.value as CorporateProject['eventType']
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="conference">Conférence</option>
                <option value="team_building">Team Building</option>
                <option value="product_launch">Lancement de produit</option>
                <option value="corporate_portrait">Portraits corporate</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de l'événement *
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
                Lieu *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Adresse de l'événement"
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

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Informations entreprise</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company.name}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    company: { ...prev.company, name: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact principal *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company.contact}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    company: { ...prev.company, contact: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poste du contact
                </label>
                <input
                  type="text"
                  value={formData.company.position}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    company: { ...prev.company, position: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de participants
                </label>
                <input
                  type="number"
                  value={formData.attendees}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    attendees: parseInt(e.target.value) 
                  }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Livrables
            </label>
            <div className="space-y-2">
              {Object.entries(formData.deliverables).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      deliverables: {
                        ...prev.deliverables,
                        [key]: e.target.checked
                      }
                    }))}
                    className="rounded text-blue-600 mr-2"
                  />
                  <span className="text-sm">
                    {key === 'photos' ? 'Photos' :
                     key === 'video' ? 'Vidéo' :
                     key === 'streaming' ? 'Streaming live' :
                     'Tirages'}
                  </span>
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
              Prix de base calculé : {formatPrice(calculateBasePrice())}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Besoins spécifiques
            </label>
            <textarea
              value={formData.requirements.join('\n')}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                requirements: e.target.value.split('\n').filter(r => r.trim()) 
              }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Un besoin par ligne"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes additionnelles
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
              Créer le projet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CorporateProjectCreation;