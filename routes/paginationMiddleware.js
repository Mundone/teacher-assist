// paginationMiddleware.js

function paginationMiddleware(req, res, next) {
    // Extract common pagination and sorting query parameters
    const { pageNo, pageSize, sortBy, sortOrder } = req.query;
  
    // Default values if not provided
    const pageNoValid = parseInt(pageNo, 10) || 0;
    const pageSizeValid = parseInt(pageSize, 10) || 10;
    const sortByValid = sortBy || 'id'; // Default to sorting by 'id' or any other default field
    const sortOrderValid = sortOrder === 'desc' ? 'DESC' : 'ASC'; // Default to ascending if sortOrder is not 'desc'
  
    // Attach to request object
    req.pagination = {
      pageNo: pageNoValid,
      pageSize: pageSizeValid,
      sortBy: sortByValid,
      sortOrder: sortOrderValid
    };
  
    next();
  }
  
  module.exports = paginationMiddleware;
  