import jsPDF from 'jspdf';

export const generateStudentPDF = (student) => {
  const doc = new jsPDF();
  const margin = 20;
  let yPos = margin;
  const lineHeight = 7;

  // Helper function to add text and move cursor
  const addText = (text, size = 12, isBold = false) => {
    if (text) {
      doc.setFontSize(size);
      doc.setFont(undefined, isBold ? 'bold' : 'normal');
      // Convert to string to handle numbers
      const textStr = String(text);
      doc.text(textStr, margin, yPos);
      yPos += lineHeight;
    }
  };

  // Add header
  addText(student.name || 'Student Profile', 20, true);
  yPos += 5;

  // Contact Information
  addText('Contact Information', 16, true);
  addText(`Email: ${student.email || 'Not provided'}`);
  addText(`Phone: ${student.phone || 'Not provided'}`);
  if (student.github) {
    addText(`GitHub: github.com/${student.github}`);
  }
  if (student.linkedin) {
    addText(`LinkedIn: linkedin.com/in/${student.linkedin}`);
  }
  yPos += 5;

  // Education
  addText('Education', 16, true);
  addText(`University: ${student.university || 'Not specified'}`);
  addText(`Major: ${student.major || 'Not specified'}`);
  addText(`GPA: ${student.gpa || 'Not specified'}`);
  addText(`Expected Graduation: ${student.graduationYear || 'Not specified'}`);
  yPos += 5;

  // Skills
  if (student.skills && student.skills.length > 0) {
    addText('Skills', 16, true);
    const skillsText = student.skills.join(', ');
    const splitSkills = doc.splitTextToSize(skillsText, doc.internal.pageSize.width - 2 * margin);
    splitSkills.forEach(line => {
      if (line) addText(line);
    });
    yPos += 5;
  }

  // Projects
  if (student.projects && student.projects.length > 0) {
    addText('Projects', 16, true);
    student.projects.forEach(project => {
      if (project.name) addText(project.name, 12, true);
      if (project.description) {
        const descLines = doc.splitTextToSize(project.description, doc.internal.pageSize.width - 2 * margin);
        descLines.forEach(line => {
          if (line) addText(line);
        });
      }
      yPos += 3;
    });
  }

  return doc;
}; 