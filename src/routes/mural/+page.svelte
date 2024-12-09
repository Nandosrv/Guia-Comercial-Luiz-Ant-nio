<script>
	// @ts-nocheck
	import Footer from '$lib/footer/+paga.svelte';
	import Breadcrumbs from '$lib/componets/Breadcrumbs.svelte';
	import Citys from '../../lib/images/homepage.jpg';
	import Sol from '$lib/images/icons8-sol-64.png';
	import Maps from '$lib/images/icons8-mapa-64.png';
	import Rota from '$lib/images/icons8-route-64.png';
	import Postform from '$lib/componets/postform.svelte';
	import Mt from '$lib/images/mt.png';
	import MenuMural from '$lib/componets/MenuMural.svelte';
	import ScrollTo from '$lib/componets/scrollTo.svelte';
</script>

<ScrollTo />
<main class="flex w-full flex-col items-center bg-gradient-to-br from-purple-950 to-purple-900">
	<div class="flex w-full items-center justify-between border-b border-purple-800 bg-black/60 p-4">
		<Breadcrumbs />
	</div>
	<div
		class="flex h-[50px] w-full flex-col items-center justify-center border-b border-purple-800 bg-black/60 p-4"
	>
		<MenuMural />
	</div>

	<div class="mt-10 flex w-full flex-col items-center justify-center">
		<h1 class="text-center text-3xl font-bold text-white">Bem-vindo a Luís Antônio!</h1>
	</div>

	<section
		class="flex w-[95%] items-center justify-center rounded-[12px] border-b border-purple-900 bg-black/60 p-4 max-sm:flex-col"
	>
		<div
			class="ml-3 flex w-full flex-col items-center justify-start gap-4 rounded-[12px] border-b border-purple-800"
		>
			<img
				class="flex rounded-[12px] object-cover max-sm:w-[400px] lg:w-[600px]"
				src="{Citys} "
				alt="Cidade De Luís Antônio"
			/>
			<div
				class="flex h-[50px] w-full items-center justify-start gap-2 border-b border-purple-800 bg-black/60 p-4"
			>
				<img src="{Mt} " alt="Logo" class="h-[40px] w-[40px]" />
				<a href="/nandoOliveira" target="_blank" rel="noopener noreferrer">
					<p class="text-blue-400 no-underline hover:text-white">Nando Oliveira</p>
				</a>
				<p class="text-white">03/12/2024</p>
			</div>
			<div>
				<p class="p-2 font-sans text-white lg:text-[20px]">
					Você vai encontrar muitas opções de hotéis em Luís Antônio, informações e fotos da
					maravilhosa Luís Antônio. Utilize o menu na lateral esquerdo para ter acesso as principais
					pousadas em Luís Antônio, recomendadas por internautas
				</p>
				<p class="p-2 font-sans text-white lg:text-[20px]">
					A cidade de Luís Antônio, localizada no estado de São Paulo (SP), foi fundada no ano de
					1959. A localidade está em uma altitude de 675m em relação ao nível do mar, e possui uma
					população estimada em 7.669 habitantes. A área total de Luís Antônio é de 599`,2km², e sua
					densidade demográfica é de 12,8hab/km² (habitantes por km²). O CEP da região de Luís
					Antônio-SP é 14210-000. Caso você possua informações atualizadas, utilize a área de
					comentário logo acima para nos enviar a atualização.
				</p>
			</div>
		</div>
	</section>
	<section
		id="HISTORIA-DA-CIDADE"
		class="mt-5 flex w-[95%] flex-col items-center justify-center rounded-[12px] border-b border-purple-900 bg-black/60 p-4 max-sm:flex-col"
	>
		<div
			class="justify-c ml-3 flex w-full flex-col items-center gap-4 rounded-[12px] border-b border-purple-800"
		>
			<p class="font-serif text-lg text-white">HISTÓRIA DA CIDADE</p>
		</div>
		<div class="flex w-full flex-col items-center justify-center gap-4">
			<div>
				<p class="p-2 font-sans text-white lg:text-[20px]">
					Oficialmente Luiz Antônio não tem uma data de fundação. Contam os historiadores, que o
					povoado começou nas imediações de onde hoje é a Praça Mário Junqueira, centro da cidade.
					Segundo a história que chegou até os dias atuais por tradição popular, no dia 13 de
					dezembro de 1892, o viajante Carlos Loyola morador de São Simão que passava pelo local
					transportando café para o porto do Jataí foi acometido de uma cegueira repentina. Como era
					13 dezembro, dia consagrado à Santa Luzia, fez uma promessa à santa protetora dos olhos e
					foi curado. Para pagar a promessa, no local montou uma Botica(espécie de farmácia) para
					vender medicamentos à viajantes e moradores da região.
				</p>
				<p class="p-2 font-sans text-white lg:text-[20px]">
					Depois, a farmácia foi transformada em um armazém que vendia desde alimentos até
					ferramentas. Portanto, segundo a história Carlos Loyola foi o primeiro habitante da antiga
					Vila Jataí, que era como se chamou o lugarejo de 1887 à 1937, quando o nome foi mudado
					para Luiz Antônio. Por essa razão, foi escolhido o dia 13 de dezembro para se comemorar o
					aniversário de Luiz Antônio, data que também se comemora o dia de Santa Luzia, padroeira
					da Cidade.
				</p>
			</div>
		</div>
	</section>
	<section
		id="Significado-do-Nome"
		class="mt-5 flex w-[95%] flex-col items-center justify-center rounded-[12px] border-b border-purple-900 bg-black/60 p-4 max-sm:flex-col"
	>
		<div
			class="justify-c ml-3 flex w-full flex-col items-center gap-4 rounded-[12px] border-b border-purple-800"
		>
			<p class="font-serif text-lg text-white">Significado do Nome</p>
		</div>
		<div class="flex w-full flex-col items-center justify-center gap-4">
			<div>
				<p class="p-2 font-sans text-white lg:text-[20px]">
					Primeiro nome: Vila Jataí, passou para o nome Luís Antônio em 1937 em homenagem ao coronel
					Luís Antônio Junqueira fazendeiro e desbravador da região. Carlos Loiola foi o primeiro
					habitante da antiga Vila Jataí.
				</p>
			</div>
		</div>
	</section>
	<section
		id="Aniversário-da-Cidade"
		class="mt-5 flex w-[95%] flex-col items-center justify-center rounded-[12px] border-b border-purple-900 bg-black/60 p-4 max-sm:flex-col"
	>
		<div
			class="justify-c ml-3 flex w-full flex-col items-center gap-4 rounded-[12px] border-b border-purple-800"
		>
			<p class="font-serif text-lg text-white">Aniversário da Cidade</p>
		</div>
		<div class="flex w-full flex-col items-center justify-center gap-4">
			<div>
				<p class="p-2 font-sans text-white lg:text-[20px]">
					A cidade de Luiz Antônio, localizada no estado de São Paulo, comemora seu aniversário no
					dia 13 de dezembro
				</p>
			</div>
		</div>
	</section>
	<section
		id="CARACTERÍSTICAS"
		class="mt-5 flex w-[95%] flex-col items-center justify-center rounded-[12px] border-b border-purple-900 bg-black/60 p-4 max-sm:flex-col"
	>
		<div
			class="ml-3 flex w-full items-center justify-center gap-4 rounded-[12px] border-b border-purple-800"
		>
			<img src={Sol} alt="Sol" class="flex h-[40px] w-[40px] object-cover" />
			<p class="font-serif text-lg text-white">CARACTERÍSTICAS:</p>
		</div>
		<div class="flex w-full flex-col items-center justify-center gap-4">
			<div>
				<p class="p-2 font-sans text-white lg:text-[20px]">
					Intensa atividade agrícola com a produção de cana de açúcar seguida pela produção de
					eucalipto e laranja. Temos também atividade de agroindústria no setor sucro alcooleiro e
					na produção de celulose e papel. Nestes setores, contamos com as presenças em nosso
					município da Central Energética Moreno, que produz açúcar e álcool e da VCP- Votorantim -
					Celulose e Papel, que produz celulose e papel a partir do eucalipto.
				</p>
				<p class="p-2 font-sans text-blue-200 lg:text-[20px]">Clima:</p>
				´
				<p class="p-2 font-sans text-white lg:text-[20px]">
					Tropical seco e saudável, com ventos constantes e as quatro estações do ano bem definidas
				</p>
				<p class="p-2 font-sans text-blue-200 lg:text-[20px]">Temperatura:</p>
				<p class="p-2 font-sans text-white lg:text-[20px]">28º C</p>
			</div>
		</div>
	</section>
	<section
		id="COMO-CHEGAR"
		class="mt-5 flex w-[95%] flex-col items-center justify-center rounded-[12px] border-b border-purple-900 bg-black/60 p-4 max-sm:flex-col"
	>
		<div
			class="ml-3 flex w-full items-center justify-center gap-4 rounded-[12px] border-b border-purple-800"
		>
			<img src={Maps} alt="Sol" class="flex h-[40px] w-[40px] object-cover" />
			<p class="font-serif text-lg text-white">COMO CHEGAR:</p>
		</div>
		<div class="flex w-full flex-col items-center justify-center gap-4">
			<div class="flex w-[95%] flex-col items-center justify-center gap-6 p-3">
				<p class="font-serif text-lg text-white">Noroeste do estado de São Paulo</p>
				<p class="font-serif text-lg text-white">Limites:</p>
				<p class="font-serif text-lg text-white">
					São Simão, Cravinhos, Guatapará, Descalvado, São Carlos, Rincão, Santa Rita do Passa
					Quatro
				</p>
				<p class="font-serif text-lg text-white">Acesso Rodoviário:</p>
				<p class="font-serif text-lg text-white">
					SP-348 (Rodovia dos Bandeirantes) / SP-330 (Rodovia Anhanguera) / SP-253 (Rodovia Deputado
					Cunha Bueno)
				</p>

				<!-- svelte-ignore a11y_missing_attribute -->
				<iframe
					class="lg:hidden"
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.647010632902!2d-47.70730560294354!3d-21.553755470920745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837433372e255%3A0x31f964ae06d686f4!2zTHXDrXMgQW50w7RuaW8sIFNQLCAxNDIxMC0wMDA!5e0!3m2!1spt-BR!2sbr!4v1733249064937!5m2!1spt-BR!2sbr"
					width="350"
					height="450"
					style="border:0;"
					allowfullscreen=""
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
				></iframe>
				<!-- svelte-ignore a11y_missing_attribute -->
				<iframe
					class="max-sm:hidden"
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.647010632902!2d-47.70730560294354!3d-21.553755470920745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837433372e255%3A0x31f964ae06d686f4!2zTHXDrXMgQW50w7RuaW8sIFNQLCAxNDIxMC0wMDA!5e0!3m2!1spt-BR!2sbr!4v1733249064937!5m2!1spt-BR!2sbr"
					width="600"
					height="500"
					style="border:0;"
					allowfullscreen=""
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
				></iframe>
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button class="flex items-center gap-2 font-serif text-lg text-white">
					<a
						href="https://www.google.com.br/maps/dir//Lu%C3%ADs+Ant%C3%B4nio,+SP,+14210-000/@-21.5537555,-47.7073056,16z/data=!4m8!4m7!1m0!1m5!1m1!1s0x94b837433372e255:0x31f964ae06d686f4!2m2!1d-47.7027676!2d-21.5516028?entry=ttu&g_ep=EgoyMDI0MTEyNC4xIKXMDSoASAFQAw%3D%3D"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img src={Rota} alt="Rota" class="flex h-[40px] w-[40px] object-cover" />
						<p class="flex font-serif text-lg text-blue-600">Rotas</p>
					</a>
				</button>
			</div>
		</div>
	</section>
	<section
		id="TURISMO"
		class="mt-5 flex w-[95%] flex-col items-center justify-center rounded-[12px] border-b border-purple-900 bg-black/60 p-4 max-sm:flex-col"
	>
		<div
			class="ml-3 flex w-full items-center justify-center gap-4 rounded-[12px] border-b border-purple-800"
		>
			<p class="font-serif text-lg text-white">TURISMO:</p>
		</div>
		<div class="flex w-full flex-col items-center justify-center gap-4">
			<div>
				<p class="p-2 font-sans text-white lg:text-[20px]">Principais Pontos Turísticos:</p>
				<p class="p-2 font-sans text-blue-200 lg:text-[20px]">Rio Moji-Guaçu</p>
				<p class="p-2 font-sans text-blue-200 lg:text-[20px]">Rio da Onça</p>
				<p class="p-2 font-sans text-blue-200 lg:text-[20px]">Rio Vassununga</p>
				<p class="p-2 font-sans text-blue-200 lg:text-[20px]">Corregos</p>
				<p class="p-2 font-sans text-white lg:text-[20px]">
					Beija-Flor, Jucuri, do Jordão, da Boa Sorte, João Rodrigues, das Cabaças, do Cafundó.
				</p>
				<p class="p-2 font-sans text-blue-200 lg:text-[20px]">Temperatura:</p>
			</div>
		</div>
	</section>
	<section
		id="INFORMAÇÕES-ÚTEIS"
		class="mt-5 flex w-[95%] flex-col items-center justify-center rounded-[12px] border-b border-purple-900 bg-black/60 p-4 max-sm:flex-col"
	>
		<div
			class="ml-3 flex w-full items-center justify-center gap-4 rounded-[12px] border-b border-purple-800"
		>
			<p class="font-serif text-lg text-white">INFORMAÇÕES ÚTEIS:</p>
		</div>
		<div class="flex w-full flex-col items-center justify-center gap-4">
			<div>
				<p class="p-2 font-sans text-white lg:text-[20px]">PREFEITURA MUNICIPAL DE LUÍS ANTÔNIO</p>
				<p class="p-2 font-sans text-blue-200 lg:text-[20px]">Telefones: (16) 3983-9000 / 9001</p>
				<a href="http://www.luizantonio.sp.gov.br/" target="_blank" rel="noopener noreferrer">
					<p class="p-2 font-sans text-blue-700 lg:text-[20px]">Site</p>
				</a>

				<p class="p-2 font-sans text-blue-200 lg:text-[20px]">INFORMAÇÕES AO TURISTAS:</p>
				<p class="p-2 font-sans text-blue-200 lg:text-[20px]">Viação Danúbio Azul Ltda.</p>
				<a href="tel:+551138585566" target="_blank" rel="noopener noreferrer">
					<p class="p-2 font-sans text-blue-700 lg:text-[20px]">SAC: (11) 3858-5566</p>
				</a>
				<a href="tel:+5533923424" target="_blank" rel="noopener noreferrer">
					<p class="p-2 font-sans text-blue-700 lg:text-[20px]">SAC: (11) 3392-3424</p>
				</a>
				<a href="http://www.danubioazul.com.br" target="_blank" rel="noopener noreferrer">
					<p class="p-2 font-sans text-blue-700 lg:text-[20px]">Site</p>
				</a>
				<p class="p-2 font-sans text-white lg:text-[20px]">
					CARTÓRIOS: CIVIL, IMÓVEIS, TÍTULOS E DOCUMENTOS, OUTROS:
				</p>
				<p class="p-2 font-sans text-white lg:text-[20px]">
					OFÍCIO DE REGISTRO CIVIL E TABELIONATO DE NOTAS:
				</p>
				<p class="p-2 font-sans text-white lg:text-[20px]">
					Rua Manoel Francisco, 225 - Bairro: Centro
				</p>
				<p class="p-2 font-sans text-white lg:text-[20px]">Luís Antônio-SP - CEP: 14210-000</p>
				<p class="p-2 font-sans text-white lg:text-[20px]">E-mail:</p>
				<a href="mailto:">
					<p>cartorio@cartoriola.com.br</p>
				</a>
				<a class="text-blue-700" href="tel:+551639831460">Telefone:1639831460</a>

				<a
					href="https://www.google.com.br/maps/dir//Lu%C3%ADs+Ant%C3%B4nio,+SP,+14210-000/@-21.5537555,-47.7073056,16z/data=!4m8!4m7!1m0!1m5!1m1!1s0x94b837433372e255:0x31f964ae06d686f4!2m2!1d-47.7027676!2d-21.5516028?entry=ttu&g_ep=EgoyMDI0MTEyNC4xIKXMDSoASAFQAw%3D%3D"
					target="_blank"
					rel="noopener noreferrer"
				>
					<p class="p-2 font-sans text-blue-700 lg:text-[20px]">Luís Antônio-SP - CEP: 14210-000</p>
				</a>
			</div>
		</div>
	</section>
	<div id="Comentário"></div>
	<Postform />
	<Footer />
</main>
