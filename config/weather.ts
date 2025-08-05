import env from '#start/env'

const weatherConfig = {
  /*
  |--------------------------------------------------------------------------
  | Weather API Configuration
  |--------------------------------------------------------------------------
  |
  | Configuration for weather APIs including OpenWeatherMap and WeatherAPI
  |
  */

  /*
  |--------------------------------------------------------------------------
  | Default Weather API
  |--------------------------------------------------------------------------
  |
  | This option controls the default weather API that will be used by the
  | weather service. You can change this to "openweather" or "weatherapi"
  |
  */
  default: env.get('WEATHER_DEFAULT_API', 'openweather') as 'openweather' | 'weatherapi',

  /*
  |--------------------------------------------------------------------------
  | OpenWeatherMap API Configuration
  |--------------------------------------------------------------------------
  |
  | Configuration for OpenWeatherMap API
  | Get your API key from: https://openweathermap.org/api
  |
  */
  openweather: {
    apiKey: env.get('OPENWEATHER_API_KEY'),
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    geocodingUrl: 'https://api.openweathermap.org/geo/1.0',
    units: 'metric', // metric, imperial, or kelvin
  },

  /*
  |--------------------------------------------------------------------------
  | WeatherAPI Configuration
  |--------------------------------------------------------------------------
  |
  | Configuration for WeatherAPI.com
  | Get your API key from: https://www.weatherapi.com/
  |
  */
  weatherapi: {
    apiKey: env.get('WEATHER_API_KEY'),
    baseUrl: 'https://api.weatherapi.com/v1',
  },

  /*
  |--------------------------------------------------------------------------
  | IP-based Location Service
  |--------------------------------------------------------------------------
  |
  | Configuration for IP-based location detection as fallback
  | when geolocation permission is denied
  |
  */
  ipLocation: {
    apiKey: env.get('IPAPI_KEY'), // Optional - some services are free without key
    baseUrl: 'http://ip-api.com/json', // Free service, no key required
  },

  /*
  |--------------------------------------------------------------------------
  | Cache Configuration
  |--------------------------------------------------------------------------
  |
  | Weather data cache configuration to reduce API calls
  |
  */
  cache: {
    enabled: true,
    ttl: 10 * 60 * 1000, // 10 minutes in milliseconds
  },
}

export default weatherConfig
