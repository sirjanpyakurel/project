import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Autocomplete, Chip } from '@mui/material';

const SearchFilters = ({ filters, onFilterChange, majors, skills }) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextField
        label="Search Students"
        variant="outlined"
        value={filters.searchTerm}
        onChange={(e) => onFilterChange('searchTerm', e.target.value)}
        sx={{ minWidth: 200 }}
        placeholder="Search by name, university, or skills"
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

      <Autocomplete
        multiple
        options={skills || []}
        value={filters.skills || []}
        onChange={(e, newValue) => onFilterChange('skills', newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Skills"
            variant="outlined"
            placeholder="Select skills"
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip label={option} {...getTagProps({ index })} />
          ))
        }
        sx={{ minWidth: 300 }}
      />

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Graduation Year</InputLabel>
        <Select
          value={filters.graduationYear}
          label="Graduation Year"
          onChange={(e) => onFilterChange('graduationYear', e.target.value)}
        >
          <MenuItem value="all">All Years</MenuItem>
          <MenuItem value="2024">2024</MenuItem>
          <MenuItem value="2025">2025</MenuItem>
          <MenuItem value="2026">2026</MenuItem>
          <MenuItem value="2027">2027</MenuItem>
          <MenuItem value="2028">2028</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SearchFilters; 