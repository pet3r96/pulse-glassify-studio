import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { owner_type, owner_id, navigation_config, ui_flags } = await request.json()

    if (!owner_type || !owner_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create tenant config
    const { data, error } = await supabase
      .from('tenant_config')
      .insert({
        owner_type,
        owner_id,
        navigation_config: navigation_config || {},
        ui_flags: ui_flags || {},
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      config: data,
    })
  } catch (error: any) {
    console.error('Tenant config creation error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
