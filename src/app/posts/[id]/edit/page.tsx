import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { updatePost } from "@/actions/post";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = parseInt(id);

  if (isNaN(postId)) {
    notFound();
  }

  const [post, users] = await Promise.all([
    prisma.t_post.findUnique({
      where: { id: postId },
      include: {
        t_user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.t_user.findMany({
      orderBy: {
        id: "asc",
      },
    }),
  ]);

  if (!post) {
    notFound();
  }

  console.log("edit post page render");
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* 头部 */}
        <div className="mb-8">
          <Link
            href={`/posts/${postId}`}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4 font-medium"
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
            返回详情
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">编辑文章</h1>
          <p className="text-slate-600">修改文章信息</p>
        </div>

        {/* 表单卡片 */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <form action={updatePost.bind(null, postId)} className="space-y-6">
            {/* 作者选择 */}
            <div>
              <label
                htmlFor="authorId"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                作者 <span className="text-red-500">*</span>
              </label>
              {users.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    没有可用的用户，请先创建用户
                  </p>
                </div>
              ) : (
                <select
                  id="authorId"
                  name="authorId"
                  required
                  defaultValue={post.authorId}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 bg-white"
                >
                  <option value="">请选择作者</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || "未命名用户"} ({user.email}) - ID: {user.id}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* 标题 */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                defaultValue={post.title}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900"
                placeholder="输入文章标题..."
              />
            </div>

            {/* 内容 */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                内容
              </label>
              <textarea
                id="content"
                name="content"
                rows={12}
                defaultValue={post.content || ""}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-slate-900"
                placeholder="输入文章内容..."
              />
            </div>

            {/* 发布状态 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                defaultChecked={post.published}
                className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 focus:ring-2"
              />
              <label
                htmlFor="published"
                className="ml-3 text-sm font-medium text-slate-700"
              >
                已发布
              </label>
            </div>

            {/* 按钮组 */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={users.length === 0}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                保存更改
              </button>
              <Link
                href={`/posts/${postId}`}
                className="px-8 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                取消
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
