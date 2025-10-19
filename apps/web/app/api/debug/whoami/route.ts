import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET(): Promise<NextResponse> {
  const { userId } = await auth();
  const user = await currentUser();

  return NextResponse.json({
    clerkUserId: userId,
    email: user?.emailAddresses[0]?.emailAddress,
    firstName: user?.firstName,
    lastName: user?.lastName,
    imageUrl: user?.imageUrl,
  });
}
