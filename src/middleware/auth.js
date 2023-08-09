const jwt = require('jsonwebtoken');

// Define a middleware function to check for a valid JWT
exports.checkJwt = (req, res, next) => {
    // Get the JWT from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No authorization header provided' });
    }
    const token = authHeader.split(' ')[1];

    // Verify the JWT using the secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        next();
    });
}


exports.checkRole = role => {
    return (req, res, next) => {
        // Get the token from the request header
        const token = req.headers.authorization?.split(' ')[1];
    
        // If there is no token, return an error
        if (!token) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
    
        try {
          // Verify the token and decode the payload
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
          // Check if the user has the required role
          if (decoded.role !== role) {
            return res.status(403).json({ error: 'Forbidden' });
          }
    
          req.email = decoded.email
          
          // Call the next middleware function if the user has the required role
          next();
        } catch (error) {
          // Return an error if the token is invalid
          return res.status(401).json({ error: 'Unauthorized' });
        }
      };
}

