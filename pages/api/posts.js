import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import { PostSchema } from './../index';

const prisma = new PrismaClient();

const createPost = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ unauthorized: true });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const isValid = await PostSchema.isValid(req.body);
  if (!isValid) {
    return res.status(500).json({ error: 'validation error' });
  }

  const post = await prisma.post.create({
    data: {
      userId: user.id,
      title: req.body.title,
      body: req.body.body,
    },
  });

  if (post.id) {
    res.status(200).json(post);
  } else {
    return res.status(500).json({ error: 'something went wrong' });
  }
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return createPost(req, res);
  }
}
