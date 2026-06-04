const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function compileAllLeads() {
  const directory = __dirname;
  const files = fs.readdirSync(directory);
  
  // Find all files matching *-lead.json
  const leadFiles = files.filter(f => f.endsWith('-lead.json'));
  
  if (leadFiles.length === 0) {
    console.log('No lead JSON files found in directory.');
    return;
  }

  console.log(`Found ${leadFiles.length} lead JSON files. Compiling...`);

  leadFiles.forEach(file => {
    const jsonPath = path.join(directory, file);
    const pdfPath = jsonPath.replace('-lead.json', '-lead.pdf');
    
    try {
      const rawData = fs.readFileSync(jsonPath, 'utf8');
      const lead = JSON.parse(rawData);

      const doc = new PDFDocument({ margin: 50 });
      const writeStream = fs.createWriteStream(pdfPath);
      doc.pipe(writeStream);

      // Styling palette
      const primaryColor = '#1A365D'; // Slate Navy
      const secondaryColor = '#2B6CB0'; // Royal Blue
      const textColor = '#2D3748'; // Charcoal
      const dividerColor = '#E2E8F0'; // Light grey

      // Header Title
      doc.fillColor(primaryColor)
         .font('Helvetica-Bold')
         .fontSize(18)
         .text(lead.title, { align: 'center' });

      doc.moveDown(0.4);
      doc.fillColor(secondaryColor)
         .font('Helvetica-Oblique')
         .fontSize(9.5)
         .text(`Generated Sample Lead Document for Portal Testing | Source: ${lead.source}`, { align: 'center' });

      // Divider
      doc.moveDown(0.4);
      doc.strokeColor(dividerColor)
         .lineWidth(1)
         .moveTo(50, doc.y)
         .lineTo(562, doc.y)
         .stroke();

      doc.moveDown(1.2);

      const lines = lead.details.split('\n');
      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) {
          doc.moveDown(0.4);
          return;
        }

        if (trimmed.startsWith('PROJECT PROPOSAL:')) {
          doc.fillColor(primaryColor)
             .font('Helvetica-Bold')
             .fontSize(13)
             .text(trimmed);
          doc.moveDown(0.6);
        } else if (/^[1-9]\.\s+[A-Z\s&]+$/.test(trimmed)) {
          // Main section headings like "1. PROJECT OVERVIEW"
          doc.moveDown(0.6);
          doc.fillColor(primaryColor)
             .font('Helvetica-Bold')
             .fontSize(11)
             .text(trimmed);
          doc.moveDown(0.4);
        } else if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
          // Bullet list items
          doc.fillColor(textColor)
             .font('Helvetica')
             .fontSize(9)
             .text(`  •  ${trimmed.substring(1).trim()}`, { indent: 15, lineGap: 2.5 });
        } else {
          // Regular paragraph or minor subtitles
          if (trimmed.startsWith('Phase ') || trimmed.startsWith('Estimated Timeline:') || trimmed.startsWith('Budget Range:') || trimmed.startsWith('Key Milestones:')) {
            doc.fillColor(textColor)
               .font('Helvetica-Bold')
               .fontSize(9)
               .text(trimmed, { lineGap: 2.5 });
          } else {
            doc.fillColor(textColor)
               .font('Helvetica')
               .fontSize(9)
               .text(trimmed, { lineGap: 2.5 });
          }
        }
      });

      doc.end();

      writeStream.on('finish', () => {
        console.log(`✓ Compiled PDF for: ${file} -> ${path.basename(pdfPath)}`);
      });
      
    } catch (err) {
      console.error(`Error compiling file ${file}:`, err.message);
    }
  });
}

compileAllLeads();
