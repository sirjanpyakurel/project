import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Avatar, 
  Chip,
  Paper,
  Divider
} from '@mui/material';
import { 
  ArrowBack, 
  School, 
  Code, 
  Work, 
  Email, 
  Phone, 
  GitHub, 
  LinkedIn,
  Description
} from '@mui/icons-material';
import { generateStudentPDF } from '../pdfExport';
import '../styles/StudentDetail.css';

const StudentDetail = ({ student }) => {
  const navigate = useNavigate();

  const handleExportPDF = () => {
    try {
      const doc = generateStudentPDF(student);
      const fileName = `${student.name.replace(/\s+/g, '_')}_profile.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  if (!student) {
    return (
      <Box className="student-detail-container">
        <Typography variant="h5" color="error">
          Student not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="student-detail-container">
      <Box className="student-detail-header">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          className="student-detail-back-button"
        >
          Back to Students
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExportPDF}
          startIcon={<Description />}
        >
          Export PDF
        </Button>
      </Box>

      <Paper className="student-detail-content">
        <Box className="student-detail-profile">
          <Avatar 
            className="student-detail-avatar"
            sx={{ width: 120, height: 120 }}
          >
            {student.name.charAt(0)}
          </Avatar>
          <Typography variant="h4" className="student-detail-name">
            {student.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {student.major} • {student.university}
          </Typography>
        </Box>

        <Box className="student-detail-info">
          {/* Education Section */}
          <Box className="info-section">
            <Box className="section-title">
              <School />
              <Typography variant="h6">Education</Typography>
            </Box>
            <Box className="info-item">
              <Typography variant="body1">
                <strong>University:</strong> {student.university}
              </Typography>
              <Typography variant="body1">
                <strong>Major:</strong> {student.major}
              </Typography>
              <Typography variant="body1">
                <strong>GPA:</strong> {student.gpa}
              </Typography>
              <Typography variant="body1">
                <strong>Graduation Year:</strong> {student.graduationYear}
              </Typography>
            </Box>
          </Box>

          {/* Skills Section */}
          <Box className="info-section">
            <Box className="section-title">
              <Code />
              <Typography variant="h6">Skills</Typography>
            </Box>
            <Box className="skills-container">
              {student.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  className="skill-chip"
                />
              ))}
            </Box>
          </Box>

          {/* Contact Section */}
          <Box className="info-section">
            <Box className="section-title">
              <Email />
              <Typography variant="h6">Contact Information</Typography>
            </Box>
            <Box className="info-item">
              <Typography variant="body1">
                <Email sx={{ mr: 1 }} /> {student.email}
              </Typography>
              <Typography variant="body1">
                <Phone sx={{ mr: 1 }} /> {student.phone}
              </Typography>
              {student.github && (
                <Typography variant="body1">
                  <GitHub sx={{ mr: 1 }} /> 
                  <a href={student.github} target="_blank" rel="noopener noreferrer">
                    GitHub Profile
                  </a>
                </Typography>
              )}
              {student.linkedin && (
                <Typography variant="body1">
                  <LinkedIn sx={{ mr: 1 }} /> 
                  <a href={student.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn Profile
                  </a>
                </Typography>
              )}
            </Box>
          </Box>

          {/* Projects Section */}
          <Box className="info-section">
            <Box className="section-title">
              <Description />
              <Typography variant="h6">Projects</Typography>
            </Box>
            {student.projects.map((project, index) => (
              <Box key={index} className="project-item">
                <Typography variant="h6" className="project-title">
                  {project.title}
                </Typography>
                <Typography variant="body1" className="project-description">
                  {project.description}
                </Typography>
                {project.technologies && (
                  <Typography variant="body2" color="text.secondary">
                    Technologies: {project.technologies}
                  </Typography>
                )}
                {project.link && (
                  <Typography variant="body2">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      View Project
                    </a>
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentDetail; 