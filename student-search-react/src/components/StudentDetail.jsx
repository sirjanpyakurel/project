import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Link,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  Language as LanguageIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

const StudentDetail = ({ student }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        Back to Search
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {student.first_name} {student.last_name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {student.education.major} Student at {student.education.university}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Contact & Basic Info */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <List>
                  <ListItem>
                    <EmailIcon sx={{ mr: 2 }} />
                    <ListItemText primary={student.email} />
                  </ListItem>
                  <ListItem>
                    <PhoneIcon sx={{ mr: 2 }} />
                    <ListItemText primary={student.phone} />
                  </ListItem>
                  <ListItem>
                    <LinkedInIcon sx={{ mr: 2 }} />
                    <Link href={student.linkedin} target="_blank" rel="noopener">
                      LinkedIn Profile
                    </Link>
                  </ListItem>
                  <ListItem>
                    <GitHubIcon sx={{ mr: 2 }} />
                    <Link href={student.github} target="_blank" rel="noopener">
                      GitHub Profile
                    </Link>
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Education
                </Typography>
                <List>
                  <ListItem>
                    <SchoolIcon sx={{ mr: 2 }} />
                    <ListItemText 
                      primary={student.education.university}
                      secondary={`${student.education.major} ${student.education.minor ? `with ${student.education.minor} minor` : ''}`}
                    />
                  </ListItem>
                  <ListItem>
                    <CalendarIcon sx={{ mr: 2 }} />
                    <ListItemText 
                      primary={`Expected Graduation: ${new Date(student.education.graduation_date).toLocaleDateString()}`}
                      secondary={`GPA: ${student.education.gpa}`}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Location & Work Authorization
                </Typography>
                <List>
                  <ListItem>
                    <LocationIcon sx={{ mr: 2 }} />
                    <ListItemText 
                      primary={`Current Location: ${student.location.current}`}
                      secondary={`Willing to relocate: ${student.location.willing_to_relocate ? 'Yes' : 'No'}`}
                    />
                  </ListItem>
                  <ListItem>
                    <LanguageIcon sx={{ mr: 2 }} />
                    <ListItemText 
                      primary="Work Authorization"
                      secondary={student.work_authorization}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Skills, Experience, Projects */}
          <Grid item xs={12} md={8}>
            {/* Skills Section */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {student.skills.map((skill, index) => (
                    <Chip key={index} label={skill} color="primary" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Experience
                </Typography>
                {student.experience.map((exp, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {exp.position} at {exp.company}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {exp.location} • {exp.start_date} - {exp.end_date}
                    </Typography>
                    <Typography variant="body2">
                      {exp.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Projects Section */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Projects
                </Typography>
                {student.projects.map((project, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {project.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {project.technologies.join(', ')}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {project.description}
                    </Typography>
                    {project.github && (
                      <Link href={project.github} target="_blank" rel="noopener">
                        <Button
                          startIcon={<GitHubIcon />}
                          size="small"
                          sx={{ mt: 1 }}
                        >
                          View on GitHub
                        </Button>
                      </Link>
                    )}
                    <Divider sx={{ my: 2 }} />
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Certifications Section */}
            {student.certifications && student.certifications.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Certifications
                  </Typography>
                  <List>
                    {student.certifications.map((cert, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={cert.name}
                          secondary={`${cert.issuer} • ${cert.date}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default StudentDetail; 