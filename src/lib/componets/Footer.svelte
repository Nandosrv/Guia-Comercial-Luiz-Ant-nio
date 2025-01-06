<script>
	import logos from '$lib/images/new.png';
	import Instagram from '$lib/images/icons8-instagram-64.png';
	import Facebook from '$lib/images/icons8-facebook-novo-48.png';
	import Whatz from '$lib/images/icon-ws.png';
	let currentYear = new Date().getFullYear();
</script>

<main class="flex w-full border border-t-white/15 bg-secondary-foreground dark:bg-secondary">
	<div class="h-auto w-full bg-gradient-to-br py-12 text-white">
		<div class="container mx-auto flex flex-wrap justify-between px-6">
			<!-- Logo e Redes Sociais -->
			<div class="flex flex-col items-center gap-6 text-center md:w-1/4">
				<a href="/">
					<img class="h-[100px] w-[100px]" src="{logos}" alt="Logo Guia Luiz Antônio" />
				</a>
				<p class="text-lg font-semibold">Guia Luiz Antônio</p>
				<div class="flex space-x-4">
					<a
						href="https://www.facebook.com/profile.php?id=61568178650325"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img class="w-[40px] transition-transform hover:scale-110" src="{Facebook}" alt="Facebook" />
					</a>
					<a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
						<img class="w-[40px] transition-transform hover:scale-110" src="{Instagram}" alt="Instagram" />
					</a>
					<a href="https://wa.me/16996151725" target="_blank" rel="noopener noreferrer">
						<img class="w-[40px] transition-transform hover:scale-110" src="{Whatz}" alt="WhatsApp" />
					</a>
				</div>
			</div>

			<!-- Quem Somos -->
			<div class="mt-8 md:mt-0 md:w-1/4">
				<h3 class="mb-4 text-xl font-bold">Quem Somos</h3>
				<p class="text-sm leading-relaxed">
					Somos o maior guia comercial de Luiz Antônio, conectando você aos melhores comércios e
					serviços da região. Nossa missão é facilitar sua vida e trazer soluções confiáveis.
				</p>
			</div>

			<!-- Contato -->
			<div class="mt-8 md:mt-0 md:w-1/4">
				<h3 class="mb-4 text-xl font-bold">Entre em Contato</h3>
				<ul class="space-y-2 text-sm">
					<li>
						📞 <a href="tel:+5516996151725" class="hover:underline">+55 16 99615-1725</a>
					</li>
					<li>
						📧 <a href="mailto:contato@guiacomercial.com" class="hover:underline">solucoestecnologiasrv@gmail.com</a>
					</li>
					<li>📍 Luiz Antônio, SP - Brasil</li>
				</ul>
			</div>

			<!-- Links Úteis -->
			<div class="mt-8 md:mt-0 md:w-1/4">
				<h3 class="mb-4 text-xl font-bold">Links Úteis</h3>
				<ul class="space-y-2 text-sm">
					<li><a href="/" class="hover:underline">Política de Privacidade</a></li>
					<li><a href="/" class="hover:underline">Termos de Uso</a></li>
					<li><a href="/anuncios-luiz-antonio" class="hover:underline">Anuncie Conosco</a></li>
				</ul>
			</div>
		</div>

		<!-- Rodapé -->
		<div class="mt-12 border-t border-gray-500 pt-6 text-center">
			<p class="text-sm">© {currentYear} Guia Luiz Antônio. Todos os direitos reservados.</p>
			<p class="text-xs text-gray-400">Desenvolvido com 💖 por nossa equipe.</p>
		</div>
	</div>
</main>
