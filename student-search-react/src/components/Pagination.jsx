import { Pagination as MuiPagination } from '@mui/material';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <MuiPagination
      count={totalPages}
      page={currentPage}
      onChange={onPageChange}
      color="primary"
      showFirstButton
      showLastButton
    />
  );
};

export default Pagination; 