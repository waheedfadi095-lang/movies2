'use client';

import { useState } from 'react';

export interface EmbedServerOption {
  name: string;
  url: string;
}

interface EmbedPlayerProps {
  servers: EmbedServerOption[];
  title: string;
}

export default function EmbedPlayer({ servers, title }: EmbedPlayerProps) {
  const [active, setActive] = useState(0);
  if (!servers?.length) return null;
  const current = servers[active];

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      {/* Server tabs */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-900 border-b border-gray-700">
        {servers.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              i === active
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>
      {/* Player */}
      <div className="relative pt-[56.25%] w-full">
        <iframe
          key={current.url}
          className="absolute top-0 left-0 w-full h-full"
          src={current.url}
          title={title}
          frameBorder="0"
          referrerPolicy="no-referrer"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  );
}
