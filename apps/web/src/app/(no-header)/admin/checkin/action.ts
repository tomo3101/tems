'use server';

import { auth } from '@/auth';
import { hcWithAuth } from '@/utils/hc';

export const getReservaionWithQr = async (qrCodeHash: string) => {
  const session = await auth();

  if (session) {
    const client = hcWithAuth(session.user.accessToken);

    const rowResponse = await client.api.v1.reservations.qrcode[
      ':qrCodeHash'
    ].$get({
      param: {
        qrCodeHash: qrCodeHash,
      },
    });

    if (rowResponse.ok) {
      const reservation = await rowResponse.json();

      if (reservation.status === 'checked_in') {
        return {
          status: 'エラー',
          message: 'チェックイン済みです。',
        };
      }

      if (reservation.status === 'called' || reservation.status === 'done') {
        return {
          status: 'エラー',
          message: '呼出済みです。',
        };
      }

      if (reservation.status === 'cancelled') {
        return {
          status: 'エラー',
          message: 'キャンセル済みです。',
        };
      }

      return {
        reservation: reservation,
      };
    }

    if (rowResponse.status === 404) {
      return {
        status: 'エラー',
        message: '予約が見つかりませんでした。',
      };
    }

    return {
      status: 'error',
      message: '通信エラーが発生しました。もう一度やり直してください。',
    };
  }
};
