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

   // Handle both GET and POST requests for flexible integration
   function doGet(e) {
     return handleRequest(e);
   }

   function doPost(e) {
     return handleRequest(e);
   }

   function handleRequest(e) {
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
       
       // Check if JSONP callback is provided
       if (e.parameter.callback) {
         // Return JSONP response
         return ContentService
           .createTextOutput(e.parameter.callback + '(' + JSON.stringify({ 'result': 'success', 'row': nextRow }) + ')')
           .setMimeType(ContentService.MimeType.JAVASCRIPT);
       } else {
         // Return regular JSON response
         return ContentService
           .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
           .setMimeType(ContentService.MimeType.JSON);
       }
     }
     
     catch (error) {
       // Return error as JSONP if callback is provided
       if (e.parameter.callback) {
         return ContentService
           .createTextOutput(e.parameter.callback + '(' + JSON.stringify({ 'result': 'error', 'error': error.toString() }) + ')')
           .setMimeType(ContentService.MimeType.JAVASCRIPT);
       } else {
         return ContentService
           .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
           .setMimeType(ContentService.MimeType.JSON);
       }
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

5. **Re-Deploy the Google Apps Script**:
   - **IMPORTANT**: If you already deployed your Google Apps Script, you need to update it with the new code above and re-deploy it
   - After pasting the new code, click "Deploy" > "New deployment" again
   - Select "Web app" type, set Execute as "Me" and Who has access to "Anyone"
   - This will generate a new URL, but you don't need to update it in your HTML if you're using the same script

6. **Test the Form**:
   - Visit your live site at https://stanchak.github.io/RugThief/
   - Submit the form with a test email
   - Check your Google Sheet to confirm the data was received correctly
   - The form should now work properly in production

**How the New Solution Works**:
- The new form submission uses JSONP (JSON with Padding) to overcome CORS restrictions
- It sends data via a dynamically created script tag rather than using fetch()
- The script includes a callback function that processes the response from Google
- A fallback mechanism assumes success after 3 seconds if no response is received
- The Google Apps Script now handles both GET and POST requests for better flexibility

## Credits

- Logo design: RugThief
- Website design: 90s lo-fi aesthetic