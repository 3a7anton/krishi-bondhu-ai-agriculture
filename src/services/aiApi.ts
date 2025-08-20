import axios from 'axios';
import { env, API_ENDPOINTS } from '../config/env';

const OPENROUTER_API_KEY = env.openRouterApiKey;
const OPENROUTER_BASE_URL = API_ENDPOINTS.openRouter;

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  message: string;
  suggestions?: string[];
}

export interface CropRecommendation {
  crop: string;
  suitability: number;
  reason: string;
  season: string;
  expectedYield: string;
}

export interface MarketInsight {
  crop: string;
  currentPrice: string;
  trend: 'rising' | 'falling' | 'stable';
  recommendation: string;
}

class AIService {
  private apiKey: string;

  constructor() {
    this.apiKey = OPENROUTER_API_KEY;
  }

  private async callAI(messages: AIMessage[], model: string = 'anthropic/claude-3.5-sonnet'): Promise<string> {
    try {
      const response = await axios.post(OPENROUTER_BASE_URL, {
        model,
        messages,
        max_tokens: 1000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://krishibondhu.com',
          'X-Title': 'KrishiBondhu Agricultural Platform',
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling AI API:', error);
      throw new Error('Failed to get AI response');
    }
  }

  async getChatResponse(userMessage: string, context?: string): Promise<AIResponse> {
    const systemPrompt = `You are an agricultural expert AI assistant for KrishiBondhu, a platform connecting farmers, customers, warehouses, and delivery partners in India. 
    Provide helpful, accurate, and practical advice about farming, crop management, market trends, and agricultural best practices. 
    Keep responses concise and actionable. Focus on Indian agricultural context and conditions.
    ${context ? `Context: ${context}` : ''}`;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    try {
      const response = await this.callAI(messages);
      return {
        message: response,
        suggestions: this.extractSuggestions(response)
      };
    } catch (error) {
      return {
        message: 'I apologize, but I am unable to process your request at the moment. Please try again later.',
        suggestions: []
      };
    }
  }

  async getCropRecommendations(
    location: string, 
    season: string, 
    soilType: string, 
    weatherData?: any
  ): Promise<CropRecommendation[]> {
    const weatherInfo = weatherData ? 
      `Current weather: ${weatherData.temperature}°C, ${weatherData.humidity}% humidity, ${weatherData.description}` : '';
    
    const prompt = `As an agricultural expert, recommend the top 5 crops suitable for:
    Location: ${location}
    Season: ${season}
    Soil Type: ${soilType}
    ${weatherInfo}
    
    For each crop, provide:
    1. Crop name
    2. Suitability score (0-100)
    3. Reason for recommendation
    4. Best planting season
    5. Expected yield per acre
    
    Format as JSON array with fields: crop, suitability, reason, season, expectedYield`;

    const messages: AIMessage[] = [
      { role: 'system', content: 'You are an agricultural expert specializing in Indian farming conditions.' },
      { role: 'user', content: prompt }
    ];

    try {
      const response = await this.callAI(messages);
      
      // Try to parse JSON response
      try {
        const jsonMatch = response.match(/\[.*\]/s);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON response, using fallback');
      }

      // Fallback: Generate mock recommendations
      return this.generateMockCropRecommendations(location, season);
    } catch (error) {
      console.error('Error getting crop recommendations:', error);
      return this.generateMockCropRecommendations(location, season);
    }
  }

  async getMarketInsights(crops: string[], location?: string): Promise<MarketInsight[]> {
    const prompt = `Provide current market insights for these crops in India${location ? ` (${location} region)` : ''}:
    ${crops.join(', ')}
    
    For each crop, provide:
    1. Current market price range
    2. Price trend (rising/falling/stable)
    3. Market recommendation
    
    Format as JSON array with fields: crop, currentPrice, trend, recommendation`;

    const messages: AIMessage[] = [
      { role: 'system', content: 'You are a market analyst specializing in Indian agricultural commodities.' },
      { role: 'user', content: prompt }
    ];

    try {
      const response = await this.callAI(messages);
      
      try {
        const jsonMatch = response.match(/\[.*\]/s);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.warn('Failed to parse market insights JSON');
      }

      return this.generateMockMarketInsights(crops);
    } catch (error) {
      console.error('Error getting market insights:', error);
      return this.generateMockMarketInsights(crops);
    }
  }

  async getWarehouseOptimization(
    inventory: any[], 
    capacity: number, 
    weatherData?: any
  ): Promise<{
    recommendations: string[];
    storageOptimization: string[];
    alerts: string[];
  }> {
    const inventoryInfo = inventory.map(item => 
      `${item.name}: ${item.quantity} (expires: ${item.expiryDate || 'N/A'})`
    ).join(', ');

    const weatherInfo = weatherData ? 
      `Weather: ${weatherData.temperature}°C, ${weatherData.humidity}% humidity` : '';

    const prompt = `Analyze this warehouse situation and provide optimization recommendations:
    
    Inventory: ${inventoryInfo}
    Total Capacity: ${capacity} tons
    ${weatherInfo}
    
    Provide:
    1. General recommendations for better storage management
    2. Storage optimization strategies
    3. Any alerts or urgent actions needed
    
    Focus on maximizing efficiency, preventing spoilage, and optimizing space utilization.`;

    const messages: AIMessage[] = [
      { role: 'system', content: 'You are a warehouse management expert specializing in agricultural storage.' },
      { role: 'user', content: prompt }
    ];

    try {
      const response = await this.callAI(messages);
      return this.parseWarehouseRecommendations(response);
    } catch (error) {
      console.error('Error getting warehouse optimization:', error);
      return {
        recommendations: ['Monitor temperature and humidity regularly', 'Implement FIFO inventory rotation'],
        storageOptimization: ['Optimize space utilization', 'Separate products by storage requirements'],
        alerts: ['Check for products nearing expiry']
      };
    }
  }

  async getDeliveryOptimization(
    orders: any[], 
    location: string, 
    weatherData?: any
  ): Promise<{
    routeRecommendations: string[];
    timeOptimization: string[];
    weatherAlerts: string[];
  }> {
    const orderInfo = orders.slice(0, 5).map(order => 
      `Order ${order.id}: ${order.destination} (${order.items} items)`
    ).join(', ');

    const weatherInfo = weatherData ? 
      `Weather: ${weatherData.description}, ${weatherData.temperature}°C` : '';

    const prompt = `Optimize delivery operations for:
    
    Base Location: ${location}
    Orders: ${orderInfo}
    ${weatherInfo}
    
    Provide:
    1. Route optimization recommendations
    2. Time optimization strategies  
    3. Weather-related alerts or precautions
    
    Focus on efficiency, fuel savings, and customer satisfaction.`;

    const messages: AIMessage[] = [
      { role: 'system', content: 'You are a logistics optimization expert for agricultural deliveries.' },
      { role: 'user', content: prompt }
    ];

    try {
      const response = await this.callAI(messages);
      return this.parseDeliveryRecommendations(response);
    } catch (error) {
      console.error('Error getting delivery optimization:', error);
      return {
        routeRecommendations: ['Plan routes to minimize travel time', 'Group nearby deliveries'],
        timeOptimization: ['Start early morning deliveries', 'Avoid peak traffic hours'],
        weatherAlerts: ['Check weather conditions before departure']
      };
    }
  }

  private extractSuggestions(response: string): string[] {
    // Extract bullet points or numbered items as suggestions
    const suggestions = response.match(/^[•\-\*]\s+(.+)|^\d+\.\s+(.+)/gm);
    return suggestions ? suggestions.map(s => s.replace(/^[•\-\*\d\.\s]+/, '').trim()).slice(0, 3) : [];
  }

  private generateMockCropRecommendations(location: string, season: string): CropRecommendation[] {
    const crops = {
      kharif: [
        { crop: 'Rice', suitability: 85, reason: 'High water availability and suitable climate', season: 'Kharif', expectedYield: '4-6 tons/acre' },
        { crop: 'Cotton', suitability: 80, reason: 'Good for warm weather and moderate rainfall', season: 'Kharif', expectedYield: '2-3 tons/acre' },
        { crop: 'Sugarcane', suitability: 75, reason: 'Suitable for tropical climate', season: 'Kharif', expectedYield: '40-50 tons/acre' }
      ],
      rabi: [
        { crop: 'Wheat', suitability: 90, reason: 'Ideal winter crop with good market demand', season: 'Rabi', expectedYield: '3-4 tons/acre' },
        { crop: 'Barley', suitability: 80, reason: 'Drought resistant and suitable for cooler months', season: 'Rabi', expectedYield: '2-3 tons/acre' },
        { crop: 'Mustard', suitability: 75, reason: 'Good oilseed crop for winter season', season: 'Rabi', expectedYield: '1-1.5 tons/acre' }
      ]
    };

    const seasonCrops = crops[season.toLowerCase() as keyof typeof crops] || crops.kharif;
    return seasonCrops.slice(0, 3);
  }

  private generateMockMarketInsights(crops: string[]): MarketInsight[] {
    return crops.slice(0, 3).map(crop => ({
      crop,
              currentPrice: `৳${Math.floor(Math.random() * 50 + 20)}-${Math.floor(Math.random() * 100 + 50)}/kg`,
      trend: ['rising', 'falling', 'stable'][Math.floor(Math.random() * 3)] as 'rising' | 'falling' | 'stable',
      recommendation: 'Monitor market trends closely and plan harvesting timing accordingly'
    }));
  }

  private parseWarehouseRecommendations(response: string): {
    recommendations: string[];
    storageOptimization: string[];
    alerts: string[];
  } {
    // Simple parsing - in real implementation, you might use more sophisticated NLP
    const lines = response.split('\n').filter(line => line.trim());
    
    return {
      recommendations: lines.slice(0, 3).map(line => line.replace(/^[•\-\*\d\.\s]+/, '')),
      storageOptimization: lines.slice(3, 6).map(line => line.replace(/^[•\-\*\d\.\s]+/, '')),
      alerts: lines.slice(6, 9).map(line => line.replace(/^[•\-\*\d\.\s]+/, ''))
    };
  }

  private parseDeliveryRecommendations(response: string): {
    routeRecommendations: string[];
    timeOptimization: string[];
    weatherAlerts: string[];
  } {
    const lines = response.split('\n').filter(line => line.trim());
    
    return {
      routeRecommendations: lines.slice(0, 2).map(line => line.replace(/^[•\-\*\d\.\s]+/, '')),
      timeOptimization: lines.slice(2, 4).map(line => line.replace(/^[•\-\*\d\.\s]+/, '')),
      weatherAlerts: lines.slice(4, 6).map(line => line.replace(/^[•\-\*\d\.\s]+/, ''))
    };
  }
}

export const aiService = new AIService();
export default aiService;