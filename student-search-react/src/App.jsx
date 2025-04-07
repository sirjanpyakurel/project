import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { Container, Typography, Grid, Box, Alert, Stack, Button, CircularProgress } from '@mui/material';
import StudentCard from './components/StudentCard';
import StudentDetail from './components/StudentDetail';
import SearchFilters from './components/SearchFilters';

// Student List Component
const StudentList = ({ 
  students, 
  filteredStudents, 
  majors, 
  skills, 
  error, 
  loading, 
  filters, 
  onFilterChange, 
  page, 
  pageCount, 
  onNextPage, 
  onPrevPage 
}) => {
  const itemsPerPage = 9;
  const displayedStudents = filteredStudents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
      <SearchFilters
        filters={filters}
        onFilterChange={onFilterChange}
        majors={majors}
        skills={skills}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">
              Found {filteredStudents.length} students
            </Typography>
            <Typography variant="subtitle1">
              Page {page} of {pageCount || 1}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {displayedStudents.map(student => (
              <Grid item xs={12} sm={6} md={4} key={student.id}>
                <StudentCard student={student} />
              </Grid>
            ))}
          </Grid>

          {filteredStudents.length > 0 && (
            <Stack 
              direction="row" 
              spacing={2} 
              justifyContent="center" 
              sx={{ mt: 4 }}
            >
              <Button
                variant="contained"
                onClick={onPrevPage}
                disabled={page === 1}
                sx={{ minWidth: '100px' }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                onClick={onNextPage}
                disabled={page === pageCount}
                sx={{ minWidth: '100px' }}
              >
                Next
              </Button>
            </Stack>
          )}
        </>
      )}
    </>
  );
};

// Student Detail Page Component
const StudentDetailPage = ({ students }) => {
  const { id } = useParams();
  const student = students.find(s => s.id === parseInt(id));
  
  if (!student) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Student not found</Alert>
      </Container>
    );
  }
  
  return <StudentDetail student={student} />;
};

function App() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [majors, setMajors] = useState([]);
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    searchTerm: '',
    major: 'all',
    gpa: 'all',
    skills: [],
    graduationYear: 'all',
    sortBy: 'name'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3000/students');
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      
      // Validate the data structure
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }

      setStudents(data);
      
      // Extract unique majors and skills
      const uniqueMajors = [...new Set(data.map(student => student.education?.major).filter(Boolean))].sort();
      const uniqueSkills = [...new Set(data.flatMap(student => student.skills || []))].sort();
      
      setMajors(uniqueMajors);
      setSkills(uniqueSkills);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterStudents();
  }, [students, filters]);

  const filterStudents = () => {
    let filtered = students.filter(student => {
      if (!student || !student.education) return false;

      const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
      const searchTerm = filters.searchTerm.toLowerCase();
      
      const searchMatch = filters.searchTerm === '' ||
        fullName.includes(searchTerm) ||
        student.education.university.toLowerCase().includes(searchTerm) ||
        (student.skills || []).some(skill => skill.toLowerCase().includes(searchTerm));

      const majorMatch = filters.major === 'all' || student.education.major === filters.major;

      const gpaMatch = filters.gpa === 'all' ||
        (filters.gpa === '3.5+' && student.education.gpa >= 3.5) ||
        (filters.gpa === '3.0-3.49' && student.education.gpa >= 3.0 && student.education.gpa < 3.5) ||
        (filters.gpa === 'below3.0' && student.education.gpa < 3.0);

      const skillsMatch = filters.skills.length === 0 ||
        filters.skills.every(skill => (student.skills || []).includes(skill));

      const graduationYear = new Date(student.education.graduation_date).getFullYear().toString();
      const yearMatch = filters.graduationYear === 'all' || graduationYear === filters.graduationYear;

      return searchMatch && majorMatch && gpaMatch && skillsMatch && yearMatch;
    });

    // Sort students
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
        case 'major':
          return a.education.major.localeCompare(b.education.major);
        case 'gpa':
          return b.education.gpa - a.education.gpa;
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

  const pageCount = Math.ceil(filteredStudents.length / 9);

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
    <Router>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Student Search
        </Typography>

        <Routes>
          <Route 
            path="/" 
            element={
              <StudentList 
                students={students}
                filteredStudents={filteredStudents}
                majors={majors}
                skills={skills}
                error={error}
                loading={loading}
                filters={filters}
                onFilterChange={handleFilterChange}
                page={page}
                pageCount={pageCount}
                onNextPage={handleNextPage}
                onPrevPage={handlePrevPage}
              />
            } 
          />
          <Route 
            path="/student/:id" 
            element={<StudentDetailPage students={students} />} 
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
