import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const contactSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    // Save to DB
    await prisma.contactMessage.create({ data });

    // Send email if configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      await transporter.sendMail({
        from: `"Portfolio" <${process.env.SMTP_USER}>`,
        to:   process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        subject: `[Portfolio] ${data.subject}`,
        html: `
          <div style="font-family: monospace; background: #04060f; color: #00f5ff; padding: 24px; border: 1px solid #00f5ff;">
            <h2 style="color: #ff0080;">Nuevo mensaje de ${data.name}</h2>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Asunto:</strong> ${data.subject}</p>
            <hr style="border-color: #00f5ff33;" />
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, message: 'Mensaje enviado correctamente' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: err.errors }, { status: 400 });
    }
    console.error('Contact error:', err);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
