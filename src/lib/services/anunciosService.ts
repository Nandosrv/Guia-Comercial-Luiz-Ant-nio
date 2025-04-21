import  supabase  from '$lib/supabaseClient';  // Certifique-se de que o supabase está configurado corretamente

export async function getAnuncioBySlug(slug: string) {
  const { data, error } = await supabase
    .from('anuncios')
    .select('*')
    .eq('slug', slug);

  if (error) {
    console.error('Erro ao buscar anúncio:', error);
    return { data: null, error };  // Retorne null em caso de erro
  }

  console.log('Anúncio encontrado:', data);  // Verifique os dados no console
  return { data, error: null };  // Retorne os dados encontrados
}
