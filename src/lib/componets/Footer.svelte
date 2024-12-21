<script>
	import logos from '$lib/images/new.png';
	import Instagram from '$lib/images/icons8-instagram-64.png';
	import Facebook from '$lib/images/icons8-facebook-novo-48.png';
	import Whatz from '$lib/images/icon-ws.png';
</script>

<main class="flex w-full bg-secondary-foreground">
	<div class="h-[310px] w-full bg-gradient-to-br">
		<div class="flex h-[250px] w-full items-center justify-center gap-5">
			<div class="flex h-[240px] w-[95%] flex-col items-center justify-center gap-2">
				<div class="flex h-[150px] w-[100%] items-center justify-center">
					<div class="flex h-[150px] w-[150px] flex-col items-center justify-center gap-4">
						<a href="/">
							<img class="h-[100px] w-[100px]" src="{logos} " alt="" />
						</a>
						<p class="text-white">Guia Luiz Antônio</p>

						<div class="flex space-x-4">
							<!-- Link do Facebook -->
							<a
								href="https://www.facebook.com/profile.php?id=61568178650325"
								target="_blank"
								rel="noopener noreferrer"
							>
								<img class="w-[40px]" src={Facebook} alt="Facebook" />
							</a>

							<!-- Link do Instagram -->
							<a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
								<img class="w-[40px]" src={Instagram} alt="Instagram" />
							</a>

							<!-- Link do WhatsApp -->
							<a href="https://wa.me/16996151725" target="_blank" rel="noopener noreferrer">
								<img class="w-[40px]" src={Whatz} alt="WhatsApp" />
							</a>
						</div>
					</div>
				</div>
				<div class="mt-5 flex h-[50px] w-[100%] items-center justify-center">
					<p class="text-white">© 2024 Todos os direitos reservados.</p>
				</div>
			</div>
		</div>
	</div>
</main>
