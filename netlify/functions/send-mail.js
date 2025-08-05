const nodemailer = require("nodemailer");

exports.handler = async function (event, context) {
  const data = JSON.parse(event.body);
    // お客様への自動返信メール
  // 金額だけ抽出（例：3時間（￥30,000）→ ￥30,000）
  const coursePriceMatch = data.course.match(/￥[\d,]+/);
  const coursePrice = coursePriceMatch ? coursePriceMatch[0] : "（金額未記載）";

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
    text: `合計金額：${coursePrice}（税込）
お名前: ${data.name}
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

  const userMailOptions = {
    from: process.env.GMAIL_USER,
    to: data.email,
    subject: "【LEAD】ご予約ありがとうございます",
    text: `※このメールは自動送信です。返信の必要はございません。

${data.name} 様

この度は、LEADのご予約フォームよりお申し込みいただき誠にありがとうございます。
以下の通り、ご入力内容を確認いたしました。

※現時点ではまだ予約確定ではありません。
担当スタッフが内容を確認後、改めて【予約確定メール】をお送りしますので今しばらくお待ちください。

───────────────
【ご予約内容】
▶︎ご利用予定日：${data.date}
▶︎開始時間：${data.time}〜
▶︎ご希望コース：${data.course}
▶︎その他：${data.others}
▶︎セラピスト：${data.therapist}
▶︎待ち合わせについて：${data.meeting_place}
▶︎最寄駅・場所について：${data.meeting_detail}
▶︎お支払い方法：${data.payment}
▶︎割引申告：${data.discount}
▶︎ご要望・備考：${data.notes}

───────────────
【料金小計】
${coursePrice}（税込）
※交通費や割引については、予約確定後に担当スタッフからのメールでご案内いたします。

⸻

【お客様情報】
・お名前（ペンネーム可）：${data.name}
・電話番号：${data.phone}
・メールアドレス：${data.email}

───────────────
ご不明点やご希望がある場合は、予約確定後に送付されるメールにご返信いただければ対応可能です。

それでは、ご案内まで今しばらくお待ちいただきますようお願いいたします。

LEAD事務局`
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