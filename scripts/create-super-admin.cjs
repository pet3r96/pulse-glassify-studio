const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function findUserIdByEmail(email) {
  try {
    let page = 1;
    const perPage = 1000;
    while (page <= 10) { // search up to 10k users
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
      if (error) return null;
      const match = data.users?.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
      if (match) return match.id;
      if (!data.users || data.users.length < perPage) break;
      page += 1;
    }
  } catch (_) {}
  return null;
}

async function ensureProfile(userId, fullName) {
  const { data: existing } = await supabase.from('profiles').select('id').eq('id', userId).maybeSingle();
  if (!existing) {
    const { error } = await supabase.from('profiles').insert({
      id: userId,
      full_name: fullName,
      role: 'super_admin',
      onboarding_completed: true,
    });
    if (error) throw error;
  } else {
    const { error } = await supabase.from('profiles').update({ role: 'super_admin', onboarding_completed: true }).eq('id', userId);
    if (error) throw error;
  }
}

async function ensureActiveSubscription(userId) {
  const { data: existing } = await supabase
    .from('subscription_status')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();
  if (!existing) {
    const { error } = await supabase
      .from('subscription_status')
      .insert({
        user_id: userId,
        status: 'active',
        stripe_customer_id: 'admin_customer',
        stripe_subscription_id: 'admin_subscription',
        stripe_price_id: 'admin_price',
      });
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('subscription_status')
      .update({ status: 'active' })
      .eq('user_id', userId);
    if (error) throw error;
  }
}

async function createSuperAdmin() {
  try {
    console.log('Creating super admin user...');
    const email = process.env.SUPERADMIN_EMAIL || 'admin@pulsegen.com';
    const password = process.env.SUPERADMIN_PASSWORD || 'admin123';
    const fullName = process.env.SUPERADMIN_NAME || 'Super Admin';

    let userId = null;
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (authError) {
      if (authError?.code === 'email_exists' || authError?.status === 422) {
        console.log('User already exists, promoting to super admin...');
        userId = await findUserIdByEmail(email);
        if (!userId) {
          console.error('Could not find existing user by email.');
          process.exit(1);
        }
      } else {
        console.error('Error creating auth user:', authError);
        process.exit(1);
      }
    } else {
      userId = authData.user.id;
      console.log('Auth user created:', userId);
    }

    await ensureProfile(userId, fullName);
    await ensureActiveSubscription(userId);

    console.log('\n✅ Super Admin ready!');
    console.log('Email:', email);
    console.log('Password:', password, '(if existing user, keep your current password)');
    console.log('User ID:', userId);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createSuperAdmin();


