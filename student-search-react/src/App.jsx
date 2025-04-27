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
        console.log('First student complete data:', JSON.stringify(data[0], null, 2));

        // Sort students by first name initial before setting state
        data.sort((a, b) => {
          const aFirst = (a.first_name || a.FirstName || a.name?.split(' ')[0] || '').toLowerCase();
          const bFirst = (b.first_name || b.FirstName || b.name?.split(' ')[0] || '').toLowerCase();
          if (aFirst < bFirst) return -1;
          if (aFirst > bFirst) return 1;
          return 0;
        });

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
      const searchTerm = filters.search.toLowerCase().trim();
      console.log('Filtering by search term:', searchTerm);
      filtered = filtered.filter(student => {
        console.log('Student object structure:', student);
        
        const firstName = (student.first_name || student.FirstName || student.name?.split(' ')[0] || '').toLowerCase().trim();
        const lastName = (student.last_name || student.LastName || student.name?.split(' ')[1] || '').toLowerCase().trim();
        
        const fullName = `${firstName} ${lastName}`.trim();
        const reverseName = `${lastName} ${firstName}`.trim();
        
        console.log('Name combinations:', {
          firstName,
          lastName,
          fullName,
          reverseName,
          searchTerm
        });
        
        return fullName.includes(searchTerm) || 
               reverseName.includes(searchTerm) ||
               firstName.includes(searchTerm) ||
               lastName.includes(searchTerm);
      });
      console.log('Number of students after name search:', filtered.length);
    }
    
    if (filters.university) {
      const universityTerm = filters.university.toLowerCase().trim();
      console.log('Filtering by university:', universityTerm);
      filtered = filtered.filter(student => {
        // Try different possible university field locations
        const university = (student.education?.university || 
                          student.university || 
                          student.University || 
                          '').toLowerCase().trim();
        console.log('University comparison:', university, 'vs', universityTerm);
        return university.includes(universityTerm);
      });
      console.log('Number of students after university filter:', filtered.length);
    }
    
    if (filters.major) {
      console.log('Filtering by major:', filters.major);
      filtered = filtered.filter(student => {
        console.log('Student object when filtering by major:', student);
        // Try both formats and do case-insensitive, partial matching
        const majorToCheck = (student.education?.major || 
                          student.major || 
                          student.Major || 
                          '').toLowerCase();
        const searchMajor = filters.major.toLowerCase();
        console.log('Major comparison:', majorToCheck, 'vs', searchMajor);
        // Use includes instead of exact match for more flexible searching
        return majorToCheck.includes(searchMajor) || searchMajor.includes(majorToCheck);
      });
      console.log('Number of students after major filter:', filtered.length);
    }
    
    if (filters.gpa) {
      const targetGpa = parseFloat(filters.gpa);
      console.log('Filtering by GPA:', targetGpa);
      filtered = filtered.filter(student => {
        // Try different possible GPA field locations
        const studentGpa = parseFloat(student.education?.gpa || 
                                    student.gpa || 
                                    student.GPA || 
                                    0);
        console.log('GPA comparison:', studentGpa, '>=', targetGpa);
        return studentGpa >= targetGpa;
      });
      console.log('Number of students after GPA filter:', filtered.length);
    }
    
    if (filters.skills) {
      console.log('Filtering by skills:', filters.skills);
      filtered = filtered.filter(student => {
        if (!student.skills || !Array.isArray(student.skills)) {
          return false;
        }
        
        // Convert skill arrays to lowercase for case-insensitive comparison
        const studentSkills = student.skills.map(skill => skill.toLowerCase());
        const searchSkill = filters.skills.toLowerCase();
        
        // Check if any of the student's skills include the search term
        const hasSkill = studentSkills.some(skill => skill.includes(searchSkill));
        console.log('Checking skills:', studentSkills, 'includes:', searchSkill, '?', hasSkill);
        return hasSkill;
      });
      console.log('Number of students after skills filter:', filtered.length);
    }
    
    if (filters.graduationYear) {
      const targetYear = parseInt(filters.graduationYear);
      console.log('Frontend: Filtering by graduation year:', targetYear);
      filtered = filtered.filter(student => {
        // Log the entire student object to see all available fields
        console.log('Frontend: Student object:', {
          id: student.id,
          name: student.name,
          graduationYear: student.graduationYear
        });
        
        // Use the graduationYear field directly
        const gradYear = student.graduationYear;
        
        console.log('Frontend: Graduation year:', gradYear, 'Target year:', targetYear);
        
        if (gradYear === undefined || gradYear === null) {
          console.log('Frontend: No graduation year found for student');
          return false;
        }
        
        return gradYear === targetYear;
      });
      console.log('Frontend: Number of students after graduation year filter:', filtered.length);
    }

    // Sort filtered students by the initial of their first name
    filtered.sort((a, b) => {
      const aFirst = (a.first_name || a.FirstName || a.name?.split(' ')[0] || '').toLowerCase();
      const bFirst = (b.first_name || b.FirstName || b.name?.split(' ')[0] || '').toLowerCase();
      if (aFirst[0] < bFirst[0]) return -1;
      if (aFirst[0] > bFirst[0]) return 1;
      return 0;
    });

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
