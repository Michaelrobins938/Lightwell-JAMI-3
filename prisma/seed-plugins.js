const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const systemPlugins = [
  {
    name: 'weather_api',
    displayName: 'Weather API',
    description: 'Get current weather information for any location',
    version: '1.0.0',
    author: 'Luna Team',
    icon: '🌤️',
    isEnabled: true,
    isSystem: true,
    config: JSON.stringify({
      apiKey: process.env.WEATHER_API_KEY || 'demo_key',
      baseUrl: 'https://api.openweathermap.org/data/2.5'
    }),
    actions: [
      {
        name: 'get_current_weather',
        displayName: 'Get Current Weather',
        description: 'Get current weather conditions for a location',
        endpoint: 'https://api.openweathermap.org/data/2.5/weather',
        method: 'GET',
        parameters: JSON.stringify({
          q: { type: 'string', description: 'City name or coordinates', required: true },
          units: { type: 'string', description: 'Units (metric, imperial, kelvin)', required: false, default: 'metric' }
        }),
        headers: JSON.stringify({
          'Content-Type': 'application/json'
        }),
        authType: 'api_key'
      },
      {
        name: 'get_weather_forecast',
        displayName: 'Get Weather Forecast',
        description: 'Get 5-day weather forecast for a location',
        endpoint: 'https://api.openweathermap.org/data/2.5/forecast',
        method: 'GET',
        parameters: JSON.stringify({
          q: { type: 'string', description: 'City name or coordinates', required: true },
          units: { type: 'string', description: 'Units (metric, imperial, kelvin)', required: false, default: 'metric' }
        }),
        headers: JSON.stringify({
          'Content-Type': 'application/json'
        }),
        authType: 'api_key'
      }
    ]
  },
  {
    name: 'news_api',
    displayName: 'News API',
    description: 'Get latest news articles from various sources',
    version: '1.0.0',
    author: 'Luna Team',
    icon: '📰',
    isEnabled: true,
    isSystem: true,
    config: JSON.stringify({
      apiKey: process.env.NEWS_API_KEY || 'demo_key',
      baseUrl: 'https://newsapi.org/v2'
    }),
    actions: [
      {
        name: 'get_top_headlines',
        displayName: 'Get Top Headlines',
        description: 'Get top headlines from news sources',
        endpoint: 'https://newsapi.org/v2/top-headlines',
        method: 'GET',
        parameters: JSON.stringify({
          country: { type: 'string', description: 'Country code (e.g., us, gb)', required: false, default: 'us' },
          category: { type: 'string', description: 'News category', required: false },
          q: { type: 'string', description: 'Search query', required: false },
          pageSize: { type: 'number', description: 'Number of articles', required: false, default: 10 }
        }),
        headers: JSON.stringify({
          'Content-Type': 'application/json'
        }),
        authType: 'api_key'
      },
      {
        name: 'search_news',
        displayName: 'Search News',
        description: 'Search for news articles',
        endpoint: 'https://newsapi.org/v2/everything',
        method: 'GET',
        parameters: JSON.stringify({
          q: { type: 'string', description: 'Search query', required: true },
          from: { type: 'string', description: 'Start date (YYYY-MM-DD)', required: false },
          to: { type: 'string', description: 'End date (YYYY-MM-DD)', required: false },
          sortBy: { type: 'string', description: 'Sort by (relevancy, popularity, publishedAt)', required: false, default: 'publishedAt' }
        }),
        headers: JSON.stringify({
          'Content-Type': 'application/json'
        }),
        authType: 'api_key'
      }
    ]
  },
  {
    name: 'calendar_api',
    displayName: 'Calendar API',
    description: 'Manage calendar events and schedules',
    version: '1.0.0',
    author: 'Luna Team',
    icon: '📅',
    isEnabled: true,
    isSystem: true,
    config: JSON.stringify({
      timezone: 'UTC',
      defaultReminder: 15
    }),
    actions: [
      {
        name: 'create_event',
        displayName: 'Create Calendar Event',
        description: 'Create a new calendar event',
        endpoint: '/api/calendar/events',
        method: 'POST',
        parameters: JSON.stringify({
          title: { type: 'string', description: 'Event title', required: true },
          description: { type: 'string', description: 'Event description', required: false },
          startTime: { type: 'string', description: 'Start time (ISO 8601)', required: true },
          endTime: { type: 'string', description: 'End time (ISO 8601)', required: true },
          location: { type: 'string', description: 'Event location', required: false },
          attendees: { type: 'array', description: 'List of attendee emails', required: false }
        }),
        headers: JSON.stringify({
          'Content-Type': 'application/json'
        }),
        authType: 'bearer'
      },
      {
        name: 'get_events',
        displayName: 'Get Calendar Events',
        description: 'Get calendar events for a date range',
        endpoint: '/api/calendar/events',
        method: 'GET',
        parameters: JSON.stringify({
          startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)', required: false },
          endDate: { type: 'string', description: 'End date (YYYY-MM-DD)', required: false },
          limit: { type: 'number', description: 'Maximum number of events', required: false, default: 50 }
        }),
        headers: JSON.stringify({
          'Content-Type': 'application/json'
        }),
        authType: 'bearer'
      }
    ]
  },
  {
    name: 'file_manager',
    displayName: 'File Manager',
    description: 'Manage files and documents',
    version: '1.0.0',
    author: 'Luna Team',
    icon: '📁',
    isEnabled: true,
    isSystem: true,
    config: JSON.stringify({
      maxFileSize: 10485760, // 10MB
      allowedTypes: ['txt', 'pdf', 'doc', 'docx', 'jpg', 'png', 'gif']
    }),
    actions: [
      {
        name: 'upload_file',
        displayName: 'Upload File',
        description: 'Upload a file to storage',
        endpoint: '/api/files/upload',
        method: 'POST',
        parameters: JSON.stringify({
          file: { type: 'file', description: 'File to upload', required: true },
          folder: { type: 'string', description: 'Target folder', required: false, default: 'uploads' },
          description: { type: 'string', description: 'File description', required: false }
        }),
        headers: JSON.stringify({
          'Content-Type': 'multipart/form-data'
        }),
        authType: 'bearer'
      },
      {
        name: 'list_files',
        displayName: 'List Files',
        description: 'List files in a folder',
        endpoint: '/api/files',
        method: 'GET',
        parameters: JSON.stringify({
          folder: { type: 'string', description: 'Folder path', required: false, default: 'uploads' },
          limit: { type: 'number', description: 'Maximum number of files', required: false, default: 50 },
          offset: { type: 'number', description: 'Offset for pagination', required: false, default: 0 }
        }),
        headers: JSON.stringify({
          'Content-Type': 'application/json'
        }),
        authType: 'bearer'
      }
    ]
  }
];

