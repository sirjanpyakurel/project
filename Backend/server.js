const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Read students data from JSON file
const dbData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
const studentsData = dbData.students;

// Helper function to format student data
const formatStudent = (student) => {
  if (!student) {
    console.error('Invalid student data:', student);
    return null;
  }

  // Handle both data formats
  const isNewFormat = student.education !== undefined;
  
  // Get graduation date from either format
  const gradDate = isNewFormat ? student.education.graduation_date : student['Graduation Date'];
  const gradYear = gradDate ? new Date(gradDate).getFullYear() : null;
  
  return {
    id: student.id,
    name: `${student.first_name} ${student.last_name}`,
    email: student.email,
    phone: student.phone || '',
    university: isNewFormat ? student.education.university : student.University,
    major: isNewFormat ? student.education.major : student.Major,
    gpa: isNewFormat ? student.education.gpa : student.GPA,
    graduationYear: gradYear,
    // Preserve original graduation date fields
    education: isNewFormat ? student.education : {
      graduation_date: student['Graduation Date']
    },
    'Graduation Date': student['Graduation Date'],
    graduationDate: gradDate,
    skills: student.skills || [],
    github: student.github || '',
    linkedin: student.linkedin || '',
    projects: (student.projects || []).map(project => ({
      title: project.title,
      description: project.description,
      technologies: Array.isArray(project.technologies) 
        ? project.technologies.join(', ')
        : project.technologies || '',
      link: project.github || ''
    }))
  };
};

// Routes
app.get('/students', (req, res) => {
  try {
    const { search, major, skills, graduationYear, gpa } = req.query;
    let filteredStudents = [...studentsData];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredStudents = filteredStudents.filter(student => {
        const name = `${student.first_name} ${student.last_name}`.toLowerCase();
        const university = student.education?.university?.toLowerCase() || student.University?.toLowerCase() || '';
        return name.includes(searchLower) || university.includes(searchLower);
      });
    }

    if (major) {
      const majorLower = major.toLowerCase();
      filteredStudents = filteredStudents.filter(student => {
        const studentMajor = student.education?.major?.toLowerCase() || student.Major?.toLowerCase() || '';
        return studentMajor === majorLower;
      });
    }

    if (skills) {
      const requiredSkills = skills.split(',').map(skill => skill.trim().toLowerCase());
      filteredStudents = filteredStudents.filter(student => 
        requiredSkills.every(skill => 
          (student.skills || []).some(s => s.toLowerCase() === skill)
        )
      );
    }

    if (graduationYear) {
      const targetYear = parseInt(graduationYear);
      console.log('Backend: Filtering by graduation year:', targetYear);
      filteredStudents = filteredStudents.filter(student => {
        const gradDate = student.education?.graduation_date || student['Graduation Date'];
        console.log('Backend: Student ID:', student.id, 'Graduation date:', gradDate);
        if (!gradDate) {
          console.log('Backend: No graduation date found for student:', student.id);
          return false;
        }
        const year = new Date(gradDate).getFullYear();
        console.log('Backend: Parsed year:', year, 'Target year:', targetYear);
        return year === targetYear;
      });
    }

    if (gpa) {
      const targetGpa = parseFloat(gpa);
      filteredStudents = filteredStudents.filter(student => {
        const studentGpa = student.education?.gpa || student.GPA;
        return studentGpa >= targetGpa;
      });
    }

    // Format the response
    const formattedStudents = filteredStudents.map(formatStudent).filter(student => student !== null);
    console.log('Backend: Sending formatted students:', formattedStudents.map(s => ({
      id: s.id,
      name: s.name,
      graduationDate: s.education?.graduation_date || s['Graduation Date']
    })));
    res.json(formattedStudents);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/students/:id', (req, res) => {
  try {
    const student = studentsData.find(s => s.id === parseInt(req.params.id));
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(formatStudent(student));
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available majors
app.get('/majors', (req, res) => {
  try {
    console.log('Fetching majors from students data...');
    console.log('Number of students in data:', studentsData.length);
    
    // Log a sample student to see structure
    if (studentsData.length > 0) {
      console.log('First student data structure:', JSON.stringify(studentsData[0], null, 2));
    }
    
    const allMajors = studentsData.map(student => {
      // Try all possible locations for major
      const major = student.major || student.education?.major || student.Major;
      console.log('Student ID:', student.id, 'Major:', major);
      return major;
    });
    
    console.log('All majors before filtering:', allMajors);
    
    const majors = [...new Set(allMajors.filter(Boolean))];
    console.log('Unique majors after filtering:', majors, 'Count:', majors.length);
    
    // Even if no majors are found, return an empty array rather than error
    res.json(majors);
  } catch (error) {
    console.error('Error in /majors endpoint:', error);
    // Return empty array instead of error to prevent frontend from breaking
    res.json([]);
  }
});

// Get available skills
app.get('/skills', (req, res) => {
  try {
    const skills = [...new Set(studentsData.flatMap(student => student.skills))];
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available graduation years
app.get('/graduation-years', (req, res) => {
  try {
    const years = [...new Set(studentsData.map(student => 
      new Date(student.education.graduation_date).getFullYear()
    ))];
    res.json(years);
  } catch (error) {
    console.error('Error fetching graduation years:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
