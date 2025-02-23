import Image from 'next/image';

export const AvailableReservationIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="#17c964" strokeWidth="2.7" />
    </svg>
  );
};

export const FewLeftReservationIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="12,4 20,18 4,18"
        stroke="#f5a524"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
};

export const FullReservationIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="4" y1="4" x2="20" y2="20" stroke="#f31260" strokeWidth="2" />
      <line x1="20" y1="4" x2="4" y2="20" stroke="#f31260" strokeWidth="2" />
    </svg>
  );
};

export const UnavailableReservationIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="4" y1="12" x2="20" y2="12" stroke="gray" strokeWidth="2" />
    </svg>
  );
};

export const ReservationIcon = ({ ratio }: { ratio?: number }) => {
  if (ratio === undefined) {
    return <UnavailableReservationIcon />;
  }

  if (ratio === 0) {
    return <FullReservationIcon />;
  }

  if (ratio <= 0.3) {
    return <FewLeftReservationIcon />;
  }

  if (ratio <= 1) {
    return <AvailableReservationIcon />;
  }

  return <UnavailableReservationIcon />;
};

export const TrainIcon = () => {
  return <Image src="/trainIcon.svg" alt="Train icon" width={24} height={24} />;
};
