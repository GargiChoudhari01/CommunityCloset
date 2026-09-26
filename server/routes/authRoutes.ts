import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/register', (req, res) => {
  const { name, email, password, locationAddress } = req.body;
  const newUser = {
    id: `u-${Date.now()}`,
    name: name || 'Katraj Resident',
    email,
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    locationAddress: locationAddress || 'Katraj, Pune, Maharashtra',
    lat: 18.4575,
    lng: 73.8508,
    ecoPoints: 100,
    co2SavedKg: 0,
    verified: true,
    status: 'active',
    ratingAvg: 5.0,
    reviewsCount: 0,
    itemsSharedCount: 0,
    itemsBorrowedCount: 0,
    createdAt: new Date().toISOString()
  };

  res.json({
    success: true,
    token: `token_${newUser.id}_${Date.now()}`,
    user: newUser
  });
});

authRouter.post('/login', (req, res) => {
  const { email } = req.body;
  res.json({
    success: true,
    token: `token_${Date.now()}`,
    user: {
      id: 'u1',
      name: 'Aarav Sharma',
      email: email || 'aarav.katraj@gmail.com',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      locationAddress: 'Near Rajiv Gandhi Zoological Park, Katraj, Pune',
      lat: 18.4582,
      lng: 73.8512,
      ecoPoints: 420,
      co2SavedKg: 38.5,
      verified: true,
      status: 'active',
      ratingAvg: 4.9,
      reviewsCount: 12,
      itemsSharedCount: 5,
      itemsBorrowedCount: 3,
      createdAt: '2026-01-15T10:00:00.000Z'
    }
  });
});

authRouter.post('/google', (req, res) => {
  res.json({
    success: true,
    token: `token_google_${Date.now()}`,
    user: {
      id: 'u-google-101',
      name: 'Google Community User',
      email: 'user.google@gmail.com',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      locationAddress: 'Katraj Zoo Circle, Pune',
      lat: 18.4582,
      lng: 73.8512,
      ecoPoints: 250,
      co2SavedKg: 15,
      verified: true,
      status: 'active',
      ratingAvg: 5.0,
      reviewsCount: 4,
      itemsSharedCount: 2,
      itemsBorrowedCount: 1,
      createdAt: new Date().toISOString()
    }
  });
});

authRouter.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  res.json({
    success: true,
    message: `Password reset link sent to ${email}.`
  });
});

authRouter.get('/me', (req, res) => {
  res.json({
    success: true,
    user: {
      id: 'u1',
      name: 'Aarav Sharma',
      email: 'aarav.katraj@gmail.com',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      locationAddress: 'Near Rajiv Gandhi Zoological Park, Katraj, Pune',
      lat: 18.4582,
      lng: 73.8512,
      ecoPoints: 420,
      co2SavedKg: 38.5,
      verified: true,
      status: 'active',
      ratingAvg: 4.9,
      reviewsCount: 12,
      itemsSharedCount: 5,
      itemsBorrowedCount: 3,
      createdAt: '2026-01-15T10:00:00.000Z'
    }
  });
});
