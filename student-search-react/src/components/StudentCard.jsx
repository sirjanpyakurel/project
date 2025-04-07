import { Card, CardContent, Typography, Chip, Box, Link, Divider, Stack } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const StudentCard = ({ student }) => {
  return (
    <Card sx={{ minWidth: 275, margin: 1 }}>
      <CardContent>
        {/* Header Section */}
        <Typography variant="h5" component="div" gutterBottom>
          {student.first_name} {student.last_name}
        </Typography>

        {/* Contact Information */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Link href={`mailto:${student.email}`}>
            <EmailIcon fontSize="small" />
          </Link>
          <Link href={student.linkedin} target="_blank" rel="noopener noreferrer">
            <LinkedInIcon fontSize="small" />
          </Link>
          <Link href={student.github} target="_blank" rel="noopener noreferrer">
            <GitHubIcon fontSize="small" />
          </Link>
        </Stack>

        {/* Education */}
        <Typography variant="h6" color="primary" gutterBottom>
          Education
        </Typography>
        <Typography variant="body1">
          {student.education.university}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {student.education.expected_degree} in {student.education.major}
          {student.education.minor && ` • Minor in ${student.education.minor}`}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          GPA: {student.education.gpa.toFixed(2)} • Graduating: {new Date(student.education.graduation_date).toLocaleDateString()}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        {/* Skills */}
        <Typography variant="h6" color="primary" gutterBottom>
          Skills
        </Typography>
        <Box sx={{ mb: 1.5 }}>
          {student.skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              size="small"
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Experience */}
        {student.experience && student.experience.length > 0 && (
          <>
            <Typography variant="h6" color="primary" gutterBottom>
              Experience
            </Typography>
            {student.experience.map((exp, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body1">
                  {exp.title} • {exp.company}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exp.start_date} - {exp.end_date}
                </Typography>
                <Typography variant="body2">
                  {exp.description}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1.5 }} />
          </>
        )}

        {/* Location & Work Authorization */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <LocationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            {student.location.current} • {student.work_authorization}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudentCard; 