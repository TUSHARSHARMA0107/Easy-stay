// controllers/redirectController.js

export const handleExternalRedirect = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url || !url.startsWith("http")) {
      return res.status(400).send("Invalid or missing URL");
    }

    // Simple confirmation HTML before redirect
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Redirecting to official booking site</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f9f9f9;
            padding-top: 100px;
          }
          .box {
            background: white;
            padding: 40px;
            border-radius: 15px;
            display: inline-block;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          button {
            background: #0078ff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
          }
          button:hover {
            background: #005fcc;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h2>You're leaving our app</h2>
          <p>You’re being redirected to the official site to complete your booking.</p>
          <p><strong>Make sure the website looks secure before entering payment details.</strong></p>
          <button onclick="window.location.href='${url}'">Continue to official site</button>
        </div>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).send("Server error while redirecting");
  }
};