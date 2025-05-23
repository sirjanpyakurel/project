import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import '../styles/SearchFilters.css';

const SearchFilters = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    search: '',
    university: '',
    major: '',
    gpa: '',
    skills: '',
    graduationYear: '',
  });

  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        console.log('Fetching majors from backend...');
        const response = await fetch('http://localhost:3001/majors');
        const data = await response.json();
        console.log('Received majors from backend:', data);
        
        // If no majors were returned, use fallback list
        let majorsList = data;
        if (!data || data.length === 0) {
          console.log('No majors returned from backend, using fallback list');
          majorsList = [
            'Computer Science',
            'Business Administration',
            'Engineering',
            'Mechanical Engineering',
            'Electrical Engineering',
            'Biology',
            'Psychology',
            'Marketing',
            'Finance',
            'Mathematics'
          ];
        }
        
        setMajors(majorsList.sort());
        setLoading(false);
      } catch (err) {
        console.error('Error fetching majors:', err);
        // Use fallback majors list in case of error
        const fallbackMajors = [
          'Computer Science',
          'Business Administration',
          'Engineering',
          'Mechanical Engineering',
          'Electrical Engineering',
          'Biology',
          'Psychology',
          'Marketing',
          'Finance',
          'Mathematics'
        ];
        console.log('Using fallback majors list due to error');
        setMajors(fallbackMajors);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMajors();
  }, []);

  const skillsList = [
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'C++',
    'SQL',
    'AWS',
    'Docker',
    'Machine Learning'
  ];

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    // Format the filter values before passing them
    const formattedFilters = {
      ...filters,
      search: filters.search.trim(),
      university: filters.university.trim(),
      major: filters.major,
      gpa: filters.gpa ? parseFloat(filters.gpa) : '',
      skills: filters.skills,
      graduationYear: filters.graduationYear ? parseInt(filters.graduationYear) : ''
    };
    onApplyFilters(formattedFilters);
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Search by Name"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="University"
            name="university"
            value={filters.university}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Major</InputLabel>
            <Select
              name="major"
              value={filters.major}
              onChange={handleFilterChange}
              label="Major"
              disabled={loading}
            >
              <MenuItem value="">All Majors</MenuItem>
              {majors.map((major) => {
                console.log('Rendering major option:', major);
                return (
                  <MenuItem key={major} value={major}>
                    {major}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Minimum GPA"
            name="gpa"
            type="number"
            value={filters.gpa}
            onChange={handleFilterChange}
            inputProps={{ min: 0, max: 4, step: 0.1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Skills</InputLabel>
            <Select
              name="skills"
              value={filters.skills}
              onChange={handleFilterChange}
              label="Skills"
            >
              <MenuItem value="">All Skills</MenuItem>
              {skillsList.map((skill) => (
                <MenuItem key={skill} value={skill}>
                  {skill}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Graduation Year"
            name="graduationYear"
            type="number"
            value={filters.graduationYear}
            onChange={handleFilterChange}
            inputProps={{ min: 2000, max: 2030 }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApply}
            sx={{ mt: 2 }}
          >
            Apply Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchFilters; 