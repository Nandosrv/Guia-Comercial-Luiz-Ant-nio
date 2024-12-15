<script>
	import Comu from '$lib/images/comu.png';
	import anuncui2 from '$lib/images/anuncui2.png';
	import Newpost from '$lib/images/postpost.png';
	import Manu from '$lib/images/manu.gif';
	import Post from '$lib/images/Post.png';
	import Ana from '$lib/images/ina.png';

	// Lista de anúncios com data
	export let anuncios = [
		{
			titulo: 'Avalie nosso site',
			descricao:
				'Avalie nosso site e nos ajude a crescer! Estamos sempre buscando formas de oferecer a melhor experiência possível para nossos usuários. Deixe seu feedback e sugestões, e faremos o melhor para atender às suas expectativas. Sua opinião nos inspira a evoluir e criar algo ainda mais especial para você.',
			imagem: anuncui2,
			link: '/avalie',
			data: '30/11/2024' // Data do anúncio
		},
		{
			titulo: 'Quadro de Anúncios',
			descricao:
				"Com o intuito de facilitar a interação e a troca de informações, criamos uma seção exclusiva para anúncios, onde os usuários podem publicar e visualizar conteúdos em diversas categorias. Entre as opções, destacam-se 'Vendo', 'Procuro Emprego' e 'Achados e Perdidos', proporcionando um ambiente acessível para aqueles que precisam de algo ou têm algo a oferecer.",
			imagem: Ana,
			link: '/quadroAvisos',
			data: '30/11/2024' // Data do anúncio
		},
		{
			titulo: 'Rota Dinâmica para Notícias',
			descricao:
				'Agora, cada notícia possui uma página personalizada com detalhes e informações exclusivas. É só clicar na notícia que você se interessar para acessar o conteúdo completo.',
			imagem: Newpost,
			link: '/quadroAvisos',
			data: '30/11/2024' // Data do anúncio
		},
		{
			titulo: 'Onde Estamos Localizados',
			descricao:
				'Estamos localizados em Luiz Antônio - SP, prontos para atender você! No entanto, para facilitar o seu contato e garantir um atendimento mais rápido, informamos que realizamos atendimentos exclusivos pelo WhatsApp. Se precisar de mais informações, tirar dúvidas ou conversar diretamente com nossa equipe, basta clicar no link abaixo e enviar uma mensagem.            Estamos esperando seu contato!',
			imagem: Post,
			link: '/avalie',
			data: '30/11/2024' // Data do anúncio
		}
	];
</script>

<section class="flex flex-wrap justify-center gap-8 lg:py-12">
	{#each anuncios as anuncio}
		<div class="w-full overflow-hidden rounded-xl bg-white shadow-md lg:w-5/12 dark:bg-gray-900">
			<div class="w-full">
				<img src={anuncio.imagem} alt="Comércio" class="h-64 w-full rounded-t-xl object-cover" />
			</div>

			<div class="px-6 py-8">
				<h2 class="text-2xl font-semibold text-gray-800 dark:text-white">
					{anuncio.titulo}
				</h2>

				<!-- Exibição da data -->
				<p class="mt-2 text-sm text-gray-400">
					Publicado em: {anuncio.data}
				</p>

				<p class="mt-4 text-gray-500 dark:text-gray-300">
					{anuncio.descricao}
				</p>

				<div class="mt-6 flex justify-center">
					<a
						href={anuncio.link}
						class="inline-flex items-center rounded-lg bg-gray-800 px-6 py-2 text-sm text-blue-400 hover:bg-gray-700 focus:ring focus:ring-gray-300 focus:ring-opacity-80"
					>
						Saiba mais
					</a>
				</div>
			</div>
		</div>
	{/each}
</section>
