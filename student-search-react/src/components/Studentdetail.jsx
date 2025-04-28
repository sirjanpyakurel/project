import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Avatar, 
  Chip,
  Paper,
  Grid,
  IconButton,
  Tooltip
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
  Description,
  Launch
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
          size="small"
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExportPDF}
          startIcon={<Description />}
          className="student-detail-export-button"
          size="small"
        >
          Export PDF
        </Button>
      </Box>

      <Paper className="student-detail-content">
        <Box className="student-detail-profile">
          <Avatar 
            className="student-detail-avatar"
            sx={{ width: 100, height: 100 }}
          >
            {student.name.charAt(0)}
          </Avatar>
          <Typography variant="h4" className="student-detail-name">
            {student.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1rem' }}>
            {student.major} • {student.university}
          </Typography>
        </Box>

        <Box className="student-detail-info">
          {/* Left Column */}
          <Box className="left-column">
            {/* Education Section */}
            <Box className="info-section">
              <Box className="section-title">
                <School />
                <Typography variant="h6">Education</Typography>
              </Box>
              <Box className="info-item">
                <Typography variant="body2">
                  <strong>University:</strong> {student.university}
                </Typography>
                <Typography variant="body2">
                  <strong>Major:</strong> {student.major}
                </Typography>
                <Typography variant="body2">
                  <strong>GPA:</strong> {student.gpa}
                </Typography>
                <Typography variant="body2">
                  <strong>Graduation Year:</strong> {student.graduationYear}
                </Typography>
              </Box>
            </Box>

            {/* Contact Section */}
            <Box className="info-section">
              <Box className="section-title">
                <Email />
                <Typography variant="h6">Contact</Typography>
              </Box>
              <Box className="info-item">
                <Typography variant="body2">
                  <Email sx={{ mr: 1, fontSize: '1rem' }} /> {student.email}
                </Typography>
                <Typography variant="body2">
                  <Phone sx={{ mr: 1, fontSize: '1rem' }} /> {student.phone}
                </Typography>
                {student.github && (
                  <Typography variant="body2">
                    <GitHub sx={{ mr: 1, fontSize: '1rem' }} /> 
                    <a href={student.github} target="_blank" rel="noopener noreferrer" className="project-link">
                      GitHub
                    </a>
                  </Typography>
                )}
                {student.linkedin && (
                  <Typography variant="body2">
                    <LinkedIn sx={{ mr: 1, fontSize: '1rem' }} /> 
                    <a href={student.linkedin} target="_blank" rel="noopener noreferrer" className="project-link">
                      LinkedIn
                    </a>
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* Right Column */}
          <Box className="right-column">
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
                    size="small"
                  />
                ))}
              </Box>
            </Box>

            {/* Projects Section */}
            <Box className="info-section">
              <Box className="section-title">
                <Description />
                <Typography variant="h6">Projects</Typography>
              </Box>
              <Box className="projects-container">
                {student.projects.map((project, index) => (
                  <Box className="project-item" key={index}>
                    <Typography variant="h6" className="project-title">
                      {project.title}
                    </Typography>
                    <Typography variant="body2" className="project-description">
                      {project.description}
                    </Typography>
                    {project.technologies && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        <strong>Tech:</strong> {project.technologies}
                      </Typography>
                    )}
                    {project.link && (
                      <Button
                        variant="text"
                        color="primary"
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                        size="small"
                        endIcon={<Launch sx={{ fontSize: '1rem' }} />}
                      >
                        View
                      </Button>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentDetail; 
