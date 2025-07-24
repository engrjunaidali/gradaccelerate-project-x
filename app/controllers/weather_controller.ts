import { HttpContext } from '@adonisjs/core/http'
import { asyncHandler } from '../utils/asyncHandler.js'
import weatherService from '#services/weather_service'

export default class WeatherController {
  /**
   * Display weather dashboard
   */
  index = asyncHandler(async ({ inertia, auth }: HttpContext) => {
    const user = auth.user!

    return inertia.render('weather/index', {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    })
  })

  /**
   * Get weather data by coordinates
   */
  getWeatherByCoordinates = asyncHandler(async ({ request, response }: HttpContext) => {
    const { latitude, longitude } = request.only(['latitude', 'longitude'])

    if (!latitude || !longitude) {
      return response.badRequest({
        message: 'Latitude and longitude are required',
        error: 'MISSING_COORDINATES'
      })
    }

    try {
      const weatherData = await weatherService.getWeatherByCoordinates(
        parseFloat(latitude),
        parseFloat(longitude)
      )

      return response.json({
        success: true,
        data: weatherData,
      })
    } catch (error) {
      console.error('Weather API Error:', error)
      return response.status(500).json({
        success: false,
        message: 'Failed to fetch weather data',
        error: error.message,
      })
    }
  })

  /**
   * Get weather data by city name
   */
  getWeatherByCity = asyncHandler(async ({ request, response }: HttpContext) => {
    const { city } = request.only(['city'])

    if (!city) {
      return response.badRequest({
        message: 'City name is required',
        error: 'MISSING_CITY'
      })
    }

    try {
      const weatherData = await weatherService.getWeatherByCity(city)

      return response.json({
        success: true,
        data: weatherData,
      })
    } catch (error) {
      console.error('Weather API Error:', error)
      return response.status(500).json({
        success: false,
        message: 'Failed to fetch weather data',
        error: error.message,
      })
    }
  })

  /**
   * Get user's location using IP address as fallback
   */
  getLocationByIP = asyncHandler(async ({ response }: HttpContext) => {
    try {
      const locationData = await weatherService.getLocationByIP()

      return response.json({
        success: true,
        data: locationData,
      })
    } catch (error) {
      console.error('Location API Error:', error)
      return response.status(500).json({
        success: false,
        message: 'Failed to fetch location data',
        error: error.message,
      })
    }
  })
}
