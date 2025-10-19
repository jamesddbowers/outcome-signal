import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import type { SendMessageRequest, SendMessageResponse, ChatMessage } from '@/lib/types';
import type { Json } from '@/lib/supabase/database.types';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/chat/send
 * Sends a message to an agent conversation
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate user with Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body: SendMessageRequest = await request.json();
    const { initiativeId, content } = body;

    // Validate input
    if (!initiativeId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: initiativeId, content' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get user from database based on clerk_user_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create new message
    const newMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    // Check if conversation already exists
    const { data: existingConversation, error: fetchError } = await supabase
      .from('agent_conversations')
      .select('*')
      .eq('initiative_id', initiativeId)
      .eq('user_id', user.id)
      .single();

    let conversationId: string;

    if (fetchError && fetchError.code === 'PGRST116') {
      // No conversation exists, create new one
      const { data: newConversation, error: insertError } = await supabase
        .from('agent_conversations')
        .insert({
          initiative_id: initiativeId,
          user_id: user.id,
          messages: [newMessage] as unknown as Json,
        })
        .select()
        .single();

      if (insertError || !newConversation) {
        console.error('Error creating conversation:', insertError);
        return NextResponse.json(
          { error: 'Failed to create conversation' },
          { status: 500 }
        );
      }

      conversationId = newConversation.id;
    } else if (existingConversation) {
      // Conversation exists, append message
      const updatedMessages = [...(existingConversation.messages as unknown as ChatMessage[]), newMessage];

      const { error: updateError } = await supabase
        .from('agent_conversations')
        .update({ messages: updatedMessages as unknown as Json })
        .eq('id', existingConversation.id);

      if (updateError) {
        console.error('Error updating conversation:', updateError);
        return NextResponse.json(
          { error: 'Failed to update conversation' },
          { status: 500 }
        );
      }

      conversationId = existingConversation.id;
    } else {
      // Unexpected error
      console.error('Error fetching conversation:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch conversation' },
        { status: 500 }
      );
    }

    // Return success response
    const response: SendMessageResponse = {
      message: newMessage,
      conversationId,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/chat/send:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
