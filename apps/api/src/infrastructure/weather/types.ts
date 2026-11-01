export type WeatherFetchInput = {
  cityId: string;
  cityName: string;
  latitude: number;
  longitude: number;
};

export type WeatherFetchResult = {
  temperature: number;
  feelsLike: number;
  minTemperature: number;
  maxTemperature: number;
  precipitationProbability: number;
  windSpeed: number;
  humidity: number;
  condition: string;
  forecastAt: Date;
};

export type WeatherClient = {
  name: string;
  fetchCurrent: (input: WeatherFetchInput) => Promise<WeatherFetchResult>;
};
