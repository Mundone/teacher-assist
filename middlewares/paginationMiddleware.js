// paginationMiddleware.js
function paginationMiddleware(req, res, next) {
  // Set default values if the body is not provided or if it is empty
  const defaultPageNo = 0;
  const defaultPerPage = 10;
  const defaultSort = 'createdAt asc';

  const {
    page_no = defaultPageNo,
    per_page = defaultPerPage,
    sort = defaultSort,
    filter = [],
  } = req.body || {}; // Use destructuring with default values

  const pageNoValid = Math.max(parseInt(page_no, 10), 0); // Ensuring page number is not negative
  const pageSizeValid = parseInt(per_page, 10);

  const [sortByValid, sortOrder] = sort.split(' ');
  const sortOrderValid = sortOrder && sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const filtersValid = Array.isArray(filter) ? filter.map(f => ({
    fieldName: f.field_name,
    operation: f.operation,
    value: f.value
  })) : [];

  req.pagination = {
    pageNo: pageNoValid, // The value is now zero-based after the check
    pageSize: pageSizeValid,
    sortBy: sortByValid,
    sortOrder: sortOrderValid,
    filters: filtersValid
  };

  next();
}



  
  module.exports = paginationMiddleware;
  