const axios = require('axios');
// Update path as needed




exports.getQuote = async (req, res) => {
  try {
    
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
    } catch (zenError) {
      console.log(`ZenQuotes API failed: ${zenError.message}`);
      
      // Option 2: Try Quotable.io API
      try {
        const quotableResponse = await axios.get('https://api.quotable.io/random', {
          timeout: 5000
        });
        
        console.log('Successfully retrieved quote from Quotable.io');
        return res.json({
          success: true,
          source: 'quotable.io',
          data: {
            quote: quotableResponse.data.content,
            author: quotableResponse.data.author,
            tags: quotableResponse.data.tags || []
          }
        });
      } catch (quotableError) {
        console.log(`Quotable.io API failed: ${quotableError.message}`);
        
        // Option 3: Try GoQuotes API
        try {
          const goResponse = await axios.get('https://goquotes-api.herokuapp.com/api/v1/random?count=1', {
            timeout: 5000
          });
          
          if (goResponse.data && goResponse.data.quotes && goResponse.data.quotes[0]) {
            const quote = goResponse.data.quotes[0];
            console.log('Successfully retrieved quote from GoQuotes');
            
            return res.json({
              success: true,
              source: 'goquotes-api',
              data: {
                quote: quote.text,
                author: quote.author,
                tags: [quote.tag] || ['inspiration']
              }
            });
          }
          throw new Error('Invalid response from GoQuotes');
        } catch (goError) {
          console.log(`GoQuotes API failed: ${goError.message}`);
          
          // Option 4: Try Forismatic API
          try {
            const forismaticResponse = await axios.get('https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en', {
              timeout: 5000
            });
            
            console.log('Successfully retrieved quote from Forismatic');
            return res.json({
              success: true,
              source: 'forismatic',
              data: {
                quote: forismaticResponse.data.quoteText.trim(),
                author: forismaticResponse.data.quoteAuthor || 'Unknown',
                tags: ['wisdom']
              }
            });
          } catch (forismaticError) {
            console.log(`Forismatic API failed: ${forismaticError.message}`);
            
            // Final fallback - Local quotes
            console.log('All APIs failed, using local quotes');
            
          }
        }
      }
    }
  } catch (error) {
    console.error('Quote service error:', error);
    
    // Ultimate fallback - if everything else fails
    try {
      const fallbackQuote = localQuotes.getRandomQuote();
      return res.json({
        success: true,
        source: 'local (emergency fallback)',
        data: fallbackQuote
      });
    } catch (fallbackError) {
      return res.status(500).json({
        success: false,
        message: `Failed to retrieve quote: ${error.message}`
      });
    }
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


