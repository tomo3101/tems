import { Resend } from 'resend';
import {
  CalledTemplate,
  CallUpcomingTemplate,
} from '../application/emails/calledTemplate.js';
import { CheckedInTemplate } from '../application/emails/checkedInTemplate.js';
import { ReservedTemplate } from '../application/emails/reservedTemplate.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendReservedEmail = async (
  email: string,
  name: string,
  reservation: {
    id: number;
    numberOfPeople: number;
  },
  event: {
    name: string;
    date: string;
    startTime: string;
    endTime: string;
  },
) => {
  const { data, error } = await resend.emails.send({
    from: '鉄道模型イーナクラブ <noreply@mail.ozasa.dev>',
    to: email,
    subject: `【${event.name}】予約完了のお知らせ`,
    react: (
      <ReservedTemplate name={name} reservation={reservation} event={event} />
    ),
  });

  if (error) {
    console.error(error);
    return;
  }

  console.log(data);
  return data;
};

export const sendCheckedInEmail = async (
  email: string,
  name: string,
  reservation: {
    id: number;
    callNumber: number;
    numberOfPeople: number;
  },
  event: {
    name: string;
    date: string;
    startTime: string;
    endTime: string;
  },
) => {
  const { data, error } = await resend.emails.send({
    from: '鉄道模型イーナクラブ <noreply@mail.ozasa.dev>',
    to: email,
    subject: `【${event.name}】チェックイン完了のお知らせ`,
    react: (
      <CheckedInTemplate name={name} reservation={reservation} event={event} />
    ),
  });

  if (error) {
    console.error(error);
    return;
  }

  console.log(data);
  return data;
};

export const sendCallUpcomingEmail = async (
  email: string,
  name: string,
  reservation: {
    id: number;
    callNumber: number;
    numberOfPeople: number;
  },
  event: {
    name: string;
    date: string;
    startTime: string;
    endTime: string;
  },
) => {
  const { data, error } = await resend.emails.send({
    from: '鉄道模型イーナクラブ <noreply@mail.ozasa.dev>',
    to: email,
    subject: `【${event.name}】お呼び出しの順番が近づきました`,
    react: (
      <CallUpcomingTemplate
        name={name}
        reservation={reservation}
        event={event}
      />
    ),
  });

  if (error) {
    console.error(error);
    return;
  }

  console.log(data);
  return data;
};

export const sendCalledEmail = async (
  email: string,
  name: string,
  reservation: {
    id: number;
    callNumber: number;
    numberOfPeople: number;
  },
  event: {
    name: string;
    date: string;
    startTime: string;
    endTime: string;
  },
) => {
  const { data, error } = await resend.emails.send({
    from: '鉄道模型イーナクラブ <noreply@mail.ozasa.dev>',
    to: email,
    subject: `【${event.name}】お呼び出しの順番になりました`,
    react: (
      <CalledTemplate name={name} reservation={reservation} event={event} />
    ),
  });

  if (error) {
    console.error(error);
    return;
  }

  console.log(data);
  return data;
};
