const formatDate = require("./formatDate");

function formatHeaders(headers) {
  let formattedHeaders = `<table style="width:100%; border-collapse: collapse;">`;

  for (const [key, value] of Object.entries(headers)) {
    formattedHeaders += `<tr class="title">
    <td class="title-cell">${key}</td>
    <td class="title-cell2">${value}</td>
  </tr>`;
  }
  formattedHeaders += "</table>";

  return formattedHeaders;
}

module.exports = function (req) {
  return `
    <html>
      <head>
        <style>
        .title { border: 1px solid #BBB; }
        .title-cell { border-right: 1px solid #BBB; padding: 5px; width: 200px; font-weight: bold; }
        .title-cell2 { padding: 5px; }
        </style>
      </head>
      <body>
        <table style="width:100%; border-collapse: collapse;">
          <tr class="title">
            <td class="title-cell">Sender</td>
            <td class="title-cell2">${req.body.name} (${req.body.email})</td>
          </tr>
          <tr class="title">
            <td class="title-cell">Phone</td>
            <td class="title-cell2">${req.body.phone}</td>
          </tr>
          <tr class="title">
            <td class="title-cell">Event Type</td>
            <td class="title-cell2">${req.body.event_type}</td>
          </tr>
          <tr class="title">
            <td class="title-cell">Event Date</td>
            <td class="title-cell2">${formatDate(req.body.date)}</td>
          </tr>
          <tr class="title">
            <td class="title-cell">Event Location</td>
            <td class="title-cell2">${req.body.location}</td>
          </tr>
          <tr class="title">
            <td class="title-cell">Message</td>
            <td class="title-cell2">${req.body.message}</td>
          </tr>
        </table><br /><br />
        <h2>Information About Sender</h2>
            ${formatHeaders(req.headers)}
      </body>
    </html>`;
};
