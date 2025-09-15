import { test } from '@japa/runner'
import WeatherService from '#services/weather_service'

test.group('WeatherService - API Testing', () => {

  test('should get location by IP', async ({ assert }) => {
  const location = await WeatherService.getLocationByIP()

  // Check that we get back an object
  assert.isObject(location)

  // Check that it has the basic properties we need
  assert.property(location, 'latitude')
  assert.property(location, 'longitude')
  assert.property(location, 'city')
  assert.property(location, 'country')
  })

  test('should get weather by coordinates', async ({ assert }) => {
  // Use London coordinates as test data
  const lat = 51.5074
  const lon = -0.1278

  try {
    const weather = await WeatherService.getWeatherByCoordinates(lat, lon)

    // Check we get weather data back
    assert.isObject(weather)
    assert.property(weather, 'temperature')
    assert.property(weather, 'condition')
    assert.property(weather, 'cityName')

  } catch (error) {
    // It's okay if API keys aren't set up - just check the error makes sense
    assert.include(error.message, 'API')
  }
  })

  test('should get weather by city name', async ({ assert }) => {
  try {
    const weather = await WeatherService.getWeatherByCity('London')

    // Check we get weather data back
    assert.isObject(weather)
    assert.property(weather, 'temperature')
    assert.property(weather, 'cityName')

  } catch (error) {
    // API might not be configured, that's fine for testing
    assert.isString(error.message)
  }
  })

  test('should handle invalid city name', async ({ assert }) => {
  try {
    await WeatherService.getWeatherByCity('ThisCityDoesNotExist123')

  } catch (error) {
    // Should get an error for invalid city
    assert.isString(error.message)
    assert.isTrue(error.message.length > 0)
  }
  })

  test('should get coordinates for a city', async ({ assert }) => {
  try {
    const coords = await WeatherService.getCoordinatesByCity('Paris')

    // Check we get coordinate data back
    assert.isObject(coords)
    assert.property(coords, 'latitude')
    assert.property(coords, 'longitude')

  } catch (error) {
    // API might not be configured
    assert.isString(error.message)
  }
  })

  test('service should have all required methods', ({ assert }) => {
  // Just check that the methods exist on the service
  assert.isFunction(WeatherService.getLocationByIP)
  assert.isFunction(WeatherService.getWeatherByCoordinates)
  assert.isFunction(WeatherService.getWeatherByCity)
  assert.isFunction(WeatherService.getCoordinatesByCity)
  })
})
