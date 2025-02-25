import { TimeChip } from '@/components/ui/chip';
import { getNewsPosts } from '@/utils/microcms';
import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Image } from '@heroui/image';
import NextImage from 'next/image';
import NextLink from 'next/link';

export default async function NewsPostsListPage() {
  const rowPerPage = 5;
  const posts = await getNewsPosts(rowPerPage);

  return (
    <>
      <h1 className="text-2xl font-medium">お知らせ一覧</h1>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Card as={NextLink} key={post.id} href={`/news/${post.id}`}>
            <CardBody>
              <div className="sm:flex sm:justify-between gap-8">
                <div className="sm:w-2/5">
                  <Image
                    as={NextImage}
                    src={post.eyecatch.url}
                    width={post.eyecatch.width}
                    height={post.eyecatch.height}
                    alt={`${post.title} アイキャッチ`}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>

                <div className="w-full flex flex-col justify-between gap-2">
                  <h2 className="text-xl font-medium">{post.title}</h2>
                  <div className="flex flex-col gap-2">
                    <Chip variant="bordered" color="secondary">
                      {post.category.name}
                    </Chip>
                    <TimeChip time={post.publishedAt} />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
}
