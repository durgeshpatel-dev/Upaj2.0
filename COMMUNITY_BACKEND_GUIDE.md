#Real
# Community Page Backend Implementation Guide

## Overview
This document outlines the backend implementation requirements for the Community page features including market prices, news updates, and community posts.

## Features to Implement

### 1. Market Prices API

#### Frontend Component: `MarketPrices.jsx`
- **Location-based pricing**: Shows crop prices based on selected location
- **Real-time updates**: Should refresh prices periodically
- **Currency conversion**: Handle different currencies (USD, INR, GBP, etc.)

#### Backend Requirements

**API Endpoint**: `GET /api/market-prices`

**Request Parameters**:
```javascript
{
  location: "New York", // City/State name
  crops: ["wheat", "corn", "soybeans"] // Optional: specific crops to fetch
}
```

**Response Format**:
```javascript
{
  success: true,
  data: {
    location: "New York",
    currency: "USD",
    lastUpdated: "2025-09-08T10:30:00Z",
    prices: {
      wheat: {
        price: 6.50,
        change: 0.15, // Price change from previous day
        changePercent: 2.36,
        unit: "bushel"
      },
      corn: {
        price: 4.20,
        change: -0.08,
        changePercent: -1.87,
        unit: "bushel"
      },
      soybeans: {
        price: 13.00,
        change: 0.25,
        changePercent: 1.96,
        unit: "bushel"
      }
    }
  }
}
```

**Implementation Steps**:
1. **Data Sources**: Integrate with agricultural market APIs (e.g., USDA, CME Group, local commodity exchanges)
2. **Caching**: Implement Redis caching for price data (update every 15-30 minutes)
3. **Location Mapping**: Create mapping between user locations and nearest market hubs
4. **Currency Conversion**: Use exchange rate APIs for multi-currency support

### 2. News Updates API

#### Frontend Component: `NewsUpdates.jsx`
- **Location-based news**: Filter news by geographic region
- **Crop-specific filtering**: Show news related to specific crops
- **Real-time updates**: Latest agricultural news and updates

#### Backend Requirements

**API Endpoint**: `GET /api/news`

**Request Parameters**:
```javascript
{
  location: "New York", // Optional: filter by location
  crop: "wheat", // Optional: filter by crop type
  limit: 20, // Number of articles to return
  offset: 0 // For pagination
}
```

**Response Format**:
```javascript
{
  success: true,
  data: {
    total: 45,
    articles: [
      {
        id: "news_123",
        title: "Wheat Prices Surge Due to Weather Concerns",
        summary: "Recent weather patterns have caused concerns about wheat production...",
        content: "Full article content...",
        author: "AgriNews Staff",
        source: "AgriNews",
        publishedAt: "2025-09-08T09:15:00Z",
        location: "New York",
        crop: "wheat",
        tags: ["wheat", "weather", "prices"],
        imageUrl: "https://example.com/image.jpg",
        url: "https://example.com/article"
      }
    ]
  }
}
```

**Implementation Steps**:
1. **News Aggregation**: Integrate with agricultural news APIs and RSS feeds
2. **Content Processing**: Use NLP to categorize articles by crop and location
3. **Image Processing**: Generate thumbnails for articles
4. **Caching**: Cache news articles for 1-2 hours
5. **Search**: Implement full-text search functionality

<!-- ### 3. Community Posts API

#### Frontend Features:
- **Post creation**: Allow users to create new posts
- **Like/Comment system**: Social interaction features
- **Crop filtering**: Filter posts by crop type
- **Real-time updates**: Live feed of new posts

#### Backend Requirements

**API Endpoints**:

**Get Posts**: `GET /api/community/posts`
```javascript
// Request
{
  crop: "wheat", // Optional filter
  limit: 20,
  offset: 0
}

// Response
{
  success: true,
  data: {
    posts: [
      {
        id: "post_123",
        author: {
          id: "user_456",
          name: "John Farmer",
          avatar: "https://example.com/avatar.jpg"
        },
        title: "Tips for Organic Wheat Farming",
        content: "Sharing my experience with organic wheat cultivation...",
        crop: "wheat",
        location: "California, USA",
        createdAt: "2025-09-08T08:30:00Z",
        likes: 24,
        comments: 8,
        images: ["https://example.com/image1.jpg"],
        tags: ["organic", "wheat", "farming"]
      }
    ],
    total: 156
  }
}
```

**Create Post**: `POST /api/community/posts`
```javascript
// Request
{
  title: "Tips for Organic Wheat Farming",
  content: "Sharing my experience...",
  crop: "wheat",
  images: [], // Array of image files
  tags: ["organic", "wheat"]
}

// Response
{
  success: true,
  data: {
    post: { /* Created post object */ }
  }
}
```

**Like Post**: `POST /api/community/posts/{postId}/like`

**Add Comment**: `POST /api/community/posts/{postId}/comments`
```javascript
// Request
{
  content: "Great tips! Thanks for sharing."
}
```

## Database Schema

### Market Prices Table
```sql
CREATE TABLE market_prices (
  id SERIAL PRIMARY KEY,
  location VARCHAR(100) NOT NULL,
  crop VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  unit VARCHAR(20) DEFAULT 'bushel',
  change_amount DECIMAL(8,2),
  change_percent DECIMAL(5,2),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(100),
  UNIQUE(location, crop)
);
```

### News Articles Table
```sql
CREATE TABLE news_articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  content TEXT,
  author VARCHAR(100),
  source VARCHAR(100) NOT NULL,
  published_at TIMESTAMP NOT NULL,
  location VARCHAR(100),
  crop VARCHAR(50),
  tags JSONB,
  image_url VARCHAR(500),
  url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Community Posts Table
```sql
CREATE TABLE community_posts (
  id SERIAL PRIMARY KEY,
  author_id INTEGER REFERENCES users(id),
  title VARCHAR(300) NOT NULL,
  content TEXT NOT NULL,
  crop VARCHAR(50),
  location VARCHAR(100),
  images JSONB,
  tags JSONB,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post_likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES community_posts(id),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);

CREATE TABLE post_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES community_posts(id),
  user_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Implementation Priority

### Phase 1: Core Features
1. ✅ Community posts (frontend with dummy data)
2. ⏳ Market prices API integration
3. ⏳ News updates API integration

### Phase 2: Advanced Features
1. Real-time notifications
2. Image upload for posts
3. Advanced search and filtering
4. User following system

### Phase 3: Analytics
1. Post engagement metrics
2. Market price trends
3. User activity analytics -->

## Security Considerations

1. **Input Validation**: Sanitize all user inputs
2. **Rate Limiting**: Implement rate limits for API calls
3. **Authentication**: Require authentication for posting
4. **Content Moderation**: Implement moderation for community posts
5. **Image Processing**: Secure file upload handling

## Performance Optimization

1. **Database Indexing**: Index frequently queried columns
2. **Caching**: Use Redis for frequently accessed data
3. **CDN**: Use CDN for static assets and images
4. **Pagination**: Implement efficient pagination for large datasets
5. **Background Jobs**: Use background jobs for heavy processing tasks

## Monitoring and Maintenance

1. **Logging**: Implement comprehensive logging
2. **Error Handling**: Proper error handling and user feedback
3. **Backup**: Regular database backups
4. **Performance Monitoring**: Monitor API response times
5. **Data Cleanup**: Regular cleanup of old data
