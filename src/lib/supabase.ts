import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

// Variables de entorno de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validar que las variables existan
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '⚠️ Faltan las variables de entorno de Supabase. ' +
    'Asegúrate de configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env'
  )
}

// Crear cliente de Supabase con tipado
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Helper para verificar la conexión
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('productos').select('count', { count: 'exact', head: true })
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 significa que la tabla no existe aún, pero la conexión funciona
      console.error('Error de conexión con Supabase:', error)
      return false
    }
    
    console.log('✅ Conexión con Supabase exitosa')
    return true
  } catch (error) {
    console.error('❌ No se pudo conectar con Supabase:', error)
    return false
  }
}

