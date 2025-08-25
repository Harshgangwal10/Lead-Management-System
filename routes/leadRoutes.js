import express from 'express';
import { createLead,  getLeads,  getLead,  updateLead, deleteLead} from '../controllers/leadController.js';
import { authMiddleware } from '../middleware/auth.js';

const Router = express.Router();

// Apply authentication middleware to all routes
Router.use(authMiddleware);


Router.post('/', createLead);          
Router.get('/', getLeads);           
Router.get('/:id', getLead);        
Router.put('/:id', updateLead);       
Router.delete('/:id', deleteLead);     

export default Router;
