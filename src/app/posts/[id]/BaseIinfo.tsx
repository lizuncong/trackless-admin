"use client";

import { useState } from "react";
import { Prisma } from "../../../../generated/prisma/browser";

type PostWithUser = Prisma.t_postGetPayload<{
  include: {
    t_user: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;

export default function BaseInfo({ post }: { post: PostWithUser }) {
  const [postData, setPostData] = useState<PostWithUser>(post);
  return (
    <div>
      <h1>BaseInfo</h1>
      <p>{postData.title}</p>
      <p>{postData.content}</p>
      <p>{postData.published}</p>
      <p>{postData.authorId}</p>
      <p>{postData.t_user.name}</p>
      <p>{postData.t_user.email}</p>
    </div>
  );
}
