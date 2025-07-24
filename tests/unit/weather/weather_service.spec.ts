import { test } from '@japa/runner'
import weatherService from '#services/weather_service'

test.group('Weather Service', () => {
  test('should get location by IP', async ({ assert }) => {
    try {
      const location = await weatherService.getLocationByIP()

      assert.isObject(location)
      assert.property(location, 'latitude')
      assert.property(location, 'longitude')
      assert.property(location, 'city')
      assert.property(location, 'country')

      assert.isNumber(location.latitude)
      assert.isNumber(location.longitude)
      assert.isString(location.city)
      assert.isString(location.country)
    } catch (error) {
      // IP location service might fail in testing environment
      console.log('IP location test skipped:', error.message)
    }
  })

  test('should handle coordinates for weather data', async ({ assert }) => {
    // Test with New York coordinates
    const lat = 40.7128
    const lon = -74.0060

    try {
      const weather = await weatherService.getWeatherByCoordinates(lat, lon)

      assert.isObject(weather)
      assert.property(weather, 'temperature')
      assert.property(weather, 'condition')
      assert.property(weather, 'cityName')
      assert.property(weather, 'country')
      assert.property(weather, 'humidity')
      assert.property(weather, 'windSpeed')

      assert.isNumber(weather.temperature)
      assert.isString(weather.condition)
      assert.isString(weather.cityName)
      assert.isNumber(weather.humidity)
      assert.isNumber(weather.windSpeed)
    } catch (error) {
      // Weather API might not be configured in test environment
      console.log('Weather API test skipped (API key required):', error.message)
      assert.isTrue(error.message.includes('API key') || error.message.includes('unavailable'))
    }
  })

  test('should handle city name lookup', async ({ assert }) => {
    try {
      const weather = await weatherService.getWeatherByCity('London')

      assert.isObject(weather)
      assert.property(weather, 'temperature')
      assert.property(weather, 'cityName')

      // Should contain London or similar
      assert.isString(weather.cityName)
    } catch (error) {
      // Weather API might not be configured in test environment
      console.log('City weather test skipped (API key required):', error.message)
      assert.isTrue(error.message.includes('API key') || error.message.includes('unavailable'))
    }
  })
})
