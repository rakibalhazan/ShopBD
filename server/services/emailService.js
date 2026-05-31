import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ── HTML email template ──────────────────────────────────────────
const buildOrderEmail = (order) => {
  const itemsHTML = order.items.map(i => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">
        <strong style="color:#1C1C1E;">${i.name}</strong>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:center;color:#6C6C70;">${i.qty}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:700;color:#1C1C1E;">৳${(i.price * i.qty).toLocaleString()}</td>
    </tr>`).join('');

  const paymentBadgeColor = { COD: '#34C759', bKash: '#E2146C', Nagad: '#F5820D' };
  const statusColor = { pending: '#FF9500', processing: '#006FD6', shipped: '#8B5CF6', delivered: '#34C759' };

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0F2F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#006FD6 0%,#004EAB 100%);padding:36px 32px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:26px;font-weight:800;letter-spacing:-0.5px;">
        🛍️ ShopBD
      </h1>
      <p style="color:rgba(255,255,255,.75);margin:6px 0 0;font-size:14px;">New Order Alert</p>
    </div>

    <!-- Order number banner -->
    <div style="background:#F7F7F9;padding:20px 32px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #E5E5EA;">
      <div>
        <p style="margin:0;font-size:12px;color:#8E8E93;text-transform:uppercase;letter-spacing:1px;">Order Number</p>
        <p style="margin:4px 0 0;font-size:22px;font-weight:800;color:#006FD6;">${order.orderNumber}</p>
      </div>
      <span style="background:${statusColor[order.status] || '#FF9500'}18;color:${statusColor[order.status] || '#FF9500'};font-size:12px;font-weight:700;padding:6px 14px;border-radius:20px;text-transform:uppercase;">
        ${order.status}
      </span>
    </div>

    <div style="padding:28px 32px;">

      <!-- Customer details -->
      <h3 style="font-size:14px;font-weight:700;color:#8E8E93;text-transform:uppercase;letter-spacing:.8px;margin:0 0 14px;">Customer Details</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#8E8E93;width:35%;">Name</td>
          <td style="padding:6px 0;font-size:13px;font-weight:600;color:#1C1C1E;">${order.customer.name}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#8E8E93;">Phone</td>
          <td style="padding:6px 0;font-size:13px;font-weight:600;color:#1C1C1E;">${order.customer.phone}</td>
        </tr>
        ${order.customer.email ? `
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#8E8E93;">Email</td>
          <td style="padding:6px 0;font-size:13px;font-weight:600;color:#1C1C1E;">${order.customer.email}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#8E8E93;">Address</td>
          <td style="padding:6px 0;font-size:13px;font-weight:600;color:#1C1C1E;">
            ${order.customer.address.street}, ${order.customer.address.upazila || ''}, 
            ${order.customer.address.district}, ${order.customer.address.division}
          </td>
        </tr>
        ${order.customer.note ? `
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#8E8E93;">Note</td>
          <td style="padding:6px 0;font-size:13px;color:#6C6C70;font-style:italic;">${order.customer.note}</td>
        </tr>` : ''}
      </table>

      <!-- Items -->
      <h3 style="font-size:14px;font-weight:700;color:#8E8E93;text-transform:uppercase;letter-spacing:.8px;margin:0 0 14px;">Order Items</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;border-radius:12px;overflow:hidden;border:1px solid #E5E5EA;">
        <thead>
          <tr style="background:#F7F7F9;">
            <th style="padding:10px 12px;text-align:left;font-size:11px;color:#8E8E93;text-transform:uppercase;letter-spacing:.6px;">Product</th>
            <th style="padding:10px 12px;text-align:center;font-size:11px;color:#8E8E93;text-transform:uppercase;letter-spacing:.6px;">Qty</th>
            <th style="padding:10px 12px;text-align:right;font-size:11px;color:#8E8E93;text-transform:uppercase;letter-spacing:.6px;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHTML}</tbody>
      </table>

      <!-- Payment -->
      <h3 style="font-size:14px;font-weight:700;color:#8E8E93;text-transform:uppercase;letter-spacing:.8px;margin:0 0 14px;">Payment</h3>
      <div style="background:#F7F7F9;border-radius:12px;padding:16px 18px;margin-bottom:24px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:${order.payment.txnId ? '10px' : '0'};">
          <span style="background:${paymentBadgeColor[order.payment.method]}18;color:${paymentBadgeColor[order.payment.method]};font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;">
            ${order.payment.method}
          </span>
          <span style="font-size:13px;color:#3C3C43;">${
            order.payment.method === 'COD'
              ? 'Customer will pay on delivery'
              : 'Digital payment'
          }</span>
        </div>
        ${order.payment.txnId ? `
        <p style="margin:0;font-size:13px;color:#3C3C43;">
          Transaction ID: <strong style="color:#1C1C1E;">${order.payment.txnId}</strong>
        </p>
        <p style="margin:4px 0 0;font-size:13px;color:#3C3C43;">
          ${order.payment.method} Number: <strong style="color:#1C1C1E;">${order.payment.number || '—'}</strong>
        </p>` : ''}
      </div>

      <!-- Price breakdown -->
      <div style="border-top:2px solid #E5E5EA;padding-top:16px;">
        <table style="width:100%;">
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#6C6C70;">Subtotal</td>
            <td style="padding:5px 0;font-size:13px;text-align:right;color:#1C1C1E;">৳${order.subtotal.toLocaleString()}</td>
          </tr>
          ${order.discount > 0 ? `
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#34C759;">Discount</td>
            <td style="padding:5px 0;font-size:13px;text-align:right;color:#34C759;">−৳${order.discount.toLocaleString()}</td>
          </tr>` : ''}
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#6C6C70;">Delivery</td>
            <td style="padding:5px 0;font-size:13px;text-align:right;color:#1C1C1E;">
              ${order.deliveryFee === 0 ? '<span style="color:#34C759;">Free</span>' : '৳' + order.deliveryFee}
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0 0;font-size:16px;font-weight:800;color:#1C1C1E;">Total</td>
            <td style="padding:10px 0 0;font-size:18px;font-weight:800;text-align:right;color:#006FD6;">৳${order.total.toLocaleString()}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#F7F7F9;padding:20px 32px;text-align:center;border-top:1px solid #E5E5EA;">
      <p style="margin:0;font-size:12px;color:#8E8E93;">
        This is an automated notification from ShopBD.<br>
        Placed on ${new Date(order.createdAt || Date.now()).toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })}
      </p>
    </div>
  </div>
</body>
</html>`;
};

// ── Send order notification ──────────────────────────────────────
export const sendOrderNotification = async (order) => {
  try {
    await transporter.sendMail({
      from:    `"ShopBD Orders" <${process.env.GMAIL_USER}>`,
      to:      process.env.GMAIL_USER,   // rakibalhazan@gmail.com
      subject: `🛍️ New Order ${order.orderNumber} — ৳${order.total.toLocaleString()} (${order.payment.method})`,
      html:    buildOrderEmail(order),
    });
    console.log(`📧 Order email sent for ${order.orderNumber}`);
    return true;
  } catch (err) {
    console.error('📧 Email error:', err.message);
    return false;
  }
};

// ── Verify transporter on startup ────────────────────────────────
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('📧 Gmail SMTP connected — emails ready');
  } catch (err) {
    console.warn('📧 Gmail SMTP warning:', err.message);
    console.warn('   → Check GMAIL_USER and GMAIL_APP_PASSWORD in .env');
  }
};
