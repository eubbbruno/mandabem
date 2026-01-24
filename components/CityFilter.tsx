'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { MapPin } from 'lucide-react'

interface CityFilterProps {
  cities: string[]
  selectedCity?: string
}

export function CityFilter({ cities, selectedCity = 'all' }: CityFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCityChange = (city: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (city === 'all') {
      params.delete('city')
    } else {
      params.set('city', city)
    }
    router.push(`/?${params.toString()}`)
  }

  const allCities = ['all', ...cities]

  return (
    <div className="inline-flex flex-wrap gap-3 p-2 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20">
      {allCities.map((city) => {
        const isSelected = city === (selectedCity || 'all')
        const displayName = city === 'all' ? '🌍 Todas' : city

        return (
          <button
            key={city}
            onClick={() => handleCityChange(city)}
            className={`
              px-6 py-3 rounded-xl text-base font-black transition-all
              ${isSelected
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-neon scale-110'
                : 'bg-white/20 text-white border-2 border-white/30 hover:bg-white/30 hover:scale-105'
              }
            `}
          >
            {isSelected && <MapPin className="inline h-4 w-4 mr-2" />}
            {displayName}
          </button>
        )
      })}
    </div>
  )
}