async function main() {
  console.log('🌱 Seeding system plugins...');

  for (const pluginData of systemPlugins) {
    try {
      // Create plugin
      const plugin = await prisma.plugin.upsert({
        where: { name: pluginData.name },
        update: {
          displayName: pluginData.displayName,
          description: pluginData.description,
          version: pluginData.version,
          author: pluginData.author,
          icon: pluginData.icon,
          isEnabled: pluginData.isEnabled,
          isSystem: pluginData.isSystem,
          config: pluginData.config
        },
        create: {
          name: pluginData.name,
          displayName: pluginData.displayName,
          description: pluginData.description,
          version: pluginData.version,
          author: pluginData.author,
          icon: pluginData.icon,
          isEnabled: pluginData.isEnabled,
          isSystem: pluginData.isSystem,
          config: pluginData.config
        }
      });

      console.log(`✅ Created/updated plugin: ${plugin.displayName}`);

      // Create actions for the plugin
      for (const actionData of pluginData.actions) {
        try {
          await prisma.pluginAction.upsert({
            where: {
              pluginId_name: {
                pluginId: plugin.id,
                name: actionData.name
              }
            },
            update: {
              displayName: actionData.displayName,
              description: actionData.description,
              endpoint: actionData.endpoint,
              method: actionData.method,
              parameters: actionData.parameters,
              headers: actionData.headers,
              authType: actionData.authType
            },
            create: {
              pluginId: plugin.id,
              name: actionData.name,
              displayName: actionData.displayName,
              description: actionData.description,
              endpoint: actionData.endpoint,
              method: actionData.method,
              parameters: actionData.parameters,
              headers: actionData.headers,
              authType: actionData.authType
            }
          });
          console.log(`  ✅ Created/updated action: ${actionData.displayName}`);
        } catch (error) {
          console.error(`  ❌ Failed to create action ${actionData.name}:`, error);
        }
      }
    } catch (error) {
      console.error(`❌ Failed to create plugin ${pluginData.name}:`, error);
    }
  }

  console.log('🎉 System plugins seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


