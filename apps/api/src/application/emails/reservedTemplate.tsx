import type { FC } from 'react';

interface ReservedTemplateProps {
  name: string;
  reservation: {
    id: number;
    numberOfPeople: number;
  };
  event: {
    name: string;
    date: string;
    startTime: string;
    endTime: string;
  };
}

export const ReservedTemplate: FC<Readonly<ReservedTemplateProps>> = ({
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
        {event.name}の予約が完了しましたのでお知らせいたします。
      </p>
    </div>

    <div>
      <p>
        ※このメールは整理券としての効力はありません。
        <br />
        ※ご利用の際は、予約当日に会場の受付機にてチェックインをお願いいたします。
      </p>
    </div>

    <h3>お取り扱い内容は以下のとおりです。</h3>

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
      </p>
    </div>

    <div>
      <p>
        ※鉄道模型イーナクラブ TEMSの「予約確認」画面でもご確認いただけます。
        <br />
        <a href="https://tems-dev.ozasa.dev/mypage/reservation">
          https://tems-dev.ozasa.dev/mypage/reservation
        </a>
      </p>
      <p>※このメールアドレスは送信専用です。</p>
    </div>
  </>
);
