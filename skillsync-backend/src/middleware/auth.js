import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to authenticate JWT token
 * Extracts token from Authorization header and verifies it
 */
export const authenticateToken = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set the user info in the request object
    req.user = decoded;
    
    // Check if user exists in database (optional but adds security)
    const userExists = await User.exists({ _id: decoded.id });
    if (!userExists) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      });
    }
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired', 
        expired: true 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

/**
 * Middleware to check if user has admin role
 * Must be used after authenticateToken
 */
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin privileges required.' 
    });
  }
  next();
};

/**
 * Middleware to check if user has instructor role
 * Must be used after authenticateToken
 */
export const requireInstructor = (req, res, next) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Instructor privileges required.' 
    });
  }
  next();
};

/**
 * Middleware to check if user is the resource owner or has admin privileges
 * @param {Function} getUserIdFromRequest - Function to extract resource owner ID from request
 */
export const requireOwnership = (getUserIdFromRequest) => {
  return async (req, res, next) => {
    try {
      const resourceOwnerId = await getUserIdFromRequest(req);
      
      if (req.user.role === 'admin') {
        // Admins can access any resource
        return next();
      }
      
      if (req.user.id === resourceOwnerId.toString()) {
        // User is the owner of this resource
        return next();
      }
      
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. You do not own this resource.' 
      });
    } catch (error) {
      console.error('Ownership verification error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error verifying resource ownership' 
      });
    }
  };
};
