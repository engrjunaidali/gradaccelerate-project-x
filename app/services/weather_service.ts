import axios from 'axios'
import weatherConfig from '#config/weather'

export interface WeatherData {
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

export interface LocationData {
  latitude: number
  longitude: number
  city: string
  country: string
  region?: string
}

export class WeatherService {
  private cache = new Map<string, { data: WeatherData; timestamp: number }>()

  /**
   * Get IP-based location as fallback when GPS permission is denied
   */
  async getLocationByIP(): Promise<LocationData> {
    try {
      const response = await axios.get(weatherConfig.ipLocation.baseUrl)
      const data = response.data

      if (data.status === 'fail') {
        throw new Error('Failed to get location by IP')
      }

      return {
        latitude: data.lat,
        longitude: data.lon,
        city: data.city,
        country: data.country,
        region: data.regionName,
      }
    } catch (error) {
      console.error('IP location service error:', error)
      // Fallback to a default location (you can change this)
      return {
        latitude: 27.7052,
        longitude: 68.8575,
        city: 'Sukkur',
        country: 'PK',
      }
    }
  }

  /**
   * Get weather data using OpenWeatherMap API
   */
  async getWeatherFromOpenWeather(lat: number, lon: number): Promise<WeatherData> {
    const { apiKey, baseUrl, units } = weatherConfig.openweather

    if (!apiKey) {
      throw new Error('OpenWeatherMap API key is not configured')
    }

    const response = await axios.get(`${baseUrl}/weather`, {
      params: {
        lat,
        lon,
        appid: apiKey,
        units,
      },
    })

    const data = response.data

    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      cityName: data.name,
      country: data.sys.country,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      feelsLike: Math.round(data.main.feels_like),
      icon: data.weather[0].icon,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Get weather data using WeatherAPI
   */
  async getWeatherFromWeatherAPI(lat: number, lon: number): Promise<WeatherData> {
    const { apiKey, baseUrl } = weatherConfig.weatherapi

    if (!apiKey) {
      throw new Error('WeatherAPI key is not configured')
    }

    const response = await axios.get(`${baseUrl}/current.json`, {
      params: {
        key: apiKey,
        q: `${lat},${lon}`,
        aqi: 'no',
      },
    })

    const data = response.data

    return {
      temperature: Math.round(data.current.temp_c),
      condition: data.current.condition.text,
      description: data.current.condition.text,
      cityName: data.location.name,
      country: data.location.country,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph / 3.6, // Convert km/h to m/s
      feelsLike: Math.round(data.current.feelslike_c),
      icon: data.current.condition.icon.split('/').pop() || '', // Extract icon code
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Get cached weather data if available and not expired
   */
  private getCachedWeather(cacheKey: string): WeatherData | null {
    if (!weatherConfig.cache.enabled) {
      return null
    }

    const cached = this.cache.get(cacheKey)
    if (!cached) {
      return null
    }

    const isExpired = Date.now() - cached.timestamp > weatherConfig.cache.ttl
    if (isExpired) {
      this.cache.delete(cacheKey)
      return null
    }

    return cached.data
  }

  /**
   * Cache weather data
   */
  private setCachedWeather(cacheKey: string, data: WeatherData): void {
    if (!weatherConfig.cache.enabled) {
      return
    }

    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    })
  }

  /**
   * Get weather data for coordinates with caching
   */
  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    const cacheKey = `weather_${lat}_${lon}`

    // Check cache first
    const cachedData = this.getCachedWeather(cacheKey)
    if (cachedData) {
      return cachedData
    }

    let weatherData: WeatherData

    try {
      // Try primary API based on configuration
      if (weatherConfig.default === 'openweather') {
        weatherData = await this.getWeatherFromOpenWeather(lat, lon)
      } else {
        weatherData = await this.getWeatherFromWeatherAPI(lat, lon)
      }
    } catch (error) {
      console.error('Primary weather API failed:', error)

      // Try fallback API
      try {
        if (weatherConfig.default === 'openweather') {
          weatherData = await this.getWeatherFromWeatherAPI(lat, lon)
        } else {
          weatherData = await this.getWeatherFromOpenWeather(lat, lon)
        }
      } catch (fallbackError) {
        console.error('Fallback weather API also failed:', fallbackError)
        throw new Error('Both weather APIs are unavailable')
      }
    }

    // Cache the result
    this.setCachedWeather(cacheKey, weatherData)

    return weatherData
  }

  /**
   * Get weather data by city name
   */
  async getWeatherByCity(cityName: string): Promise<WeatherData> {
    // First get coordinates for the city
    const coordinates = await this.getCoordinatesByCity(cityName)
    return this.getWeatherByCoordinates(coordinates.latitude, coordinates.longitude)
  }

  /**
   * Get coordinates by city name using OpenWeatherMap Geocoding API
   */
  async getCoordinatesByCity(cityName: string): Promise<LocationData> {
    const { apiKey, geocodingUrl } = weatherConfig.openweather

    if (!apiKey) {
      throw new Error('OpenWeatherMap API key is required for geocoding')
    }

    const response = await axios.get(`${geocodingUrl}/direct`, {
      params: {
        q: cityName,
        limit: 1,
        appid: apiKey,
      },
    })

    const data = response.data
    if (!data || data.length === 0) {
      throw new Error(`City "${cityName}" not found`)
    }

    const location = data[0]
    return {
      latitude: location.lat,
      longitude: location.lon,
      city: location.name,
      country: location.country,
    }
  }
}

export default new WeatherService()
