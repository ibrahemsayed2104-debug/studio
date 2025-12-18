'use server';

import { sign } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function login(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { success: false, error: 'لم يتم تعيين كلمة مرور المسؤول.' };
  }

  if (password === adminPassword) {
    const session = { isAdmin: true };
    const sessionCookie = await sign(session);
    
    cookies().set('session', sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
    });
    
    return { success: true };
  } else {
    return { success: false, error: 'كلمة المرور غير صحيحة.' };
  }
}
