const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const userId = process.env.TARGET_USER_ID;
const newPassword = process.env.TARGET_NEW_PASSWORD || 'Admin!12345';

if (!supabaseUrl || !supabaseServiceKey || !userId) {
  console.error('Missing envs. Require NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TARGET_USER_ID');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  try {
    console.log('Updating password for user:', userId);
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
      email_confirm: true,
    });
    if (error) {
      console.error('Error updating user password:', error);
      process.exit(1);
    }
    console.log('✅ Password updated. You can log in now.');
    console.log('Temporary password:', newPassword);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();



