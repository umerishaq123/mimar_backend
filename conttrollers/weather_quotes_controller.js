const axios = require('axios');
// Update path as needed




exports.getQuote = async (req, res) => {
  try {
    const zenResponse = await axios.get('https://zenquotes.io/api/random', {
      timeout: 5000
    });
    
    if (zenResponse.data && zenResponse.data[0]) {
      const quoteData = zenResponse.data[0];
      console.log('Successfully retrieved quote from ZenQuotes');
      
      // Generate random tags
      const possibleTags = ['inspiration', 'motivation', 'wisdom', 'life'];
      const randomTags = [possibleTags[Math.floor(Math.random() * possibleTags.length)]];
      
      return res.json({
        success: true,
        source: 'zenquotes.io',
        data: {
          quote: quoteData.q,
          author: quoteData.a,
          tags: randomTags
        }
      });
    }
    
    throw new Error('Invalid response from ZenQuotes');
  } catch (error) {
    console.error('ZenQuotes API error:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to retrieve quote: ${error.message}`
    });
  }
};
// Weather route handler
exports.getWeather = async (req, res) => {
  try {
    // Check if city is in query params or route params
    const city = req.query.city || req.params.city;
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }
    
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );
    
    const weatherData = weatherResponse.data;
    const weatherInfo = {
      city: weatherData.name,
      country: weatherData.sys.country,
      temperature: weatherData.main.temp,
      feels_like: weatherData.main.feels_like,
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      wind_speed: weatherData.wind.speed,
      timestamp: new Date()
    };
    
    res.json(weatherInfo);
  } catch (error) {
    console.error('Weather API error:', error.message);
    
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};

// Quote route handler


