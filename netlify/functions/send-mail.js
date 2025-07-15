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
ご希望セラピスト: ${data.therapist}
ご希望コース: ${data.course}
その他: ${data.others}
ご希望日: ${data.date}
待ち合わせ時間: ${data.time}
待ち合わせ場所: ${data.meeting_place}
最寄駅・指定場所について: ${data.meeting_detail}
お支払い方法: ${data.payment}
ご要望・その他: ${data.notes}
割引申告: ${data.discount}`
};

  // お客様への自動返信メール
const userMailOptions = {
  from: process.env.GMAIL_USER,
  to: data.email,
  subject: "【LEAD】ご予約ありがとうございます",
  text: `${data.name} 様

※このメールは自動返信です。

このたびはご予約ありがとうございます。
受付を承りました。

事務局より改めてご連絡いたしますので、しばらくお待ちくださいませ。

【送信内容確認】
ご希望セラピスト: ${data.therapist}
ご希望コース: ${data.course}
その他: ${data.others}
ご希望日: ${data.date}
待ち合わせ時間: ${data.time}
待ち合わせ場所: ${data.meeting_place}
最寄駅・指定場所について: ${data.meeting_detail}
お支払い方法: ${data.payment}
ご要望・その他: ${data.notes}
割引申告: ${data.discount}

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