'use client'

import { useRouter, useSearchParams } from 'next/navigation'

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
    <div className="flex flex-wrap gap-2">
      {allCities.map((city) => {
        const isSelected = city === (selectedCity || 'all')
        const displayName = city === 'all' ? 'Todas as cidades' : city

        return (
          <button
            key={city}
            onClick={() => handleCityChange(city)}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${isSelected
                ? 'bg-neutral-900 text-white'
                : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
              }
            `}
          >
            {displayName}
          </button>
        )
      })}
    </div>
  )
}
