import type { UserJSON } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"

function primaryEmail(user: UserJSON) {
  const primaryId = user.primary_email_address_id
  const primary = user.email_addresses.find((e) => e.id === primaryId)
  return primary?.email_address ?? user.email_addresses[0]?.email_address ?? null
}

function displayName(user: UserJSON) {
  const parts = [user.first_name, user.last_name].filter(Boolean)
  if (parts.length > 0) return parts.join(" ")
  return user.username ?? null
}

export async function upsertUserFromClerk(user: UserJSON) {
  const email = primaryEmail(user)
  if (!email) {
    throw new Error(`Clerk user ${user.id} has no email address`)
  }

  return prisma.user.upsert({
    where: { clerkId: user.id },
    create: {
      clerkId: user.id,
      email,
      name: displayName(user),
      imageUrl: user.image_url,
    },
    update: {
      email,
      name: displayName(user),
      imageUrl: user.image_url,
    },
  })
}

export async function deleteUserByClerkId(clerkId: string) {
  const existing = await prisma.user.findUnique({ where: { clerkId } })
  if (!existing) return null

  await prisma.order.updateMany({
    where: { userId: existing.id },
    data: { userId: null },
  })

  return prisma.user.delete({ where: { clerkId } })
}

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({ where: { clerkId } })
}
