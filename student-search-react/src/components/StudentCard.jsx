import { Card, CardContent, Typography } from '@mui/material';

const StudentCard = ({ student }) => {
  return (
    <Card sx={{ minWidth: 275, margin: 1 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {student.first_name} {student.last_name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {student.major}
        </Typography>
        <Typography variant="body2">
          {student.University}
          <br />
          GPA: {student.GPA.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StudentCard; 