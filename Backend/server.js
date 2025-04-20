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
  
  return {
    id: student.id,
    name: `${student.first_name} ${student.last_name}`,
    email: student.email,
    phone: student.phone || '',
    university: isNewFormat ? student.education.university : student.University,
    major: isNewFormat ? student.education.major : student.Major,
    gpa: isNewFormat ? student.education.gpa : student.GPA,
    graduationYear: isNewFormat 
      ? new Date(student.education.graduation_date).getFullYear()
      : new Date(student['Graduation Date']).getFullYear(),
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
      filteredStudents = filteredStudents.filter(student => {
        const gradDate = student.education?.graduation_date || student['Graduation Date'];
        return new Date(gradDate).getFullYear() === targetYear;
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
    const majors = [...new Set(studentsData.map(student => student.education.major))];
    res.json(majors);
  } catch (error) {
    console.error('Error fetching majors:', error);
    res.status(500).json({ error: 'Internal server error' });
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