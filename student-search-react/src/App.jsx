import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Alert, Stack, Button } from '@mui/material';
import StudentCard from './components/StudentCard';
import SearchFilters from './components/SearchFilters';

function App() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [majors, setMajors] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    searchTerm: '',
    major: 'all',
    gpa: 'all',
    sortBy: 'name'
  });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:3000/students');
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      setStudents(data);
      const uniqueMajors = [...new Set(data.map(student => student.Major))].sort();
      setMajors(uniqueMajors);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    filterStudents();
  }, [students, filters]);

  const filterStudents = () => {
    let filtered = students.filter(student => {
      const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
      const searchMatch = filters.searchTerm === '' ||
        fullName.includes(filters.searchTerm.toLowerCase()) ||
        student.Major.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        student.University.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const majorMatch = filters.major === 'all' || student.Major === filters.major;

      const gpaMatch = filters.gpa === 'all' ||
        (filters.gpa === '3.5+' && student.GPA >= 3.5) ||
        (filters.gpa === '3.0-3.49' && student.GPA >= 3.0 && student.GPA < 3.5) ||
        (filters.gpa === 'below3.0' && student.GPA < 3.0);

      return searchMatch && majorMatch && gpaMatch;
    });

    // Sort students
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
        case 'major':
          return a.Major.localeCompare(b.Major);
        case 'gpa':
          return b.GPA - a.GPA;
        default:
          return 0;
      }
    });

    setFilteredStudents(filtered);
    setPage(1); // Reset to first page when filters change
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const pageCount = Math.ceil(filteredStudents.length / itemsPerPage);
  const displayedStudents = filteredStudents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleNextPage = () => {
    if (page < pageCount) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Student Search
      </Typography>

      <SearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        majors={majors}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1">
          Found {filteredStudents.length} students
        </Typography>
        <Typography variant="subtitle1">
          Page {page} of {pageCount}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {displayedStudents.map(student => (
          <Grid item xs={12} sm={6} md={4} key={student.id}>
            <StudentCard student={student} />
          </Grid>
        ))}
      </Grid>

      <Stack 
        direction="row" 
        spacing={2} 
        justifyContent="center" 
        sx={{ mt: 4 }}
      >
        <Button
          variant="contained"
          onClick={handlePrevPage}
          disabled={page === 1}
          sx={{ minWidth: '100px' }}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={page === pageCount}
          sx={{ minWidth: '100px' }}
        >
          Next
        </Button>
      </Stack>
    </Container>
  );
}

export default App;
