import supabase from '$lib/supabaseClient'; // Certifique-se de importar o supabase corretamente

export const load = async () => {
  // Substitua 'anunciodestaque' pelo nome correto da tabela
  const { data, error } = await supabase
  .from('anunciodestaque')
  .select('id, business_name, description,image, phone_number, whatsapp, location, package');

if (error) {
  console.error("Erro ao carregar os anúncios:", error.message);
} else {
  const featuredAds = data || [];

  console.log(featuredAds);

  return { featuredAds };
}};
