import { Card, CardContent, Typography, Box, CardActionArea, Chip } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from 'react-router-dom';

const StudentCard = ({ student }) => {
  const navigate = useNavigate();
  
  if (!student) return null;

  const {
    id,
    name,
    university,
    major,
    gpa,
    skills = []
  } = student;

  const handleClick = () => {
    navigate(`/student/${id}`);
  };

  return (
    <Card sx={{ minWidth: 275, margin: 1, height: '100%' }}>
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 1 }}>
            <SchoolIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body1">
              {university || 'University not specified'}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {major || 'Major not specified'} • GPA: {gpa || 'Not specified'}
          </Typography>
          <Box sx={{ mt: 1 }}>
            {skills.slice(0, 3).map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
            {skills.length > 3 && (
              <Chip
                label={`+${skills.length - 3} more`}
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default StudentCard; 