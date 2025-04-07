import { Card, CardContent, Typography, Box, CardActionArea } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from 'react-router-dom';

const StudentCard = ({ student }) => {
  const navigate = useNavigate();
  
  if (!student) return null;

  const {
    id,
    first_name,
    last_name,
    education = {}
  } = student;

  const { university } = education;

  const handleClick = () => {
    navigate(`/student/${id}`);
  };

  return (
    <Card sx={{ minWidth: 275, margin: 1 }}>
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {first_name} {last_name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <SchoolIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body1">
              {university}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default StudentCard; 