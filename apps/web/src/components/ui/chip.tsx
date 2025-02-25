'use client';

import { Reservation } from '@/utils/hc';
import {
  BellAlertIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { Chip, ChipProps } from '@heroui/chip';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export const TagChip = (props: ChipProps & { children: React.ReactNode }) => {
  const { children, ...chipProps } = props;
  return (
    <Chip {...chipProps} startContent={<TagIcon className="size-6" />}>
      {children}
    </Chip>
  );
};

export const TimeChip = (props: ChipProps & { time: string }) => {
  const { time, ...chipProps } = props;
  const [dateTime, setDateTime] = useState<string>();
  const [timeString, setTimeString] = useState<string>();

  useEffect(() => {
    const date = dayjs(time);
    setDateTime(date.format('YYYY-MM-DD'));
    setTimeString(date.format('YYYY/MM/DD'));
  }, [time]);

  return (
    <Chip {...chipProps} startContent={<ClockIcon className="size-6" />}>
      <time suppressHydrationWarning dateTime={dateTime}>
        {timeString}
      </time>
    </Chip>
  );
};

export const StatusChip = (
  props: ChipProps & { status: Reservation['status'] },
) => {
  const { status, ...chipProps } = props;

  switch (status) {
    case 'reserved':
      return (
        <Chip
          {...chipProps}
          color="warning"
          startContent={<ExclamationCircleIcon className="size-6" />}
        >
          未チェックイン
        </Chip>
      );

    case 'cancelled':
      return (
        <Chip {...chipProps} color="default">
          キャンセル
        </Chip>
      );

    case 'checked_in':
      return (
        <Chip
          {...chipProps}
          color="success"
          startContent={<CheckCircleIcon className="size-6" />}
        >
          チェックイン済み
        </Chip>
      );

    case 'called':
      return (
        <Chip
          {...chipProps}
          color="primary"
          startContent={<BellAlertIcon className="size-6" />}
        >
          呼出中
        </Chip>
      );

    case 'done':
      return (
        <Chip {...chipProps} color="default">
          呼出済み
        </Chip>
      );
  }
};
