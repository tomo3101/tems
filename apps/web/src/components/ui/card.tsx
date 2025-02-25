import { Card, CardBody, CardHeader } from '@heroui/card';

export const UsageNotesCard = () => {
  return (
    <Card>
      <CardHeader className="flex justify-center">
        <h2 className="text-2xl text-center font-medium [&>span]:inline-block">
          <span>ご利用上の</span>
          <span>注意事項</span>
        </h2>
      </CardHeader>
      <CardBody className="text-lg text-center [&_span]:inline-block">
        <p>
          <span>各回先着順(20名様)</span>
          <span>となります。</span>
        </p>
        <p>
          <span>小学生以下のお客様を</span>
          <span>優先とします。</span>
        </p>
        <p>
          <span>保護者様のご同伴を</span>
          <span>お願いします。</span>
        </p>
      </CardBody>
    </Card>
  );
};
