const nodemailer = require("nodemailer");

exports.handler = async function (event, context) {
  const data = JSON.parse(event.body);

  console.log("Customer email:", data.email);
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  // 管理者（あなた）への通知メール
  const adminMailOptions = {
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

  // お客様への自動返信メール
  const userMailOptions = {
    from: process.env.GMAIL_USER,
    to: data.email,
    subject: "【蒼人】ご予約ありがとうございます",
    text: `${data.name} 様

このたびはご予約ありがとうございます。
受付を承りました。

事務局より改めてご連絡いたしますので、しばらくお待ちくださいませ。

【送信内容確認】
ご希望日: ${data.date}
ご希望時間: ${data.time}
コース: ${data.course}
決済方法: ${data.payment}
ご要望・その他: ${data.notes}

※このメールは自動返信です。

事務局`
  };

  try {
    // 管理者へ送信
    await transporter.sendMail(adminMailOptions);
    // お客様へ送信
    await transporter.sendMail(userMailOptions);

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