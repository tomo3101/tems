import { TimeChip } from '@/components/ui/chip';
import { getPost } from '@/utils/microcms';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Image } from '@heroui/image';
import parse from 'html-react-parser';
import NextImage from 'next/image';

export default async function NewsPostsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  return (
    <>
      <Image
        as={NextImage}
        src={post.eyecatch.url}
        width={post.eyecatch.width}
        height={post.eyecatch.height}
        alt={`${post.title} アイキャッチ`}
        style={{ width: '100%', height: 'auto' }}
      />

      <Card>
        <CardHeader className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">{post.title}</h1>

          <div className="flex flex-row gap-2">
            <Chip variant="bordered" color="secondary">
              {post.category.name}
            </Chip>
            <TimeChip time={post.publishedAt} />
          </div>
        </CardHeader>

        <CardBody>
          <div className="max-w-full prose dark:prose-invert">
            {parse(post.content)}
          </div>
        </CardBody>
      </Card>
    </>
  );
}
