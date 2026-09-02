const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");

const data = [{ id: 1, name: "test", email: "test@test.cz" }];

async function generateCertificates() {
  // Ensure output directory exists
  const outputDir = path.join(__dirname, "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Load the template PDF
  const templatePath = path.join(__dirname, "templates", "ENGLISH.pdf");
  const templateBytes = fs.readFileSync(templatePath);

  for (const person of data) {
    try {
      // Load a fresh copy of the template for each person
      const pdfDoc = await PDFDocument.load(templateBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      // Get page dimensions
      const { width, height } = firstPage.getSize();

      // Embed font

      const ubuntuFontBytes = await fetch(
        "https://github.com/Hopding/pdf-lib/raw/master/assets/fonts/ubuntu/Ubuntu-R.ttf",
      ).then((res) => res.arrayBuffer());

      pdfDoc.registerFontkit(fontkit);

      const font = await pdfDoc.embedFont(ubuntuFontBytes);

      // Name styling
      let fontSize = 36;
      const name = person.name;

      // Measure text width
      let textWidth = font.widthOfTextAtSize(name, fontSize);

      // Auto-scale font if name is too long (max 80% of page width)
      const maxWidth = width * 0.8;
      if (textWidth > maxWidth) {
        fontSize = (maxWidth / textWidth) * fontSize;
        textWidth = maxWidth;
      }

      const x = 152; // start of the line
      const y = 460; // 6px above the line (442.8 + 6)

      // Draw the name
      firstPage.drawText(name, {
        x: x,
        y: y,
        size: fontSize,
        font: font,
        color: rgb(0.2, 0.2, 0.2), // Dark gray
      });

      // Save the PDF
      const pdfBytes = await pdfDoc.save();

      // Extract email prefix (part before @)
      const emailPrefix = person.email.split("@")[0];
      const filename = `${emailPrefix}-certificate-${person.id}.pdf`;
      const outputPath = path.join(outputDir, filename);

      fs.writeFileSync(outputPath, pdfBytes);

      console.log(`✓ Generated certificate for ${person.name} → ${filename}`);
    } catch (error) {
      console.error(
        `✗ Error generating certificate for ${person.name}:`,
        error.message,
      );
    }
  }

  console.log(`\nDone! Generated ${data.length} certificates in ./output/`);
}

// Run the script
generateCertificates().catch(console.error);
