import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import streamBuffers from 'stream-buffers';

export const sendMail = async ({ to, subject, html, ticketDetails }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Generate PDF Ticket
  const doc = new PDFDocument();
  const bufferStream = new streamBuffers.WritableStreamBuffer();

  doc.pipe(bufferStream);
  doc.fontSize(20).text("🎟 EventEase Ticket", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Name: ${ticketDetails.userName}`);
  doc.text(`Event: ${ticketDetails.eventTitle}`);
  doc.text(`Venue: ${ticketDetails.venue}`);
  doc.text(`Date: ${ticketDetails.date}`);
  doc.text(`Time: ${ticketDetails.time}`);
  doc.text(`No. of Tickets: ${ticketDetails.noOfTickets}`);
  doc.text(`Amount Paid: ₹${ticketDetails.amount}`);
  doc.end();

  const attachmentBuffer = bufferStream.getContents();

  const mailOptions = {
    from: `"EventEase" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments: [
      {
        filename: "ticket.pdf",
        content: attachmentBuffer,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
