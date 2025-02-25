'use server';

import { auth } from '@/auth';
import { hcWithAuth } from '@/utils/hc';
import { putReservationsBodySchema } from 'api/schema/reservationSchema';

export const fetchEvents = async () => {
  const session = await auth();
  if (!session) return;

  const client = hcWithAuth(session.user.accessToken);

  const rowResult = await client.api.v1.events.$get({
    query: {},
  });

  if (!rowResult.ok) return;

  return await rowResult.json();
};

export const deleteEvent = async (eventId: number) => {
  const session = await auth();
  if (!session) return false;

  const client = hcWithAuth(session.user.accessToken);

  const rowResult = await client.api.v1.events[':id'].$delete({
    param: { id: eventId.toString() },
  });

  return rowResult.ok;
};

export const createEvent = async (form: FormData) => {
  const session = await auth();
  if (!session) return false;

  const client = hcWithAuth(session.user.accessToken);

  const name = form.get('name')?.toString();
  const date = form.get('date')?.toString();
  const startTime = form.get('startTime')?.toString();
  const endTime = form.get('endTime')?.toString();
  const capacity = form.get('capacity')?.toString();

  if (!name || !date || !startTime || !endTime || !capacity) return false;

  const rowResult = await client.api.v1.events.$post({
    json: {
      name: name,
      date: date,
      startTime: startTime,
      endTime: endTime,
      capacity: parseInt(capacity),
    },
  });

  return rowResult.ok;
};

export const editEvent = async (
  eventId: number | undefined,
  form: FormData,
) => {
  const session = await auth();
  if (!session) return false;

  const client = hcWithAuth(session.user.accessToken);

  const name = form.get('name')?.toString();
  const date = form.get('date')?.toString();
  const startTime = form.get('startTime')?.toString();
  const endTime = form.get('endTime')?.toString();
  const capacity = form.get('capacity')?.toString();

  if (!eventId || !name || !date || !startTime || !endTime || !capacity)
    return false;

  const rowResult = await client.api.v1.events[':id'].$put({
    param: { id: eventId.toString() },
    json: {
      name: name,
      date: date,
      startTime: startTime,
      endTime: endTime,
      capacity: parseInt(capacity),
    },
  });

  if (rowResult.ok) {
    const response = await rowResult.json();
    console.log(response);
  }

  return rowResult.ok;
};

export const fetchReservations = async () => {
  const session = await auth();
  if (!session) return;

  const client = hcWithAuth(session.user.accessToken);

  const rowResult = await client.api.v1.reservations.$get({
    query: {},
  });

  if (!rowResult.ok) return;

  return await rowResult.json();
};

export const editReservation = async (
  reservationId: number | undefined,
  form: FormData,
) => {
  const session = await auth();
  if (!session) return false;

  const client = hcWithAuth(session.user.accessToken);

  if (!reservationId) return false;

  const reservation = {
    numberOfPeople: Number(form.get('numberOfPeople')),
    status: form.get('status'),
  };

  const result = putReservationsBodySchema.safeParse(reservation);

  if (!result.success) return false;

  const rowResult = await client.api.v1.reservations[':id'].$put({
    param: { id: reservationId.toString() },
    json: {
      numberOfPeople: result.data.numberOfPeople,
      status: result.data.status,
    },
  });

  return rowResult.ok;
};

export const deleteReservation = async (reservationId: number) => {
  const session = await auth();
  if (!session) return false;

  const client = hcWithAuth(session.user.accessToken);

  const rowResult = await client.api.v1.reservations[':id'].$delete({
    param: { id: reservationId.toString() },
  });

  return rowResult.ok;
};

export const fetchMembers = async () => {
  const session = await auth();
  if (!session) return;

  const client = hcWithAuth(session.user.accessToken);

  const rowResult = await client.api.v1.members.$get({
    query: {},
  });

  if (!rowResult.ok) return;

  return await rowResult.json();
};

export const deleteMember = async (memberId: number) => {
  const session = await auth();
  if (!session) return false;

  const client = hcWithAuth(session.user.accessToken);

  const rowResult = await client.api.v1.members[':id'].$delete({
    param: { id: memberId.toString() },
  });

  return rowResult.ok;
};

export const fetchAdmins = async () => {
  const session = await auth();
  if (!session) return;

  const client = hcWithAuth(session.user.accessToken);

  const rowResult = await client.api.v1.admins.$get({
    query: {},
  });

  if (!rowResult.ok) return;

  return await rowResult.json();
};

export const createAdmin = async (form: FormData) => {
  const session = await auth();
  if (!session) return { success: false, message: 'セッションがありません' };

  const client = hcWithAuth(session.user.accessToken);

  const name = form.get('name')?.toString();
  const email = form.get('email')?.toString();
  const password = form.get('password')?.toString();
  const passwordConfirm = form.get('passwordConfirm')?.toString();

  if (!name || !email || !password || !passwordConfirm) {
    return {
      success: false,
      message: '全ての項目を入力してください',
    };
  }

  if (password !== passwordConfirm) {
    return {
      success: false,
      message: 'パスワードが一致しません',
    };
  }

  const rowResponce = await client.api.v1.admins.$post({
    json: {
      name: name,
      email: email,
      password: password,
    },
  });

  if (!rowResponce.ok) {
    if (rowResponce.status === 400) {
      const response = await rowResponce.json();
      console.log(response);
      if (response.error === 'email already exists') {
        return {
          success: false,
          message: 'メールアドレスが既に登録されています',
        };
      }
    }

    return {
      success: false,
      message: '登録に失敗しました',
    };
  }

  return {
    success: true,
    message: '登録に成功しました',
  };
};

export const deleteAdmin = async (adminId: number) => {
  const session = await auth();
  if (!session) return false;

  const client = hcWithAuth(session.user.accessToken);

  const rowResult = await client.api.v1.admins[':id'].$delete({
    param: { id: adminId.toString() },
  });

  return rowResult.ok;
};
