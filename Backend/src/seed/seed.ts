// src/seed/seed.ts
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { connectDB, closeDB } from '../Utils/db';
import Category from '../Models/Category';
import BlogEntry from '../Models/BlogEntry';
import User from '../Models/User';
import Comment from '../Models/Comment'; // Ensure Comment model is imported

// Seed-Daten
const users = [
  {
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'admin123'
  },
  {
    username: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123'
  },
  {
    username: 'jane_smith',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: 'password123'
  },
  {
    username: 'soccer_analyst',
    firstName: 'Soccer',
    lastName: 'Analyst',
    email: 'soccer@example.com',
    password: 'password123'
  },
  {
    username: 'football_fan',
    firstName: 'Football',
    lastName: 'Fan',
    email: 'football@example.com',
    password: 'password123'
  }
];

const categories = [
  {
    name: 'Bundesliga',
    description: 'Predictions and analysis for German Bundesliga matches'
  },
  {
    name: 'Champions League',
    description: 'UEFA Champions League match previews and predictions'
  },
  {
    name: 'Premier League',
    description: 'English Premier League predictions and analysis'
  },
  {
    name: 'La Liga',
    description: 'Spanish La Liga match predictions'
  },
  {
    name: 'World Cup',
    description: 'International football tournaments and World Cup predictions'
  }
];

// Beispiel für ein Base64-Bild (sehr kleines Platzhalter-Bild)
const sampleBase64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

