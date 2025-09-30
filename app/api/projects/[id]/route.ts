// pages/api/projects/[id].ts
import { prisma } from '@/lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    await prisma.project.delete({
      where: { id },
    });
    res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project.' });
  }
}
