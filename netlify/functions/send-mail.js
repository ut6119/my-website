const nodemailer = require("nodemailer");

exports.handler = async function (event, context) {
  const data = JSON.parse(event.body);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: "nhnskk77@gmail.com",
    subject: `${data.date} ${data.time} ${data.course}`,
    text: `お名前: ${data.name}
電話番号: ${data.phone}
メール: ${data.email}
ご希望日: ${data.date}
ご希望時間: ${data.time}
コース: ${data.course}
決済方法: ${data.payment}
ご要望・その他: ${data.notes}`
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "送信が成功しました！" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "送信に失敗しました…" }),
    };
  }
};