import nodemailer from "nodemailer";

/* =========================
   EMAIL TRANSPORTER
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER as string,
    pass: process.env.MAIL_PASS as string,
  },
});

/* =========================
   REQUEST BOOK EMAIL
========================= */
export const sendRequestBookEmail = async (data: {
  userEmail: string;
  bookName: string;
  authorName: string;
  category: string;
  message?: string;
}) => {
  const { userEmail, bookName, authorName, category, message } = data;

  await transporter.sendMail({
    from: `"Bookify Request" <${process.env.MAIL_USER}>`,
    to: process.env.ADMIN_EMAIL as string,
    subject: "📚 New Book Request Received",
    html: `
      <h2>New Book Request</h2>
      <p><b>User Email:</b> ${userEmail}</p>
      <p><b>Book Name:</b> ${bookName}</p>
      <p><b>Author:</b> ${authorName}</p>
      <p><b>Category:</b> ${category}</p>
      <p><b>Message:</b> ${message || "N/A"}</p>
      <hr />
      <p>Bookify Website</p>
    `,
  });
};

/* =========================
   NEW BOOK NOTIFICATION EMAIL ✅
========================= */
export const sendNewBookNotification = async (data: {
  title: string;
  authorName: string;
  genre: string;
  userEmails?: string[];
}) => {
  const { title, authorName, genre, userEmails } = data;

  // fallback: admin ko email
  const recipients =
    userEmails && userEmails.length > 0
      ? userEmails
      : [process.env.ADMIN_EMAIL as string];

  await transporter.sendMail({
    from: `"Bookify Updates" <${process.env.MAIL_USER}>`,
    to: recipients,
    subject: "📢 New Book Added on Bookify",
    html: `
      <h2>📚 New Book Added!</h2>
      <p><b>Title:</b> ${title}</p>
      <p><b>Author:</b> ${authorName}</p>
      <p><b>Category:</b> ${genre}</p>
      <hr />
      <p>Visit Bookify to read now 🚀</p>
    `,
  });
};
