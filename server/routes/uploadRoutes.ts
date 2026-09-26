import { Router } from 'express';
import { StorageService } from '../services/storageService.js';

export const uploadRouter = Router();

uploadRouter.post('/', async (req, res) => {
  try {
    const { imageBase64, fileName, mimeType } = req.body;
    const storageService = StorageService.getInstance();
    
    const imageUrl = await storageService.uploadFile(
      imageBase64 || 'data:image/png;base64,sample',
      fileName || `upload_${Date.now()}.png`,
      mimeType || 'image/png'
    );

    res.json({
      success: true,
      url: imageUrl
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
