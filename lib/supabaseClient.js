import {createClient} from "@supabase/supabase-js"

const supaBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supaBaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY

export const supabase = createClient(supaBaseUrl, supaBaseKey)