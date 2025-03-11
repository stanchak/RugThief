# RugThief Landing Page

A 90s lo-fi style landing page for RugThief.com with an email collector form.

## Features

- Retro 90s web design aesthetic
- Email collection form
- Mobile responsive
- Animated elements (blinking text, marquee, screen flicker)
- Visitor counter
- Under construction banner

## How to Deploy to GitHub Pages

1. Push this repository to GitHub
2. Go to the repository settings
3. Navigate to "Pages" in the sidebar
4. Under "Source", select "main" branch
5. Click "Save"
6. Your site will be published at `https://yourusername.github.io/RugThief/`

## Local Development

Simply open the `index.html` file in your browser to view the page locally.

## Customization

- The logo is stored in `images/logo-transparent.png`
- All styling is contained within the `<style>` tag in `index.html`
- Favicon is available as SVG in `favicon/favicon.svg`
  - Note: For complete browser compatibility, you should convert the SVG to .ico format using a tool like [favicon.io](https://favicon.io/) or [RealFaviconGenerator](https://realfavicongenerator.net/)

## Google Sheets Integration

To connect the email form to Google Sheets, follow these steps:

1. **Create a Google Sheet**:
   - Go to [Google Sheets](https://sheets.google.com/) and create a new spreadsheet
   - Name the spreadsheet (e.g., "RugThief Email Signups")
   - Add headers in the first row: "Email" and "Timestamp"

2. **Set up Google Apps Script**:
   - In your Google Sheet, click on "Extensions" > "Apps Script"
   - Delete any code in the editor and paste the following:

   ```javascript
   const sheetName = 'Sheet1'; // Change this if your sheet has a different name
   const scriptProp = PropertiesService.getScriptProperties();

   function doPost(e) {
     const lock = LockService.getScriptLock();
     lock.tryLock(10000);
     
     try {
       const doc = SpreadsheetApp.getActiveSpreadsheet();
       const sheet = doc.getSheetByName(sheetName);
       
       const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
       const nextRow = sheet.getLastRow() + 1;
       
       const newRow = headers.map(header => {
         if (header === 'Timestamp') {
           return new Date();
         }
         return e.parameter[header.toLowerCase()] || '';
       });
       
       sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
       
       return ContentService
         .createTextOutput(JSON.stringify({ 'result': 'success' }))
         .setMimeType(ContentService.MimeType.JSON);
     }
     
     catch (e) {
       return ContentService
         .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
         .setMimeType(ContentService.MimeType.JSON);
     }
     
     finally {
       lock.releaseLock();
     }
   }

   function setup() {
     const doc = SpreadsheetApp.getActiveSpreadsheet();
     scriptProp.setProperty('key', doc.getId());
   }
   ```

3. **Deploy the Web App**:
   - Click on "Run" > "Run function" > "setup"
   - Click on "Deploy" > "New deployment"
   - Click the gear icon next to "Select type" and choose "Web app"
   - Set "Execute as" to "Me"
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
   - Copy the Web App URL provided in the deployment confirmation

4. **Update Your Website**:
   - In the `index.html` file, find the line containing `const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';`
   - Replace `'YOUR_GOOGLE_SCRIPT_URL_HERE'` with the Web App URL you copied
   - Save the file and deploy your website

5. **Test the Form**:
   - When testing locally, the form will simulate success without actually submitting to Google Sheets
   - Once deployed to GitHub Pages, visit your website and submit the form with a test email
   - Check your Google Sheet to confirm the data was received correctly

**Note**: 
- Google Apps Script has quotas for daily executions. If you expect high traffic, consider using a more robust solution.
- The form uses 'no-cors' mode to handle CORS issues, which means you won't get detailed error messages if the submission fails, but it helps work around cross-origin restrictions.
- Local testing simulates success without actually submitting to Google Sheets to avoid CORS errors during development.

## Credits

- Logo design: RugThief
- Website design: 90s lo-fi aesthetic