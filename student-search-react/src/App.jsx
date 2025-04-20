import { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useParams
} from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress,
  Alert,
  Paper,
  Grid
} from '@mui/material';
import SearchFilters from './components/SearchFilters';
import StudentCard from './components/StudentCard';
import StudentDetail from './components/StudentDetail';
import Pagination from './components/Pagination';
import './styles/App.css';

const StudentDetailPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/students/${id}`);
        if (!response.ok) {
          throw new Error('Student not found');
        }
        const data = await response.json();
        setStudent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return <StudentDetail student={student} />;
};

const StudentList = ({ filteredStudents, currentPage, setCurrentPage, handleApplyFilters }) => {
  const studentsPerPage = 10;
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box>
      <SearchFilters onApplyFilters={handleApplyFilters} />
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {currentStudents.length > 0 ? (
          currentStudents.map((student) => (
            <Grid item xs={12} sm={6} md={4} key={student.id}>
              <StudentCard student={student} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" align="center" color="text.secondary">
              No students found matching your criteria
            </Typography>
          </Grid>
        )}
      </Grid>
      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Box>
      )}
    </Box>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:3001/students');
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
        setCurrentPage(1);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filterStudents = (filters) => {
    console.log('Applying filters:', filters);
    let filtered = [...students];
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      console.log('Filtering by search term:', searchTerm);
      filtered = filtered.filter(student => {
        const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
        console.log('Checking student:', fullName, 'includes:', searchTerm, '?', fullName.includes(searchTerm));
        return fullName.includes(searchTerm);
      });
    }
    
    if (filters.university) {
      const universityTerm = filters.university.toLowerCase();
      console.log('Filtering by university:', universityTerm);
      filtered = filtered.filter(student => {
        const university = student.education?.university?.toLowerCase() || '';
        console.log('Checking university:', university, 'includes:', universityTerm, '?', university.includes(universityTerm));
        return university.includes(universityTerm);
      });
    }
    
    if (filters.major) {
      console.log('Filtering by major:', filters.major);
      filtered = filtered.filter(student => {
        const major = student.education?.major || '';
        console.log('Checking major:', major, '===', filters.major, '?', major === filters.major);
        return major === filters.major;
      });
    }
    
    if (filters.gpa) {
      console.log('Filtering by GPA:', filters.gpa);
      filtered = filtered.filter(student => {
        const gpa = student.education?.gpa || 0;
        console.log('Checking GPA:', gpa, '>=', filters.gpa, '?', gpa >= filters.gpa);
        return gpa >= filters.gpa;
      });
    }
    
    if (filters.skills) {
      console.log('Filtering by skills:', filters.skills);
      filtered = filtered.filter(student => {
        const hasSkill = student.skills?.includes(filters.skills) || false;
        console.log('Checking skills:', student.skills, 'includes:', filters.skills, '?', hasSkill);
        return hasSkill;
      });
    }
    
    if (filters.graduationYear) {
      console.log('Filtering by graduation year:', filters.graduationYear);
      filtered = filtered.filter(student => {
        const gradYear = new Date(student.education?.graduation_date).getFullYear();
        console.log('Checking graduation year:', gradYear, '===', filters.graduationYear, '?', gradYear === filters.graduationYear);
        return gradYear === filters.graduationYear;
      });
    }

    console.log('Filtered students count:', filtered.length);
    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  const handleApplyFilters = (newFilters) => {
    filterStudents(newFilters);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Container maxWidth="lg">
              <Paper 
                elevation={3} 
                sx={{ 
                  mt: 4, 
                  mb: 4, 
                  p: 3,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  color: 'white'
                }}
              >
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                  Recruiter Search Portal
                </Typography>
                <Typography variant="subtitle1" align="center">
                  Find and connect with talented students for your organization
                </Typography>
              </Paper>
              <StudentList 
                filteredStudents={filteredStudents}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                handleApplyFilters={handleApplyFilters}
              />
            </Container>
          }
        />
        <Route path="/student/:id" element={<StudentDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;
