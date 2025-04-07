import { Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const SearchFilters = ({ filters, onFilterChange, majors }) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextField
        label="Search Students"
        variant="outlined"
        value={filters.searchTerm}
        onChange={(e) => onFilterChange('searchTerm', e.target.value)}
        sx={{ minWidth: 200 }}
      />

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Major</InputLabel>
        <Select
          value={filters.major}
          label="Major"
          onChange={(e) => onFilterChange('major', e.target.value)}
        >
          <MenuItem value="all">All Majors</MenuItem>
          {majors.map((major) => (
            <MenuItem key={major} value={major}>
              {major}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>GPA</InputLabel>
        <Select
          value={filters.gpa}
          label="GPA"
          onChange={(e) => onFilterChange('gpa', e.target.value)}
        >
          <MenuItem value="all">All GPAs</MenuItem>
          <MenuItem value="3.5+">3.5 and above</MenuItem>
          <MenuItem value="3.0-3.49">3.0 - 3.49</MenuItem>
          <MenuItem value="below3.0">Below 3.0</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={filters.sortBy}
          label="Sort By"
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="major">Major</MenuItem>
          <MenuItem value="gpa">GPA</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SearchFilters; 