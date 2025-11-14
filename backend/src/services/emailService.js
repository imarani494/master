const { transporter } = require("../config/email");

// Send lead assigned email
const sendLeadAssignedEmail = async (assignee, lead, assigner) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: assignee.email,
      subject: "New Lead Assigned to You",
      html: `
        <h2>New Lead Assignment</h2>
        <p>Hello ${assignee.name},</p>
        <p>${assigner.name} has assigned you a new lead:</p>
        <ul>
          <li><strong>Name:</strong> ${lead.name}</li>
          <li><strong>Email:</strong> ${lead.email}</li>
          <li><strong>Company:</strong> ${lead.company || "N/A"}</li>
          <li><strong>Status:</strong> ${lead.status}</li>
        </ul>
        <p>Please log in to the CRM to view details and take action.</p>
        <p>Best regards,<br>CRM System</p>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Send status change email
const sendStatusChangeEmail = async (user, lead, oldStatus, newStatus) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Lead Status Updated: ${lead.name}`,
      html: `
        <h2>Lead Status Updated</h2>
        <p>Hello ${user.name},</p>
        <p>The status of lead <strong>${lead.name}</strong> has been updated:</p>
        <p><strong>Previous Status:</strong> ${oldStatus}</p>
        <p><strong>New Status:</strong> ${newStatus}</p>
        <p>Please log in to the CRM for more details.</p>
        <p>Best regards,<br>CRM System</p>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = {
  sendLeadAssignedEmail,
  sendStatusChangeEmail
};
