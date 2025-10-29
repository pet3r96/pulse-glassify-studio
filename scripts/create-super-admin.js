const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createSuperAdmin() {
  try {
    console.log('Creating super admin user...');
    
    // Create user in auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@pulsegen.com',
      password: 'admin123',
      email_confirm: true,
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return;
    }

    console.log('Auth user created:', authData.user.id);

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: 'Super Admin',
        role: 'super_admin',
        onboarding_completed: true,
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return;
    }

    console.log('Profile created:', profile);

    // Create subscription status
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscription_status')
      .insert({
        user_id: authData.user.id,
        status: 'active',
        stripe_customer_id: 'admin_customer',
        stripe_subscription_id: 'admin_subscription',
        stripe_price_id: 'admin_price',
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      return;
    }

    console.log('Subscription created:', subscription);

    console.log('\n✅ Super Admin created successfully!');
    console.log('Email: admin@pulsegen.com');
    console.log('Password: admin123');
    console.log('User ID:', authData.user.id);

  } catch (error) {
    console.error('Error:', error);
  }
}

createSuperAdmin();
