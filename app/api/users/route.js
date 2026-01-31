import prisma from '../../../lib/prisma'

export async function GET() {
  const users = await prisma.user.findMany()
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}