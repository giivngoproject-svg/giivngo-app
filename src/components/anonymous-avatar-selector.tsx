'use client';

import { useEffect, useState } from 'react';

interface AnonymousAvatar {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
  color: string;
}

interface AnonymousAvatarSelectorProps {
  value?: string;
  onChange: (avatarId: string) => void;
  disabled?: boolean;
}

export function AnonymousAvatarSelector({
  value,
  onChange,
  disabled = false,
}: AnonymousAvatarSelectorProps) {
  const [avatars, setAvatars] = useState<AnonymousAvatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock avatars data (will be replaced with API call)
  const MOCK_AVATARS: AnonymousAvatar[] = [
    {
      id: '1',
      name: 'Ninja Dragon',
      description: 'A stealthy dragon warrior',
      imageUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ninja-dragon&scale=80',
      color: '#7C5CFF',
    },
    {
      id: '2',
      name: 'Space Pirate',
      description: 'A daring captain of the cosmos',
      imageUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=space-pirate&scale=80',
      color: '#FF6B6B',
    },
    {
      id: '3',
      name: 'Mystic Phoenix',
      description: 'A legendary firebird reborn',
      imageUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=mystic-phoenix&scale=80',
      color: '#FFC857',
    },
    {
      id: '4',
      name: 'Shadow Knight',
      description: 'A mysterious warrior of the night',
      imageUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=shadow-knight&scale=80',
      color: '#1E1B4B',
    },
    {
      id: '5',
      name: 'Ocean Nomad',
      description: 'A wanderer of the seas',
      imageUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ocean-nomad&scale=80',
      color: '#00C29A',
    },
    {
      id: '6',
      name: 'Arctic Wolf',
      description: 'A swift pack hunter',
      imageUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=arctic-wolf&scale=80',
      color: '#4DB6FF',
    },
    {
      id: '7',
      name: 'Forest Elf',
      description: 'A guardian of nature',
      imageUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=forest-elf&scale=80',
      color: '#00C29A',
    },
    {
      id: '8',
      name: 'Cosmic Wizard',
      description: 'A master of arcane arts',
      imageUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=cosmic-wizard&scale=80',
      color: '#7C5CFF',
    },
    {
      id: '9',
      name: 'Golden Lion',
      description: 'A noble king of beasts',
      imageUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=golden-lion&scale=80',
      color: '#FFC857',
    },
    {
      id: '10',
      name: 'Storm Guardian',
      description: 'A protector of the skies',
      imageUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=storm-guardian&scale=80',
      color: '#4DB6FF',
    },
    {
      id: '11',
      name: 'Crimson Rogue',
      description: 'A cunning trickster',
      imageUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=crimson-rogue&scale=80',
      color: '#FF6B6B',
    },
    {
      id: '12',
      name: 'Sage Owl',
      description: 'An ancient keeper of wisdom',
      imageUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=sage-owl&scale=80',
      color: '#1E1B4B',
    },
  ];

  useEffect(() => {
    // TODO: Replace with API call when endpoint is ready
    // fetch('/api/anonymous-avatars')
    //   .then(r => r.json())
    //   .then(data => {
    //     setAvatars(data);
    //     setLoading(false);
    //   })
    //   .catch(e => {
    //     setError(e.message);
    //     setLoading(false);
    //   });

    // Using mock data for now
    setAvatars(MOCK_AVATARS);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">Loading avatars...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Choose an Anonymous Identity</h3>
        <p className="text-xs text-gray-500">
          {value ? '✓ Selected' : 'Select one'}
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-2 gap-3">
        {avatars.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => onChange(avatar.id)}
            disabled={disabled}
            className={`p-3 rounded-lg transition-all border-2 group ${value === avatar.id
              ? 'border-[#7C5CFF] bg-[#7C5CFF]/5'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="relative mb-2 overflow-hidden rounded bg-gray-100">
              <img
                src={avatar.imageUrl}
                alt={avatar.name}
                className="w-full h-auto object-cover aspect-square group-hover:scale-105 transition-transform"
              />
            </div>
            <p className="font-semibold text-xs text-gray-900 text-center truncate">
              {avatar.name}
            </p>
            <p className="text-[11px] text-gray-500 text-center truncate">
              {avatar.description}
            </p>
          </button>
        ))}
      </div>

      {value && (
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-900">
            ✓ Your anonymous identity is set. It will be shown instead of your name.
          </p>
        </div>
      )}
    </div>
  );
}
