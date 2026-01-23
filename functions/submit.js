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
      sender: { name: "Bella Luna Website", email: "no-reply@bellaluna-charters.com" },
      to: [{ email: "garyhouck@gmail.com", name: "Bella Luna Team" }], // Your email is set here
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

    // 4. Send to Brevo
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": context.env.BREVO_API_KEY // This grabs the key from Cloudflare settings
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        return new Response(JSON.stringify({ error: "Failed to send email", details: errorText }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Email sent successfully!" }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error", details: err.message }), { status: 500 });
  }
}
