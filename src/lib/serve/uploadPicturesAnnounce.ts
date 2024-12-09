import supabase from '../supabaseClient'; // Certifique-se de que o supabase está configurado corretamente

export async function uploadPicturesAnnounce(file: File, userId: string) {
  // Sanitiza o nome do arquivo
  const sanitizedFileName = `${userId}-${Date.now()}-${file.name?.replace(/[^a-zA-Z0-9.-_]/g, '')}`;
  // replace remove caracteres não-alfanuméricos
  try {
    // console.log('Iniando o upload da foto de perfil...');
    // Fazendo o upload do arquivo
    const { data, error: uploadError } = await supabase.storage
      .from('pictures_announce')
      .upload(sanitizedFileName, file);
      // console.log('Dados do upload:', data);

    if (uploadError) {
      console.error('Erro no upload:', uploadError);
      throw new Error(`Erro ao fazer upload da foto de perfil: ${uploadError.message}`);
    }

    // Obtendo a URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from('pictures_announce')
      .getPublicUrl(sanitizedFileName);
      // console.log('URL pública do arquivo:', urlData);
    // Verificando se a URL foi obtida corretamente
    if (!urlData || !urlData.publicUrl) {
      console.error('Erro ao obter a URL pública');
      throw new Error('Erro ao obter a URL pública');
    }

    // console.log('URL pública:', urlData.publicUrl);
    return urlData.publicUrl;

  } catch (error: any) {  // Aqui tratamos o erro como "any" para acessar propriedades como 'message'
    console.error('Erro ao atualizar foto do anuncio:', error);
    throw new Error(`Erro ao atualizar a foto do anuncio: ${error.message}`);
  }
}
