import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    index: true 
  },

  first_name: String,
  last_name: String,

  email: {
     type: String, 
     unique: true, 
     required: true,
       },

  phone: String,
  company: String,
  city: String,
  state: String,

  source: { 
    type: String,
     enum: ['website','facebook_ads','google_ads','referral','events','other'] 
    },

  status: { 
    type: String, 
    enum: ['new','contacted','qualified','lost','won'], default: 'new'
   },

  score: {
     type: Number,
      min: 0,
       max: 100,
        default: 0
      },

  lead_value: { 
    type: Number,
     default: 0
     },

  last_activity_at: { 
    type: Date,
     default: null
     },

  is_qualified: { 
    type: Boolean,
     default: false
     },

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
