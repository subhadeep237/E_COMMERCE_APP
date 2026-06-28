import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  return transporter;
};

// ========== SEND OTP EMAIL ==========
export const sendOTPEmail = async (to, otp, purpose = "verification") => {
  try {
    const subject = purpose === "verification"
      ? "Verify Your Email - FOREVER"
      : "Reset Your Password - FOREVER";

    const heading = purpose === "verification"
      ? "Email Verification"
      : "Password Reset";

    const message = purpose === "verification"
      ? "Thanks for signing up! Use the OTP below to verify your email address."
      : "Use the OTP below to reset your password.";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #f5f5f5;">
        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">

          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #000 0%, #333 100%); color: white; width: 60px; height: 60px; line-height: 60px; border-radius: 12px; font-size: 32px; font-weight: bold;">
              F
            </div>
            <h1 style="color: #1f2937; margin-top: 15px; font-size: 28px;">FOREVER</h1>
          </div>

          <h2 style="color: #1f2937; text-align: center; margin-bottom: 10px;">${heading}</h2>

          <p style="color: #555; text-align: center; line-height: 24px; margin-bottom: 30px;">
            ${message}
          </p>

          <div style="background: #fce7f3; padding: 25px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
            <p style="color: #831843; font-size: 14px; margin-bottom: 10px;">Your OTP Code:</p>
            <h1 style="color: #1f2937; font-size: 42px; letter-spacing: 8px; margin: 0; font-weight: bold;">
              ${otp}
            </h1>
            <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">
              ⏱️ This OTP will expire in <b>10 minutes</b>
            </p>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #92400e; font-size: 13px; margin: 0;">
              🔒 <b>Security Tip:</b> Never share your OTP with anyone. Our team will never ask for your OTP.
            </p>
          </div>

          <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px;">
            If you didn't request this, please ignore this email.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">

          <p style="color: #9ca3af; font-size: 11px; text-align: center; margin: 0;">
            © 2025 FOREVER. All rights reserved.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"FOREVER" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await getTransporter().sendMail(mailOptions);
    console.log("✅ OTP Email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.log("❌ Email error:", error.message);
    return { success: false, error: error.message };
  }
};

// ========== ORDER CONFIRMATION EMAIL ==========
export const sendOrderConfirmationEmail = async (to, order, userName, productDetails = []) => {
  try {
    // Build items HTML
    const itemsHtml = order.items.map((item) => {
      const product = productDetails.find(p =>
        String(p._id) === String(item.productId)
      );

      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            ${product ? `<img src="${product.image[0]}" alt="${product.name}" style="width: 60px; height: 70px; object-fit: cover; border-radius: 4px;">` : ''}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <p style="margin: 0; font-weight: 600; color: #1f2937;">${product ? product.name : 'Product'}</p>
            <p style="margin: 5px 0 0; color: #6b7280; font-size: 13px;">
              Size: <b>${item.size}</b> | Qty: <b>${item.quantity}</b>
            </p>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600; color: #1f2937;">
            $${product ? (product.price * item.quantity) : '-'}
          </td>
        </tr>
      `;
    }).join("");

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 40px 20px; background: #f5f5f5;">
        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #000 0%, #333 100%); color: white; width: 60px; height: 60px; line-height: 60px; border-radius: 12px; font-size: 32px; font-weight: bold;">
              F
            </div>
            <h1 style="color: #1f2937; margin-top: 15px; font-size: 28px;">FOREVER</h1>
          </div>

          <!-- Success Banner -->
          <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h2 style="color: #166534; margin: 0; font-size: 26px;">🎉 Order Confirmed!</h2>
            <p style="color: #166534; margin-top: 10px; font-size: 14px;">Thank you for your purchase</p>
          </div>

          <!-- Greeting -->
          <p style="color: #1f2937; font-size: 16px;">Hi <b>${userName}</b>,</p>

          <p style="color: #555; line-height: 24px; margin-bottom: 25px;">
            Your order has been confirmed and is being processed. We'll send you another email when it ships!
          </p>

          <!-- Order Details -->
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #1f2937; margin-top: 0; font-size: 16px;">📋 Order Details</h3>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Order ID:</td>
                <td style="padding: 6px 0; color: #1f2937; font-weight: 600; text-align: right;">#${order._id.toString().slice(-8).toUpperCase()}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Order Date:</td>
                <td style="padding: 6px 0; color: #1f2937; font-weight: 600; text-align: right;">${new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Payment Method:</td>
                <td style="padding: 6px 0; color: #1f2937; font-weight: 600; text-align: right;">${order.paymentMethod}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Payment Status:</td>
                <td style="padding: 6px 0; color: ${order.paymentStatus === 'Paid' ? '#166534' : '#92400e'}; font-weight: 600; text-align: right;">${order.paymentStatus}</td>
              </tr>
            </table>
          </div>

          <!-- Order Items -->
          <h3 style="color: #1f2937; margin-bottom: 15px;">🛍️ Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
            ${itemsHtml}
            <tr>
              <td colspan="2" style="padding: 15px 12px; text-align: right; font-size: 18px; font-weight: 700; color: #1f2937;">Total:</td>
              <td style="padding: 15px 12px; text-align: right; font-size: 22px; font-weight: 700; color: #1f2937;">$${order.amount}</td>
            </tr>
          </table>

          <!-- Shipping Address -->
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #92400e; margin-top: 0; font-size: 16px;">📍 Shipping Address</h3>
            <p style="color: #78350f; margin: 0; line-height: 22px; font-size: 14px;">${order.address}</p>
          </div>

          <!-- Next Steps -->
          <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #1e40af; margin-top: 0; font-size: 16px;">📦 What's Next?</h3>
            <ul style="color: #1e3a8a; line-height: 24px; margin: 10px 0; padding-left: 20px;">
              <li>Your order is being prepared for shipping</li>
              <li>You'll receive shipping updates via email</li>
              <li>Track your order in your account dashboard</li>
            </ul>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">

          <p style="color: #9ca3af; font-size: 11px; text-align: center; margin: 0;">
            Questions? Reply to this email or visit our help center.<br>
            © 2025 FOREVER. All rights reserved.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"FOREVER" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Order Confirmed #${order._id.toString().slice(-8).toUpperCase()} - FOREVER`,
      html,
    };

    const info = await getTransporter().sendMail(mailOptions);
    console.log("✅ Order email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.log("❌ Order email error:", error.message);
    return { success: false, error: error.message };
  }
};

// ========== ORDER STATUS UPDATE EMAIL ==========
export const sendOrderStatusEmail = async (to, order, userName, newStatus) => {
  try {
    const statusInfo = {
      Processing: { emoji: '⚙️', color: '#3b82f6', bg: '#dbeafe', message: 'Your order is being prepared!' },
      Shipped: { emoji: '🚚', color: '#8b5cf6', bg: '#e9d5ff', message: 'Your order is on the way!' },
      Delivered: { emoji: '✅', color: '#22c55e', bg: '#dcfce7', message: 'Your order has been delivered!' },
      Cancelled: { emoji: '❌', color: '#ef4444', bg: '#fee2e2', message: 'Your order has been cancelled.' },
    };

    const info = statusInfo[newStatus] || statusInfo['Processing'];

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #f5f5f5;">
        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">

          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #000 0%, #333 100%); color: white; width: 60px; height: 60px; line-height: 60px; border-radius: 12px; font-size: 32px; font-weight: bold;">
              F
            </div>
            <h1 style="color: #1f2937; margin-top: 15px; font-size: 28px;">FOREVER</h1>
          </div>

          <div style="background: ${info.bg}; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 25px;">
            <div style="font-size: 60px; margin-bottom: 10px;">${info.emoji}</div>
            <h2 style="color: ${info.color}; margin: 0; font-size: 24px;">Order ${newStatus}</h2>
            <p style="color: ${info.color}; margin-top: 8px; font-size: 14px;">${info.message}</p>
          </div>

          <p style="color: #1f2937; font-size: 16px;">Hi <b>${userName}</b>,</p>

          <p style="color: #555; line-height: 24px;">
            Your order <b>#${order._id.toString().slice(-8).toUpperCase()}</b> status has been updated to <b style="color: ${info.color};">${newStatus}</b>.
          </p>

          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0; color: #1f2937;"><b>Order ID:</b> ${order._id}</p>
            <p style="margin: 5px 0; color: #1f2937;"><b>Total:</b> $${order.amount}</p>
            <p style="margin: 5px 0; color: #1f2937;"><b>Items:</b> ${order.items.length}</p>
          </div>

          ${newStatus === 'Delivered' ? `
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; text-align: center;">
              <p style="color: #92400e; margin: 0;">🌟 Loved the product? Leave a review!</p>
            </div>
          ` : ''}

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">

          <p style="color: #9ca3af; font-size: 11px; text-align: center; margin: 0;">
            © 2025 FOREVER. All rights reserved.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"FOREVER" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Order ${newStatus} #${order._id.toString().slice(-8).toUpperCase()} - FOREVER`,
      html,
    };

    const info2 = await getTransporter().sendMail(mailOptions);
    console.log("✅ Status update email sent:", info2.messageId);
    return { success: true };
  } catch (error) {
    console.log("❌ Status email error:", error.message);
    return { success: false, error: error.message };
  }
};

// ========== TEST EMAIL ==========
export const sendTestEmail = async (to) => {
  try {
    const mailOptions = {
      from: `"FOREVER" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Test Email from FOREVER",
      html: `<div style="font-family: Arial; padding: 40px; text-align: center;"><h1>✅ Test Email Working!</h1></div>`,
    };
    const info = await getTransporter().sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};