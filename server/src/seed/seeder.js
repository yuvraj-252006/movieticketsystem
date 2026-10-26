const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');
const { movies } = require('./seedData');
const { generateCinemaSeats } = require('../controllers/showtimeController');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/imovies');
    console.log(' Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Movie.deleteMany();
    await Showtime.deleteMany();
    await Booking.deleteMany();
    console.log(' Cleared previous collections.');

    // Create Admin and Demo User
    const adminUser = await User.create({
      name: 'Admin Manager',
      email: 'admin@imovies.com',
      password: 'password123',
      role: 'admin',
    });

    const demoUser = await User.create({
      name: 'John MovieGoer',
      email: 'user@imovies.com',
      password: 'password123',
      role: 'user',
    });
    console.log('👤 Created demo users:');
    console.log('   - Admin: admin@imovies.com / password123');
    console.log('   - User:  user@imovies.com / password123');

    // Insert Movies
    const createdMovies = await Movie.insertMany(movies);
    console.log(`🎬 Seeded ${createdMovies.length} movies.`);

    // Dates for today and tomorrow
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (d) => d.toISOString().split('T')[0];
    const dates = [formatDate(today), formatDate(tomorrow)];
    const showtimesList = ['10:30 AM', '01:45 PM', '05:15 PM', '08:30 PM'];
    const theaters = ['IMovies IMAX - Audi 1', 'IMovies Dolby Cinema - Audi 2', 'IMovies Gold Class - Audi 3'];

    const showtimesToInsert = [];

    createdMovies.forEach((movie, mIdx) => {
      dates.forEach((dateStr) => {
        // Create 2 showtimes per movie per date
        const time1 = showtimesList[mIdx % 2];
        const time2 = showtimesList[(mIdx % 2) + 2];

        [time1, time2].forEach((time, tIdx) => {
          const theater = theaters[(mIdx + tIdx) % theaters.length];
          const basePrice = theater.includes('Gold') ? 400 : theater.includes('IMAX') ? 350 : 250;
          const seats = generateCinemaSeats(basePrice);

          // Randomly pre-reserve a couple seats for realism
          seats[3].isReserved = true;
          seats[4].isReserved = true;
          seats[12].isReserved = true;

          showtimesToInsert.push({
            movie: movie._id,
            theaterName: theater,
            date: dateStr,
            time,
            ticketPrice: basePrice,
            seats,
          });
        });
      });
    });

    await Showtime.insertMany(showtimesToInsert);
    console.log(`🍿 Seeded ${showtimesToInsert.length} showtimes with interactive seat layouts.`);

    console.log(' Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    process.exit(1);
  }
};

seedDB();
