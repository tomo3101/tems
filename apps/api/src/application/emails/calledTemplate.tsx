import type { FC } from 'react';

interface CalledTemplateProps {
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

export const CallUpcomingTemplate: FC<Readonly<CalledTemplateProps>> = ({
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
        お客様のお呼び出し順番が近づいてまいりましたのでお知らせいたします。
        <br />
        お早めに会場にお越しください。
      </p>
    </div>

    <div>
      <p>
        受付番号：{reservation.callNumber} でお呼び出しいたします。
        <br />
        順番になりましたら、再度メールにてお知らせいたします。
        <br />
        順番まで、しばらくお待ちください。
      </p>

      <p>
        ※鉄道模型イーナクラブ
        TEMSの「順番待ち状況」画面で現在の順番待ち状況をご確認いただけます。
        <br />
        <a
          href={`https://tems-dev.ozasa.dev/waiting/reservation/${reservation.id}`}
        >
          https://tems-dev.ozasa.dev/waiting/reservation/{reservation.id}
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
        <a href="https://tems-dev.ozasa.dev/mypage/reservation">
          https://tems-dev.ozasa.dev/mypage/reservation
        </a>
      </p>
      <p>※このメールアドレスは送信専用です。</p>
    </div>
  </>
);

export const CalledTemplate: FC<Readonly<CalledTemplateProps>> = ({
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
        お客様のお呼び出し順番になりましたのでお知らせいたします。
        <br />
        会場の運転台までお越しください。
        <br />
      </p>
      <p>
        ※すぐにお越しいただけない場合は、次のお客様をお呼び出しさせていただきます。
        <br />
        ※15分以内にお越しいただけない場合は、キャンセルとさせていただきます。
      </p>
    </div>

    <div>
      <p>
        ※鉄道模型イーナクラブ
        TEMSの「順番待ち状況」画面で現在の順番待ち状況をご確認いただけます。
        <br />
        <a
          href={`https://tems-dev.ozasa.dev/waiting/reservation/${reservation.id}`}
        >
          https://tems-dev.ozasa.dev/waiting/reservation/{reservation.id}
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
        <a href="https://tems-dev.ozasa.dev/mypage/reservation">
          https://tems-dev.ozasa.dev/mypage/reservation
        </a>
      </p>
      <p>※このメールアドレスは送信専用です。</p>
    </div>
  </>
);
