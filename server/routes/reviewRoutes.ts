import { Router } from 'express';

export const reviewRouter = Router();

reviewRouter.post('/', (req, res) => {
  const { listingId, listingTitle, reviewerId, reviewerName, reviewerAvatar, revieweeId, revieweeName, rating, comment } = req.body;

  const newReview = {
    id: `rev-${Date.now()}`,
    listingId,
    listingTitle: listingTitle || 'Tool / Material',
    reviewerId,
    reviewerName,
    reviewerAvatar,
    revieweeId,
    revieweeName,
    rating: Number(rating) || 5,
    comment,
    createdAt: new Date().toISOString()
  };

  res.json({
    success: true,
    review: newReview,
    updatedRatingAvg: 4.9,
    message: 'Review and 5-star rating submitted successfully.'
  });
});

reviewRouter.get('/user/:userId', (req, res) => {
  res.json({
    success: true,
    reviews: [
      {
        id: 'rev-1',
        listingId: 'item-1',
        listingTitle: 'Bosch Professional Cordless Impact Drill Set',
        reviewerId: 'u2',
        reviewerName: 'Priya Deshmukh',
        reviewerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
        revieweeId: req.params.userId,
        revieweeName: 'Aarav Sharma',
        rating: 5,
        comment: 'Super helpful neighbor in Katraj! Drill came fully charged with all bits.',
        createdAt: '2026-09-18T11:00:00.000Z'
      }
    ]
  });
});
