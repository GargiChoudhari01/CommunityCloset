import { Router } from 'express';

export const requestRouter = Router();

requestRouter.post('/', (req, res) => {
  const { listingId, listingTitle, listingImage, requesterId, requesterName, ownerId, ownerName, type, message, startDate, endDate, depositPaid } = req.body;

  const newRequest = {
    id: `req-${Date.now()}`,
    listingId,
    listingTitle,
    listingImage: listingImage || 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    requesterId,
    requesterName,
    ownerId,
    ownerName,
    type: type || 'borrow',
    status: 'pending',
    message,
    startDate,
    endDate,
    depositPaid: Number(depositPaid) || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    request: newRequest,
    message: 'Borrow/exchange request sent successfully.'
  });
});

requestRouter.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  res.json({
    success: true,
    requestId: id,
    status,
    updatedAt: new Date().toISOString(),
    badgeAwarded: status === 'completed' ? 'reuse_hero' : null
  });
});
