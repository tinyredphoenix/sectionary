import * as pdfjsLib from 'pdfjs-dist';

// Set worker source to a CDN to avoid build issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface ExtractionResult {
  text: string;
  sourceType: "SECTION_PDF" | "CONSOLIDATED_PDF";
  confidence: "HIGH" | "LOW";
}

export async function extractSectionText(
  sectionNumber: string, 
  pdfUrl: string = "https://incometaxindia.gov.in/Documents/income-tax-act-1961-as-amended-by-finance-act-2025.pdf"
): Promise<ExtractionResult> {

  console.log(`Attempting to extract Section ${sectionNumber} from ${pdfUrl}`);

  try {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;
    let fullText = "";

    // 1. Load all text (naive approach for now, optimized later if needed)
    // For a large PDF, this is heavy. We might want to search page by page.
    // But for "lazy ingestion" we need to find the start.
    
    // Optimization: Check the first few pages for Table of Contents or Index? 
    // No, let's just iterate until we find the start anchor.
    
    let foundStart = false;
    let extractedText = "";
    
    // Normalize section number for regex
    // Escape special chars
    const escapedSectionNumber = sectionNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Anchor pattern: "10." or "115BAC." at start of line (or close to it)
    // We will look for lines that strictly match the section number followed by a dot.
    const startAnchorRegex = new RegExp(`^\\s*${escapedSectionNumber}\\.\\s+`, 'i');
    
    // We assume the next section starts with a number followed by a dot.
    // This is a heuristic. 
    // We will capture until we see another line starting with a generic section pattern: Number + Dot
    // But we must ensure it's not a subsection like "(1)".
    // Real section numbers in IT Act: "10.", "11.", "115BAC."
    // They generally don't start with brackets.
    const nextSectionRegex = /^\s*[0-9]+[A-Z]*\.\s+/;

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Reconstruct text items into lines (basic reconstruction)
      let pageText = "";
      let lastY = -1;
      
      // Simple line reconstruction based on Y position
      // Note: PDF.js returns items. transform[5] is Y position.
      // We sort items by Y (descending) then X (ascending) usually, but textContent.items usually comes in order.
      // Let's just join items with space if Y is same, newline if Y changes significantly.
      
      const items: any[] = textContent.items;
      
      // Naive text join for searching
      // This might lose structure, but we need to match the start anchor.
      // A better way is to check item strings.
      
      for (const item of items) {
         // This is a stream of text strings.
         // We'll append to a buffer and check line by line?
         // PDFs don't really have "lines".
         // Let's just concatenate with newlines for items that are far apart vertically.
         
         // Basic text extraction
         extractedText += item.str + " ";
      }
    }
    
    // Since page-by-page streaming extraction is complex to get right with "Next Section" logic spanning pages,
    // and storing the *entire* text of a large PDF in memory is bad...
    // 
    // Revised Strategy for CONSOLIDATED PDF:
    // 1. Iterate pages.
    // 2. Search for Start Anchor on the page.
    // 3. If found, start accumulating text.
    // 4. Continue accumulating subsequent pages until End Anchor is found.
    
    let activeExtraction = false;
    let buffer = "";

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const items: any[] = textContent.items;

      // Filter out empty items
      const strings = items.map((item: any) => item.str);
      
      // We need to look for the pattern in the array of strings.
      // Sometimes "10." is its own string, sometimes "10. Definitions" is one string.
      
      for (let j = 0; j < strings.length; j++) {
        const str = strings[j].trim();
        
        if (!activeExtraction) {
          // Check for Start
          // Strict match: "10." or "10. <Text>"
          if (startAnchorRegex.test(str)) {
             console.log(`Found Section ${sectionNumber} start on page ${i}`);
             activeExtraction = true;
             buffer += str + "\n";
          }
        } else {
          // Check for End (Next Section)
          // It must NOT match the current section number again (headers/footers might repeat it?)
          // And it must look like a section start.
          
          // Avoid matching the SAME section start if repeated.
          if (startAnchorRegex.test(str)) {
             // Likely a header or repeat? Or maybe we just captured the start line again?
             // If we just started, ignore.
             continue; 
          }

          // Check if it's a NEW section
          // e.g. "11." or "12."
          // But we need to be careful about "1.2" (sub clauses) or list items.
          // IT Act sections are usually integers or Integer+Letters. e.g. 10, 10A, 10BB.
          // Regex: ^[0-9]+[A-Z]*\.$
          
          // Let's rely on the prompt's instruction: "<nextSectionNumber>."
          // Since we don't know the next number, we look for the pattern.
          if (nextSectionRegex.test(str)) {
             // Potential stop.
             // Heuristic: Ensure it's not a subsection number like "1." inside a list if we are in section 10?
             // Actually, IT Act sections are distinct.
             // We'll assume if we hit something like "11." it's the next one.
             
             console.log(`Found potential next section start: ${str} on page ${i}`);
             // STOP.
             return {
                text: buffer.trim(),
                sourceType: "CONSOLIDATED_PDF",
                confidence: "LOW" // Consolidated is always implied LOW/Medium relative to specific PDF
             };
          }
          
          buffer += str + " ";
          // Add newline occasionally? PDF text flow is hard. 
          // We'll just add space.
        }
      }
      
      // Safety break: If buffer gets too huge (e.g. > 50k chars), maybe we missed the stop?
      if (activeExtraction && buffer.length > 50000) {
          console.warn("Buffer exceeded safety limit. Aborting extraction.");
          break;
      }
    }

    if (activeExtraction && buffer.length > 0) {
        // End of PDF reached
         return {
            text: buffer.trim(),
            sourceType: "CONSOLIDATED_PDF",
            confidence: "LOW"
         };
    }

    throw new Error("Section not found in PDF.");

  } catch (error) {
    console.error("PDF Extraction Failed:", error);
    throw error;
  }
}
