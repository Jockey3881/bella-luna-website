export async function onRequestPost(context) {
  try {
    // 1. Parse the form data
    const formData = await context.request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const date = formData.get("date");
    const message = formData.get("message");

    // 2. Validate inputs
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // 3. Prepare the email data for Brevo API
    const emailData = {
      // SENDER: Must be your verified email address "dev@gigavend.com"
      sender: { name: "Bella Luna Website", email: "dev@gigavend.com" },
      
      // TO: The email address where you want to receive the inquiries
      to: [{ email: "garyhouck@gmail.com", name: "Bella Luna Team" }], 
      
      subject: `New Yacht Charter Inquiry from ${name}`,
      htmlContent: `
        <h3>New Charter Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Preferred Date:</strong> ${date}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // 4. Send to Brevo API
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        // IMPORTANT: The header for Brevo API keys (starting with xkeysib-) is 'api-key'
        "api-key": context.env.BREVO_API_KEY 
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        // Return the specific error from Brevo so we can see it in the browser console/screen
        return new Response(JSON.stringify({ error: "Failed to send email", details: errorText }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Email sent successfully!" }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error", details: err.message }), { status: 500 });
  }
}
