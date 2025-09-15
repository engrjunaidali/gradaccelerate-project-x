import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react';
import axios from 'axios';
import WeatherWidget from '#inertia/components/WeatherWidget';

// Mock axios
const mockAxios = axios as jest.Mocked<typeof axios>;
jest.mock('axios');

// Mock UI components to avoid complex styling and interactions
jest.mock('#inertia/components/ui.js/card', () => ({
  Card: ({ children, className, ...props }: any) => (
    <div data-testid="weather-card" className={className} {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, className, ...props }: any) => (
    <div data-testid="card-header" className={className} {...props}>
      {children}
    </div>
  ),
  CardTitle: ({ children, className, ...props }: any) => (
    <h2 data-testid="card-title" className={className} {...props}>
      {children}
    </h2>
  ),
  CardContent: ({ children, className, ...props }: any) => (
    <div data-testid="card-content" className={className} {...props}>
      {children}
    </div>
  ),
}));

jest.mock('#inertia/components/ui.js/button', () => ({
  Button: ({ children, onClick, title, className, ...props }: any) => (
    <button
      onClick={onClick}
      title={title}
      className={className}
      data-testid={title?.includes('Refresh') ? 'refresh-button' : 'button'}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock icons to avoid complex SVG rendering
jest.mock('lucide-react', () => ({
  MapPin: () => <span data-testid="map-pin-icon">📍</span>,
  Thermometer: () => <span data-testid="thermometer-icon">🌡️</span>,
  Droplets: () => <span data-testid="droplets-icon">💧</span>,
  Wind: () => <span data-testid="wind-icon">💨</span>,
  Loader2: () => <span data-testid="loader-icon">⏳</span>,
  AlertCircle: () => <span data-testid="alert-icon">⚠️</span>,
  RefreshCw: () => <span data-testid="refresh-icon">🔄</span>,
}));

describe('WeatherWidget - API Mocking and Props Tests', () => {

  // Suppress console warnings during tests
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    // Clear all mocks before each test to start fresh
    jest.clearAllMocks();

    // Reset geolocation mock
    delete (global.navigator as any).geolocation;
  });

  afterEach(async () => {
    // Clear all timers and intervals
    jest.clearAllTimers();

    // Reset axios mock completely
    mockAxios.get.mockReset();
    mockAxios.post.mockReset();

    // Wait for any pending async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    // Clean up DOM
    document.body.innerHTML = '';
  });

  /**
   * TEST 1: Basic Rendering with Default Props
   */
  test('should render with default props', () => {
    render(<WeatherWidget />);

    expect(screen.getByTestId('weather-card')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toBeInTheDocument();
    expect(screen.getByText('Weather')).toBeInTheDocument();
  });

  /**
   * TEST 2: Custom className Props
   */
  test('should render correctly with different className props', async () => {
    const testCases = [
      { className: '', description: 'empty className' },
      { className: 'custom-weather-class', description: 'single custom class' },
      { className: 'bg-red-500 p-8 rounded-2xl', description: 'multiple utility classes' },
      { className: 'weather-widget-test shadow-2xl border-4', description: 'complex class combinations' }
    ];

    for (const testCase of testCases) {
      render(<WeatherWidget className={testCase.className} />);

      const cardElement = screen.getByTestId('weather-card');

      // Check that base classes are always present
      expect(cardElement).toHaveClass('bg-gradient-to-br', 'from-blue-500', 'to-blue-600', 'p-6', 'rounded-xl', 'shadow-lg');

      // Check custom className if provided
      if (testCase.className) {
        const classNames = testCase.className.split(' ').filter(cls => cls.length > 0);
        classNames.forEach(className => {
          expect(cardElement).toHaveClass(className);
        });
      }

      // Cleanup for next iteration
      cleanup();
    }
  });

  /**
   * TEST 3: Mock GPS Location Success + Weather API Success
   */
  test('should successfully mock GPS location and weather API calls', async () => {
    const mockWeatherData = {
      temperature: 22,
      condition: 'Clear',
      description: 'clear sky',
      cityName: 'San Francisco',
      country: 'United States',
      humidity: 65,
      windSpeed: 3.5,
      feelsLike: 24,
      icon: '01d',
      timestamp: '2025-09-13T10:00:00Z'
    };

    // Mock successful geolocation
    Object.defineProperty(global, 'navigator', {
      value: {
        geolocation: {
          getCurrentPosition: jest.fn((successCallback) => {
            setTimeout(() => {
              successCallback({
                coords: { latitude: 37.7749, longitude: -122.4194 }
              });
            }, 10);
          }),
        },
      },
      writable: true,
    });

    // Mock successful weather API response
    mockAxios.post.mockResolvedValue({
      data: {
        success: true,
        data: mockWeatherData
      }
    });

    render(<WeatherWidget />);

    // Wait for the API call to be made
    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith('/weather/coordinates', {
        latitude: 37.7749,
        longitude: -122.4194,
      });
    }, { timeout: 3000 });

    // Verify weather data is displayed
    await waitFor(() => {
      expect(screen.getByText('San Francisco, United States')).toBeInTheDocument();
      expect(screen.getByText('22°C')).toBeInTheDocument();
      expect(screen.getByText('clear sky')).toBeInTheDocument();
      expect(screen.getByText('65%')).toBeInTheDocument(); // humidity
      expect(screen.getByText('3.5 m/s')).toBeInTheDocument(); // wind speed
      expect(screen.getByText('24°C')).toBeInTheDocument(); // feels like
      expect(screen.getByText('📍 GPS location')).toBeInTheDocument();
    }, { timeout: 1000 });

    // Verify weather icon
    const weatherIcon = screen.getByAltText('Clear');
    expect(weatherIcon).toHaveAttribute('src', 'https://openweathermap.org/img/wn/01d@2x.png');

    await new Promise(resolve => setTimeout(resolve, 100));
  });

  /**
   * TEST 4: Mock GPS Failed + IP Location Success + Weather API Success
   */
  test('should fallback to IP location when GPS fails and mock IP location API', async () => {
    const mockLocationData = {
      latitude: 40.7128,
      longitude: -74.0060,
      city: 'New York',
      country: 'United States',
      region: 'NY'
    };

    const mockWeatherData = {
      temperature: 18,
      condition: 'Clouds',
      description: 'overcast clouds',
      cityName: 'New York',
      country: 'United States',
      humidity: 78,
      windSpeed: 2.1,
      feelsLike: 16,
      icon: '04d',
      timestamp: '2025-09-13T10:00:00Z'
    };

    // Mock geolocation failure (user denies permission)
    Object.defineProperty(global, 'navigator', {
      value: {
        geolocation: {
          getCurrentPosition: jest.fn((_, errorCallback) => {
            setTimeout(() => {
              errorCallback({ code: 1, message: 'Permission denied' });
            }, 10);
          }),
        },
      },
      writable: true,
    });

    // Mock IP location API success
    mockAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: mockLocationData
      }
    });

    // Mock weather API success
    mockAxios.post.mockResolvedValue({
      data: {
        success: true,
        data: mockWeatherData
      }
    });

    render(<WeatherWidget />);

    // Wait for IP location API call
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith('/weather/location');
    }, { timeout: 3000 });

    // Wait for weather coordinates API call
    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith('/weather/coordinates', {
        latitude: 40.7128,
        longitude: -74.0060,
      });
    }, { timeout: 1000 });

    // Verify weather data is displayed with IP location indicator
    await waitFor(() => {
      expect(screen.getByText('New York, United States')).toBeInTheDocument();
      expect(screen.getByText('18°C')).toBeInTheDocument();
      expect(screen.getByText('overcast clouds')).toBeInTheDocument();
      expect(screen.getByText('🌐 IP location')).toBeInTheDocument();
    }, { timeout: 1000 });

    await new Promise(resolve => setTimeout(resolve, 100));
  });

  /**
   * TEST 5: Mock Different Weather Data Structures
   */
  test('should handle different weather data structures correctly', async () => {
    const weatherDataVariations = [
      {
        name: 'Hot weather',
        data: {
          temperature: 35,
          condition: 'Sunny',
          description: 'blazing sun',
          cityName: 'Phoenix',
          country: 'USA',
          humidity: 25,
          windSpeed: 1.2,
          feelsLike: 38,
          icon: '01d',
          timestamp: '2025-09-13T15:00:00Z'
        }
      },
      {
        name: 'Cold weather',
        data: {
          temperature: -5,
          condition: 'Snow',
          description: 'heavy snow',
          cityName: 'Moscow',
          country: 'Russia',
          humidity: 90,
          windSpeed: 8.5,
          feelsLike: -12,
          icon: '13d',
          timestamp: '2025-09-13T08:00:00Z'
        }
      },
      {
        name: 'Rainy weather',
        data: {
          temperature: 15,
          condition: 'Rain',
          description: 'moderate rain',
          cityName: 'London',
          country: 'UK',
          humidity: 95,
          windSpeed: 4.7,
          feelsLike: 13,
          icon: '10d',
          timestamp: '2025-09-13T12:00:00Z'
        }
      }
    ];

    for (const variation of weatherDataVariations) {
      // Mock successful geolocation
      Object.defineProperty(global, 'navigator', {
        value: {
          geolocation: {
            getCurrentPosition: jest.fn((successCallback) => {
              setTimeout(() => {
                successCallback({
                  coords: { latitude: 51.5074, longitude: -0.1278 }
                });
              }, 10);
            }),
          },
        },
        writable: true,
      });

      // Mock weather API with variation data
      mockAxios.post.mockResolvedValue({
        data: {
          success: true,
          data: variation.data
        }
      });

      render(<WeatherWidget />);

      // Wait for weather data to load
      await waitFor(() => {
        expect(screen.getByText(`${variation.data.cityName}, ${variation.data.country}`)).toBeInTheDocument();
        expect(screen.getByText(`${variation.data.temperature}°C`)).toBeInTheDocument();
        expect(screen.getByText(variation.data.description)).toBeInTheDocument();
        expect(screen.getByText(`${variation.data.humidity}%`)).toBeInTheDocument();
        expect(screen.getByText(`${variation.data.windSpeed.toFixed(1)} m/s`)).toBeInTheDocument();
        expect(screen.getByText(`${variation.data.feelsLike}°C`)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Cleanup for next iteration
      cleanup();
      jest.clearAllMocks();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  });

  /**
   * TEST 6: Mock API Errors and Network Failures
   */
  test('should handle API errors and network failures gracefully', async () => {
    // Mock geolocation success
    Object.defineProperty(global, 'navigator', {
      value: {
        geolocation: {
          getCurrentPosition: jest.fn((successCallback) => {
            setTimeout(() => {
              successCallback({
                coords: { latitude: 51.5074, longitude: -0.1278 }
              });
            }, 10);
          }),
        },
      },
      writable: true,
    });

    // Mock weather API failure
    mockAxios.post.mockRejectedValue({
      response: {
        data: {
          message: 'Weather service temporarily unavailable'
        }
      }
    });

    render(<WeatherWidget />);

    // Wait for error state to appear
    await waitFor(() => {
      expect(screen.getByText('Weather unavailable')).toBeInTheDocument();
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
      expect(screen.getByText('Try again')).toBeInTheDocument();
    }, { timeout: 3000 });

    await new Promise(resolve => setTimeout(resolve, 100));
  });

  /**
   * TEST 7: Mock No Geolocation Support + IP Location Failure
   */
  test('should handle complete location failure gracefully', async () => {
    // Mock no geolocation support
    Object.defineProperty(global, 'navigator', {
      value: {},
      writable: true,
    });

    // Mock IP location API failure
    mockAxios.get.mockRejectedValue(new Error('IP location service failed'));

    render(<WeatherWidget />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Weather unavailable')).toBeInTheDocument();
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    }, { timeout: 3000 });

    await new Promise(resolve => setTimeout(resolve, 100));
  });

  /**
   * TEST 8: Mock Weather Icon Handling
   */
  test('should handle different weather icon scenarios', async () => {
    const iconTestCases = [
      {
        name: 'With icon URL',
        weatherData: {
          temperature: 20,
          condition: 'Clear',
          description: 'clear sky',
          cityName: 'Test City',
          country: 'Test Country',
          humidity: 50,
          windSpeed: 2.0,
          feelsLike: 22,
          icon: '01d',
          timestamp: '2025-09-13T10:00:00Z'
        },
        expectedIconSrc: 'https://openweathermap.org/img/wn/01d@2x.png'
      },
      {
        name: 'Without icon (fallback to emoji)',
        weatherData: {
          temperature: 15,
          condition: 'Clouds',
          description: 'cloudy',
          cityName: 'Test City',
          country: 'Test Country',
          humidity: 70,
          windSpeed: 1.5,
          feelsLike: 14,
          icon: '',
          timestamp: '2025-09-13T10:00:00Z'
        },
        expectedEmojiIcon: '☁️'
      },
      {
        name: 'Unknown condition (default emoji)',
        weatherData: {
          temperature: 25,
          condition: 'UnknownCondition',
          description: 'unknown weather',
          cityName: 'Test City',
          country: 'Test Country',
          humidity: 60,
          windSpeed: 3.0,
          feelsLike: 26,
          icon: '',
          timestamp: '2025-09-13T10:00:00Z'
        },
        expectedEmojiIcon: '🌤️'
      }
    ];

    for (const testCase of iconTestCases) {
      // Mock geolocation
      Object.defineProperty(global, 'navigator', {
        value: {
          geolocation: {
            getCurrentPosition: jest.fn((successCallback) => {
              setTimeout(() => {
                successCallback({
                  coords: { latitude: 51.5074, longitude: -0.1278 }
                });
              }, 10);
            }),
          },
        },
        writable: true,
      });

      mockAxios.post.mockResolvedValue({
        data: {
          success: true,
          data: testCase.weatherData
        }
      });

      render(<WeatherWidget />);

      await waitFor(() => {
        expect(screen.getByText('Test City, Test Country')).toBeInTheDocument();
      }, { timeout: 3000 });

      if (testCase.expectedIconSrc) {
        // Check for img element with correct src
        const iconImg = screen.getByAltText(testCase.weatherData.condition);
        expect(iconImg).toHaveAttribute('src', testCase.expectedIconSrc);
      } else if (testCase.expectedEmojiIcon) {
        // Check for emoji icon in text content
        expect(screen.getByText(testCase.expectedEmojiIcon)).toBeInTheDocument();
      }

      // Cleanup for next iteration
      cleanup();
      jest.clearAllMocks();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  });

  /**
   * TEST 9: Refresh Button Functionality with Mocked APIs
   */
  test('should refresh weather data when refresh button is clicked', async () => {
    const initialWeatherData = {
      temperature: 20,
      condition: 'Clear',
      description: 'clear sky',
      cityName: 'Test City',
      country: 'Test Country',
      humidity: 50,
      windSpeed: 2.0,
      feelsLike: 22,
      icon: '01d',
      timestamp: '2025-09-13T10:00:00Z'
    };

    const refreshedWeatherData = {
      temperature: 25,
      condition: 'Clouds',
      description: 'partly cloudy',
      cityName: 'Test City',
      country: 'Test Country',
      humidity: 65,
      windSpeed: 3.5,
      feelsLike: 27,
      icon: '02d',
      timestamp: '2025-09-13T11:00:00Z'
    };

    // Mock geolocation
    Object.defineProperty(global, 'navigator', {
      value: {
        geolocation: {
          getCurrentPosition: jest.fn((successCallback) => {
            setTimeout(() => {
              successCallback({
                coords: { latitude: 51.5074, longitude: -0.1278 }
              });
            }, 10);
          }),
        },
      },
      writable: true,
    });

    // Mock initial API call
    mockAxios.post.mockResolvedValueOnce({
      data: {
        success: true,
        data: initialWeatherData
      }
    });

    render(<WeatherWidget />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('20°C')).toBeInTheDocument();
      expect(screen.getByText('clear sky')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Mock refresh API call with new data
    mockAxios.post.mockResolvedValueOnce({
      data: {
        success: true,
        data: refreshedWeatherData
      }
    });

    // Click refresh button
    const refreshButton = screen.getByTestId('refresh-button');
    fireEvent.click(refreshButton);

    // Wait for refreshed data
    await waitFor(() => {
      expect(screen.getByText('25°C')).toBeInTheDocument();
      expect(screen.getByText('partly cloudy')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify API was called twice
    expect(mockAxios.post).toHaveBeenCalledTimes(2);

    await new Promise(resolve => setTimeout(resolve, 100));
  });

  /**
   * TEST 10: Loading States with Mocked Delays
   */
  test('should show appropriate loading states during API calls', async () => {
    // Mock geolocation with delay
    Object.defineProperty(global, 'navigator', {
      value: {
        geolocation: {
          getCurrentPosition: jest.fn((successCallback) => {
            setTimeout(() => {
              successCallback({
                coords: { latitude: 51.5074, longitude: -0.1278 }
              });
            }, 100); // Longer delay to test loading state
          }),
        },
      },
      writable: true,
    });

    // Mock weather API with delay
    mockAxios.post.mockImplementation(() =>
      new Promise(resolve =>
        setTimeout(() => resolve({
          data: {
            success: true,
            data: {
              temperature: 20,
              condition: 'Clear',
              description: 'clear sky',
              cityName: 'Test City',
              country: 'Test Country',
              humidity: 50,
              windSpeed: 2.0,
              feelsLike: 22,
              icon: '01d',
              timestamp: '2025-09-13T10:00:00Z'
            }
          }
        }), 100)
      )
    );

    render(<WeatherWidget />);

    // Check initial loading state
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByText('Getting location...')).toBeInTheDocument();

    // Wait a bit and check for weather fetching state
    await waitFor(() => {
      expect(screen.getByText('Fetching weather...')).toBeInTheDocument();
    }, { timeout: 200 });

    // Wait for final success state
    await waitFor(() => {
      expect(screen.getByText('Test City, Test Country')).toBeInTheDocument();
      expect(screen.queryByTestId('loader-icon')).not.toBeInTheDocument();
    }, { timeout: 3000 });

    await new Promise(resolve => setTimeout(resolve, 100));
  });
});
