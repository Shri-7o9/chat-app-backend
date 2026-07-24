// Uses Brevo's REST API directly via the built-in fetch (Node 18+), so no
// extra SDK dependency is needed. https://developers.brevo.com/reference/sendtransacemail
const sendMail = async ({ email, subject, html }) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: process.env.EMAIL_FROM_NAME || "ChatApp",
          email: process.env.EMAIL_FROM,
        },
        to: [{ email }],
        subject,
        htmlContent: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send email via Brevo");
    }

    console.log("Email sent successfully:", data.messageId);
  } catch (error) {
    console.error("Email Error:", error.message);
    throw error;
  }
};

export default sendMail;

