import express from 'express';
import { farmerRoute, protectRoute } from '../middleware/auth.middleware.js';
import {
  getAllListings,
  getListingById,
  getListingsByFarmer,
  createListing,
  updateListing,
  deleteListing,
} from '../controllers/listing.controller.js';

const router = express.Router();

//Public Access - Browse listings
router.get('/listings/all', getAllListings);
router.get('/listings/:id', getListingById);

//Farmer Access - Manage listings
router.get('/listings/my', protectRoute, farmerRoute, getListingsByFarmer);
router.post('/listing/create', protectRoute, farmerRoute, createListing);
router.put('/listing/update/:id', protectRoute, farmerRoute, updateListing);
router.delete('/listing/delete/:id', protectRoute, farmerRoute, deleteListing);

export default router;