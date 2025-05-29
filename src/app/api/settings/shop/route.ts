// app/api/settings/shop/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth-options';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();
    console.log('Received data:', data);
    
    const organisation = await prisma.organisation.update({
      where: {
        id: parseInt(session.user.id)
      },
      data: {
        whatsappNumber: data.whatsappNumber,
        wabaToken: data.wabaToken,
        waAccessToken: data.waAccessToken,
        waKey: data.waKey
      }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      data: {
        whatsappNumber: organisation.whatsappNumber,
        wabaToken: organisation.wabaToken,
        waAccessToken: organisation.waAccessToken,
        waKey: organisation.waKey
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error updating shop details:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to update WhatsApp settings' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}