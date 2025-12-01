import express from 'express';
import PDFDocument from 'pdfkit';
import User from '../models/UserModel.js';  
import protect from '../middleware/protect.js';

const router = express.Router();

// Generate and download CV
router.get('/generate', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'jobseeker') {
      return res.status(403).json({ message: 'CV generation is only available for jobseekers' });
    }
    
    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${user.name.replace(/\s+/g, '_')}_CV.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Header - Name
    doc.fontSize(24).font('Helvetica-Bold').text(user.name, { align: 'center' });
    doc.moveDown(0.5);
    
    // Contact Info
    doc.fontSize(10).font('Helvetica');
    const contactInfo = [];
    if (user.email) contactInfo.push(user.email);
    if (user.phone) contactInfo.push(user.phone);
    if (user.location) contactInfo.push(user.location);
    doc.text(contactInfo.join(' | '), { align: 'center' });
    doc.moveDown(1);
    
    // Professional Summary
    if (user.bio && user.bio !== 'No bio provided') {
      doc.fontSize(14).font('Helvetica-Bold').text('Professional Summary');
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(user.bio, { align: 'justify' });
      doc.moveDown(1);
    }
    
    // Skills
    if (user.skills && user.skills.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Skills');
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(user.skills.join(' • '), { align: 'left' });
      doc.moveDown(1);
    }
    
    // Experience
    if (user.experience && user.experience.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Work Experience');
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);
      
      user.experience.forEach((exp, index) => {
        doc.fontSize(12).font('Helvetica-Bold').text(exp.position);
        doc.fontSize(10).font('Helvetica-Oblique').text(`${exp.company}${exp.location ? ' - ' + exp.location : ''}`);
        
        const startDate = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
        const endDate = exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '');
        if (startDate || endDate) {
          doc.fontSize(9).font('Helvetica').text(`${startDate} - ${endDate}`);
        }
        
        if (exp.description) {
          doc.moveDown(0.3);
          doc.fontSize(10).font('Helvetica').text(exp.description, { align: 'justify' });
        }
        
        if (index < user.experience.length - 1) {
          doc.moveDown(0.8);
        }
      });
      doc.moveDown(1);
    }
    
    // Education
    if (user.education && user.education.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Education');
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);
      
      user.education.forEach((edu, index) => {
        doc.fontSize(12).font('Helvetica-Bold').text(edu.degree);
        doc.fontSize(10).font('Helvetica-Oblique').text(edu.institution);
        
        if (edu.fieldOfStudy) {
          doc.fontSize(10).font('Helvetica').text(edu.fieldOfStudy);
        }
        
        const startDate = edu.startDate ? new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
        const endDate = edu.current ? 'Present' : (edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '');
        if (startDate || endDate) {
          doc.fontSize(9).font('Helvetica').text(`${startDate} - ${endDate}`);
        }
        
        if (index < user.education.length - 1) {
          doc.moveDown(0.8);
        }
      });
    }
    
    // Finalize PDF
    doc.end();
    
  } catch (error) {
    console.error('CV generation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate CV', 
      error: error.message 
    });
  }
});

export default router;