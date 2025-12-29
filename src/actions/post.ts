"use server";

import { serverRequest } from "@/lib/fetch/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";
  const authorId = formData.get("authorId") as string;

  if (!authorId) {
    throw new Error("请选择作者");
  }

  const authorIdNum = parseInt(authorId);
  if (isNaN(authorIdNum)) {
    throw new Error("无效的用户ID");
  }

  // 验证用户是否存在
  const user = await prisma.t_user.findUnique({
    where: { id: authorIdNum },
  });

  if (!user) {
    throw new Error("选择的用户不存在");
  }

  const post = await prisma.t_post.create({
    data: {
      title,
      content: content || null,
      published,
      authorId: authorIdNum,
    },
  });

  redirect(`/posts/${post.id}`);
}

export async function updatePost(postId: number, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";
  const authorId = formData.get("authorId") as string;

  if (!authorId) {
    throw new Error("请选择作者");
  }

  const authorIdNum = parseInt(authorId);
  if (isNaN(authorIdNum)) {
    throw new Error("无效的用户ID");
  }

  // 验证用户是否存在
  const user = await prisma.t_user.findUnique({
    where: { id: authorIdNum },
  });

  if (!user) {
    throw new Error("选择的用户不存在");
  }

  // 验证文章是否存在
  const existingPost = await prisma.t_post.findUnique({
    where: { id: postId },
  });

  if (!existingPost) {
    throw new Error("文章不存在");
  }

  await prisma.t_post.update({
    where: { id: postId },
    data: {
      title,
      content: content || null,
      published,
      authorId: authorIdNum,
    },
  });

  redirect(`/posts/${postId}`);
}

export async function getAllPost(page: number) {
  return prisma.t_post.findMany({
    skip: page * 10,
    take: 10,
  });
  // return { code: 0, data: posts };
}

export const getGiveawayListService = async (params: {
  drawStatus: 0 | 10 | 20;
  pageIndex: number; // 页码，从0开始
  pageSize: number; // 页面大小
}) => {
  return serverRequest.post({
    api: "/api/giveaway/getGiveawayList",
    params: {
      userId: {
        huYaUA: "web",
      },
      ...params,
    },
  });
};
