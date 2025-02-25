import type { FC } from 'react';

interface CheckedInTemplateProps {
  name: string;
  reservation: {
    id: number;
    callNumber: number;
    numberOfPeople: number;
  };
  event: {
    name: string;
    date: string;
    startTime: string;
    endTime: string;
  };
}

export const CheckedInTemplate: FC<Readonly<CheckedInTemplateProps>> = ({
  name,
  reservation,
  event,
}) => (
  <>
    <h2>{name} 様</h2>

    <div>
      <p>
        鉄道模型イーナクラブをご利用くださいまして、ありがとうございます。
        <br />
        {event.name}のチェックインが完了しましたのでお知らせいたします。
      </p>
    </div>

    <div>
      <p>
        受付番号：{reservation.callNumber} でお呼び出しいたします。
        <br />
        順番が近づきましたら、メールにてお知らせいたします。
        <br />
        順番まで、しばらくお待ちください。
      </p>

      <p>
        ※鉄道模型イーナクラブ
        TEMSの「順番待ち状況」画面で現在の順番待ち状況をご確認いただけます。
        <br />
        <a
          href={`https://tems.ozasa.dev/waiting/reservation/${reservation.id}`}
        >
          https://tems.ozasa.dev/waiting/reservation/{reservation.id}
        </a>
      </p>
    </div>

    <h3>ご予約内容は以下のとおりです。</h3>

    <h4>予約番号：{reservation.id}</h4>

    <div>
      <p>
        名称：{event.name}
        <br />
        日付：{event.date}
        <br />
        時間：{event.startTime}~{event.endTime}
        <br />
        ご利用人数：{reservation.numberOfPeople}名
        <br />
        受付番号：{reservation.callNumber}
      </p>
    </div>

    <div>
      <p>
        ※鉄道模型イーナクラブ TEMSの「予約確認」画面でもご確認いただけます。
        <br />
        <a href="https://tems.ozasa.dev/mypage/reservation">
          https://tems.ozasa.dev/mypage/reservation
        </a>
      </p>
      <p>※このメールアドレスは送信専用です。</p>
    </div>
  </>
);
