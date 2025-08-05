import { useState, useEffect } from 'react'
import { MapPin, Thermometer, Droplets, Wind, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import axios from 'axios'

interface WeatherData {
  temperature: number
  condition: string
  description: string
  cityName: string
  country: string
  humidity: number
  windSpeed: number
  feelsLike: number
  icon: string
  timestamp: string
}

interface LocationData {
  latitude: number
  longitude: number
  city: string
  country: string
  region?: string
}

type LocationStatus = 'loading' | 'success' | 'denied' | 'error'
type WeatherStatus = 'idle' | 'loading' | 'success' | 'error'

interface WeatherWidgetProps {
  className?: string
}

export default function WeatherWidget({ className = '' }: WeatherWidgetProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('loading')
  const [weatherStatus, setWeatherStatus] = useState<WeatherStatus>('idle')

  // Get user's location using browser geolocation API
  const getUserLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: '',
            country: '',
          })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      )
    })
  }

  // Get location using IP as fallback
  const getLocationByIP = async (): Promise<LocationData> => {
    try {
      const response = await axios.get('/weather/location')
      if (response.data.success) {
        return response.data.data
      }
      throw new Error('Failed to get IP location')
    } catch (error) {
      throw new Error('IP location service failed')
    }
  }

  // Fetch weather data using coordinates
  const fetchWeatherByCoordinates = async (lat: number, lon: number): Promise<WeatherData> => {
    try {
      const response = await axios.post('/weather/coordinates', {
        latitude: lat,
        longitude: lon,
      })

      if (response.data.success) {
        return response.data.data
      }
      throw new Error(response.data.message || 'Failed to fetch weather data')
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Weather service failed')
    }
  }

  // Main function to load weather data
  const loadWeatherData = async () => {
    setWeatherStatus('loading')

    try {
      setLocationStatus('loading')
      let location: LocationData

      try {
        location = await getUserLocation()
        setLocationStatus('success')
      } catch (gpsError) {
        console.log('GPS location failed, trying IP location:', gpsError)
        setLocationStatus('denied')
        location = await getLocationByIP()
      }

      const weather = await fetchWeatherByCoordinates(location.latitude, location.longitude)
      setWeatherData(weather)
      setWeatherStatus('success')
    } catch (error: any) {
      console.error('Failed to load weather data:', error)
      setWeatherStatus('error')
    }
  }

  // Load weather data on component mount
  useEffect(() => {
    loadWeatherData()
  }, [])

  const getWeatherIcon = (condition: string, icon?: string) => {
    if (icon) {
      return `https://openweathermap.org/img/wn/${icon}@2x.png`
    }

    const iconMap: { [key: string]: string } = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Snow': '❄️',
      'Thunderstorm': '⛈️',
      'Drizzle': '🌦️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Sunny': '☀️',
    }

    return iconMap[condition] || '🌤️'
  }

  return (
    <div className={`bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Thermometer className="w-5 h-5 mr-2" />
          Weather
        </h3>
        {weatherStatus !== 'loading' && (
          <button
            onClick={loadWeatherData}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Refresh weather"
          >
            <RefreshCw className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {weatherStatus === 'loading' && (
        <div className="flex flex-col items-center py-8">
          <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
          <p className="text-white/80 text-sm">
            {locationStatus === 'loading' ? 'Getting location...' : 'Fetching weather...'}
          </p>
          {locationStatus === 'denied' && (
            <p className="text-white/60 text-xs mt-1">Using IP location</p>
          )}
        </div>
      )}

      {weatherStatus === 'error' && (
        <div className="flex flex-col items-center py-8">
          <AlertCircle className="w-8 h-8 text-red-300 mb-2" />
          <p className="text-white text-sm mb-2">Weather unavailable</p>
          <button
            onClick={loadWeatherData}
            className="text-xs text-white/80 hover:text-white underline"
          >
            Try again
          </button>
        </div>
      )}

      {weatherStatus === 'success' && weatherData && (
        <div className="text-white">
          {/* Location */}
          <div className="flex items-center justify-center mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{weatherData.cityName}, {weatherData.country}</span>
          </div>

          {/* Main Weather Display */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="text-center">
              {weatherData.icon ? (
                <img
                  src={getWeatherIcon(weatherData.condition, weatherData.icon)}
                  alt={weatherData.condition}
                  className="w-16 h-16 mx-auto"
                />
              ) : (
                <div className="text-4xl">{getWeatherIcon(weatherData.condition)}</div>
              )}
            </div>

            <div className="text-center">
              <div className="text-3xl font-light">{weatherData.temperature}°C</div>
              <p className="text-sm text-white/80 capitalize">{weatherData.description}</p>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/10 rounded-lg p-2">
              <Droplets className="w-4 h-4 mx-auto mb-1" />
              <p className="text-xs text-white/80">Humidity</p>
              <p className="text-sm font-semibold">{weatherData.humidity}%</p>
            </div>

            <div className="bg-white/10 rounded-lg p-2">
              <Wind className="w-4 h-4 mx-auto mb-1" />
              <p className="text-xs text-white/80">Wind</p>
              <p className="text-sm font-semibold">{weatherData.windSpeed.toFixed(1)} m/s</p>
            </div>

            <div className="bg-white/10 rounded-lg p-2">
              <Thermometer className="w-4 h-4 mx-auto mb-1" />
              <p className="text-xs text-white/80">Feels like</p>
              <p className="text-sm font-semibold">{weatherData.feelsLike}°C</p>
            </div>
          </div>

          {/* Location Status */}
          <div className="mt-3 text-center">
            <p className="text-xs text-white/60">
              {locationStatus === 'success' && '📍 GPS location'}
              {locationStatus === 'denied' && '🌐 IP location'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
