import Lead from '../models/LeadModel.js';


export const createLead = async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      userId: req.user?.id 
    };

    const lead = new Lead(leadData);
    const savedLead = await lead.save();
    
    res.status(201).json({
      success: true,
      data: savedLead
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


export const getLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
   
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = buildFilter(req.query);

  
    const total = await Lead.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    
    const leads = await Lead.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      data: leads,
        page,
        limit,
        total,
        totalPages
      
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const buildFilter = (query) => {
  const filter = {};

  // String field filters
  if (query.email) filter.email = { $regex: query.email, $options: 'i' };
  if (query.company) filter.company = { $regex: query.company, $options: 'i' };
  if (query.city) filter.city = { $regex: query.city, $options: 'i' };
  if (query.first_name) filter.first_name = { $regex: query.first_name, $options: 'i' };
  if (query.last_name) filter.last_name = { $regex: query.last_name, $options: 'i' };

  // Enum field filters
  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;

  // Number field filters
  if (query.score) {
    if (query.score_operator === 'gt') {
      filter.score = { $gt: parseInt(query.score) };
    } else if (query.score_operator === 'lt') {
      filter.score = { $lt: parseInt(query.score) };
    } else if (query.score_operator === 'between' && query.score_max) {
      filter.score = { 
        $gte: parseInt(query.score), 
        $lte: parseInt(query.score_max) 
      };
    } else {
      filter.score = parseInt(query.score);
    }
  }

  if (query.lead_value) {
    if (query.lead_value_operator === 'gt') {
      filter.lead_value = { $gt: parseFloat(query.lead_value) };
    } else if (query.lead_value_operator === 'lt') {
      filter.lead_value = { $lt: parseFloat(query.lead_value) };
    } else if (query.lead_value_operator === 'between' && query.lead_value_max) {
      filter.lead_value = { 
        $gte: parseFloat(query.lead_value), 
        $lte: parseFloat(query.lead_value_max) 
      };
    } else {
      filter.lead_value = parseFloat(query.lead_value);
    }
  }


  if (query.created_at) {
    if (query.created_at_operator === 'before') {
      filter.created_at = { $lt: new Date(query.created_at) };
    } else if (query.created_at_operator === 'after') {
      filter.created_at = { $gt: new Date(query.created_at) };
    } else if (query.created_at_operator === 'between' && query.created_at_end) {
      filter.created_at = { 
        $gte: new Date(query.created_at), 
        $lte: new Date(query.created_at_end) 
      };
    } else {
  
      const startDate = new Date(query.created_at);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      filter.created_at = { $gte: startDate, $lt: endDate };
    }
  }

  if (query.last_activity_at) {
    if (query.last_activity_at_operator === 'before') {
      filter.last_activity_at = { $lt: new Date(query.last_activity_at) };
    } else if (query.last_activity_at_operator === 'after') {
      filter.last_activity_at = { $gt: new Date(query.last_activity_at) };
    } else if (query.last_activity_at_operator === 'between' && query.last_activity_at_end) {
      filter.last_activity_at = { 
        $gte: new Date(query.last_activity_at), 
        $lte: new Date(query.last_activity_at_end) 
      };
    } else {

      const startDate = new Date(query.last_activity_at);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      filter.last_activity_at = { $gte: startDate, $lt: endDate };
    }
  }


  if (query.is_qualified !== undefined) {
    filter.is_qualified = query.is_qualified === 'true';
  }

  return filter;
};
