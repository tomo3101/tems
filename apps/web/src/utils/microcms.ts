import { createClient } from 'microcms-js-sdk';

// 環境変数にMICROCMS_SERVICE_DOMAINが設定されていない場合はエラーを投げる
if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}

// 環境変数にMICROCMS_API_KEYが設定されていない場合はエラーを投げる
if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required');
}

// Client SDKの初期化を行う
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

export type PostProps = {
  id: string;
  title: string;
  eyecatch: {
    url: string;
    height: number;
    width: number;
  };
  category: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    revisedAt: string;
  };
  publishedAt: string;
};

export type PostDetailProps = {
  id: string;
  title: string;
  content: string;
  eyecatch: {
    url: string;
    height: number;
    width: number;
  };
  category: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    revisedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};

export const getBlogPosts = async (
  limit?: number,
  offset?: number,
): Promise<PostProps[]> => {
  const data = await client.get({
    endpoint: 'posts', // 'posts'はmicroCMSのエンドポイント名
    queries: {
      filters: 'category[equals]blog', // カテゴリーが「ブログ」の記事を取得
      fields: 'id,title,eyecatch,category,publishedAt',
      limit: limit,
      offset: offset,
    },
  });
  return data.contents;
};

export const getNewsPosts = async (
  limit?: number,
  offset?: number,
): Promise<PostProps[]> => {
  const data = await client.get({
    endpoint: 'posts', // 'posts'はmicroCMSのエンドポイント名
    queries: {
      filters: 'category[equals]news', // カテゴリーが「お知らせ」の記事を取得
      fields: 'id,title,eyecatch,category,publishedAt',
      limit: limit,
      offset: offset,
    },
  });
  return data.contents;
};

export const getPost = async (id: string): Promise<PostDetailProps> => {
  const data = await client.get({
    endpoint: `posts/${id}`,
  });
  return data;
};
