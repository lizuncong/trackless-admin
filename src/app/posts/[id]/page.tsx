import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import BaseInfo from "./BaseIinfo";
export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = parseInt(id);

  if (isNaN(postId)) {
    notFound();
  }

  const post = await prisma.t_post.findUnique({
    where: {
      id: postId,
    },
    include: {
      t_user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  console.log("post detail page render", post);
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 返回按钮 */}
        <Link
          href="/posts"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6 font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          返回列表
        </Link>
        {/* 文章卡片 */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* 头部区域 */}
          <div className="bg-linear-to-r from-indigo-600 to-blue-600 px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  post.published
                    ? "bg-green-500 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {post.published ? "已发布" : "草稿"}
              </span>
              <span className="text-white/80 text-sm">ID: #{post.id}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {post.title}
            </h1>
          </div>

          {/* 内容区域 */}
          <div className="p-8">
            {/* 作者信息卡片 */}
            <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 text-lg font-semibold">
                    {post.t_user.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {post.t_user.name || "未知用户"}
                  </p>
                  <p className="text-sm text-slate-500">{post.t_user.email}</p>
                </div>
              </div>
            </div>

            {/* 文章内容 */}
            {post.content ? (
              <div className="prose prose-slate max-w-none">
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <p className="text-lg">这篇文章还没有内容</p>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-4 flex-wrap">
              <Link
                href={`/posts/${post.id}/edit`}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                编辑文章
              </Link>
              <Link
                href="/posts/new"
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                创建新文章
              </Link>
              <Link
                href="/posts"
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                查看所有文章
              </Link>
            </div>
          </div>
        </div>
        <BaseInfo post={post} />
      </div>
    </div>
  );
}