// Seed-Funktion
const seedDatabase = async () => {
  try {
    // Verbindung zur Datenbank herstellen
    await connectDB();
    
    // Bestehende Daten löschen
    await User.deleteMany({});
    await Category.deleteMany({});
    await BlogEntry.deleteMany({});
    await Comment.deleteMany({});
    
    console.log('Existing data cleared');
    
    // Benutzer erstellen
    const createdUsers = await Promise.all(
      users.map(async user => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        return User.create({
          ...user,
          password: hashedPassword
        });
      })
    );
    
    console.log(`${createdUsers.length} users created`);
    
    // Kategorien erstellen
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories created`);
    
    // Blog-Einträge erstellen
    const blogEntries = [
      {
        title: 'Bayern München vs. Borussia Dortmund Prediction',
        authors: [createdUsers[0]._id],
        description: 'My prediction for the upcoming Bundesliga clash between Bayern and Dortmund',
        content: 'The Der Klassiker showdown between Bayern Munich and Borussia Dortmund promises fireworks this weekend. After analyzing recent form, I believe Bayern will edge this one 2-1.',
        category: createdCategories[0]._id,
        commentsAllowed: true,
        images: [
          { data: sampleBase64Image, caption: 'Bayern Munich Stadium' },
          { data: sampleBase64Image, caption: 'Dortmund Players' }
        ],
        links: [
          { url: 'https://www.bundesliga.com', title: 'Bundesliga Official Site' }
        ],
        hashtags: ['#DerKlassiker', '#BayernDortmund', '#Bundesliga'],
        predictions: [
          {
            homeTeam: 'Bayern Munich',
            awayTeam: 'Borussia Dortmund',
            predictedScore: '2-1',
            matchDate: new Date('2025-04-20'),
            confidence: 4
          }
        ]
      },
      {
        title: 'Champions League Final Prediction',
        authors: [createdUsers[1]._id],
        description: 'Who will win this year\'s Champions League?',
        content: 'The Champions League final between Real Madrid and Manchester City will be a tactical masterclass. I predict Manchester City will finally claim the trophy with a 2-0 victory.',
        category: createdCategories[1]._id,
        commentsAllowed: true,
        images: [
          { data: sampleBase64Image, caption: 'Champions League Trophy' }
        ],
        links: [
          { url: 'https://www.uefa.com/uefachampionsleague/', title: 'UEFA Champions League' }
        ],
        hashtags: ['#UCL', '#ChampionsLeague', '#Final'],
        predictions: [
          {
            homeTeam: 'Real Madrid',
            awayTeam: 'Manchester City',
            predictedScore: '0-2',
            matchDate: new Date('2025-05-31'),
            confidence: 3
          }
        ]
      },
      {
        title: 'Liverpool\'s Premier League Title Chances',
        authors: [createdUsers[2]._id],
        description: 'Analyzing Liverpool\'s road to the Premier League title',
        content: 'Liverpool has shown incredible form this season. Their pressing game and clinical finishing make them my favorites for the Premier League title. I predict they\'ll finish 4 points clear at the top.',
        category: createdCategories[2]._id,
        commentsAllowed: true,
        images: [
          { data: sampleBase64Image, caption: 'Anfield Stadium' }
        ],
        links: [
          { url: 'https://www.premierleague.com', title: 'Premier League Official Site' }
        ],
        hashtags: ['#Liverpool', '#PremierLeague', '#Title'],
        predictions: [
          {
            homeTeam: 'Liverpool',
            awayTeam: 'Manchester City',
            predictedScore: '2-1',
            matchDate: new Date('2025-05-10'),
            confidence: 5
          }
        ]
      },
      {
        title: 'Barcelona\'s Rebuilding Season in La Liga',
        authors: [createdUsers[3]._id],
        description: 'How Barcelona will perform this season under new management',
        content: 'Barcelona is in a rebuilding phase with their new manager. They have exciting young talents but will struggle against the top teams. I predict they\'ll finish 3rd in La Liga this season.',
        category: createdCategories[3]._id,
        commentsAllowed: true,
        images: [
          { data: sampleBase64Image, caption: 'Camp Nou' },
          { data: sampleBase64Image, caption: 'Barcelona Team' }
        ],
        links: [
          { url: 'https://www.laliga.com', title: 'La Liga Official Site' }
        ],
        hashtags: ['#Barcelona', '#LaLiga', '#Rebuilding'],
        predictions: [
          {
            homeTeam: 'Barcelona',
            awayTeam: 'Real Madrid',
            predictedScore: '1-2',
            matchDate: new Date('2025-04-25'),
            confidence: 3
          }
        ]
      },
      {
        title: 'World Cup 2026 Early Predictions',
        authors: [createdUsers[4]._id],
        description: 'Early look at the favorites for the 2026 World Cup',
        content: 'The 2026 World Cup in North America will be the biggest ever. France, Brazil, and England look like early favorites, but I\'m picking Brazil to win their 6th title.',
        category: createdCategories[4]._id,
        commentsAllowed: true,
        images: [
          { data: sampleBase64Image, caption: 'World Cup Trophy' }
        ],
        links: [
          { url: 'https://www.fifa.com/worldcup/', title: 'FIFA World Cup' }
        ],
        hashtags: ['#WorldCup2026', '#Brazil', '#Predictions'],
        predictions: [
          {
            homeTeam: 'Brazil',
            awayTeam: 'France',
            predictedScore: '3-2',
            matchDate: new Date('2026-07-15'),
            confidence: 4
          }
        ]
      }
    ];
    
    const createdEntries = await BlogEntry.insertMany(blogEntries);
    console.log(`${createdEntries.length} blog entries created`);
    
    // Kommentare erstellen
    const comments = [
      {
        entryId: createdEntries[0]._id,
        author: createdUsers[1]._id,
        content: 'I disagree. I think Dortmund has the edge in midfield and will win 2-1.'
      },
      {
        entryId: createdEntries[0]._id,
        author: createdUsers[2]._id,
        content: 'Great analysis! I think you\'re spot on with the 2-1 prediction.'
      },
      {
        entryId: createdEntries[1]._id,
        author: createdUsers[0]._id,
        content: 'Real Madrid has too much experience in finals. I predict they\'ll win 2-1.'
      },
      {
        entryId: createdEntries[2]._id,
        author: createdUsers[3]._id,
        content: 'Liverpool does look strong, but don\'t count out Manchester City just yet!'
      }
    ];
    
    const createdComments = await Comment.insertMany(comments);
    console.log(`${createdComments.length} comments created`);
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Verbindung zur Datenbank schließen
    await closeDB();
    process.exit(0);
  }
};

// Seed-Funktion ausführen
seedDatabase();