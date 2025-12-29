import prisma from "@/lib/prisma";
import Link from "next/link";
export default async function Home() {
  // 并行获取数据
  const [users, posts, stats] = await Promise.all([
    prisma.t_user.findMany({
      orderBy: {
        id: "desc",
      },
      take: 10, // 只显示最近10个用户
    }),
    prisma.t_post.findMany({
      include: {
        t_user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
      take: 6, // 只显示最近6篇文章
    }),
    Promise.all([
      prisma.t_user.count(),
      prisma.t_post.count(),
      prisma.t_post.count({ where: { published: true } }),
    ]).then(([userCount, postCount, publishedCount]) => ({
      userCount,
      postCount,
      publishedCount,
    })),
  ]);
  console.log("home page render");
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* 头部欢迎区域 */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-slate-900 mb-3">管理后台</h1>
          <p className="text-slate-600 text-lg">欢迎回来，查看系统概览</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">
                  用户总数
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.userCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">
                  文章总数
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.postCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">
                  已发布文章
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.publishedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 主要内容区域 - 两列布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 用户列表 */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">用户列表</h2>
                <span className="text-white/80 text-sm">
                  {users.length} 位用户
                </span>
              </div>
            </div>
            <div className="p-6">
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">👤</div>
                  <p className="text-slate-500">暂无用户</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all"
                    >
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-indigo-600 text-lg font-semibold">
                          {user.name?.[0]?.toUpperCase() ||
                            user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">
                          {user.name || "未命名用户"}
                        </p>
                        <p className="text-sm text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        ID: {user.id}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 文章列表 */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">最新文章</h2>
                <Link
                  href="/posts"
                  className="text-white/90 hover:text-white text-sm font-medium underline"
                >
                  查看全部
                </Link>
              </div>
            </div>
            <div className="p-6">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">📝</div>
                  <p className="text-slate-500 mb-4">暂无文章</p>
                  <Link
                    href="/posts/new"
                    className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm"
                  >
                    创建文章
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/posts/${post.id}`}
                      className="block p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 flex-1">
                          {post.title}
                        </h3>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
                            post.published
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {post.published ? "已发布" : "草稿"}
                        </span>
                      </div>
                      {post.content && (
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {post.content}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 text-xs font-semibold">
                            {post.t_user.name?.[0]?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <span>{post.t_user.name || "未知用户"}</span>
                        <span>•</span>
                        <span>#{post.id}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {posts.length > 0 && (
              <div className="px-6 pb-6">
                <Link
                  href="/posts/new"
                  className="block w-full text-center px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  + 创建新文章
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 快速操作区域 */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            快速操作
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/posts/new"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              + 新建文章
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
    </div>
  );
}
