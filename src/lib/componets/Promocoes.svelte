<script lang="ts">
	import pegarTokenUsuario from '$lib/help/pegarTokenUsuario';
	import { getAuth } from 'firebase/auth';
	import { Plus } from 'lucide-svelte';
	import { onMount } from 'svelte';

	export let activeTab;
	let promocoes: any[] = [];
	let novaPromocao = {
		titulo: '',
		descricao: '',
		desconto: '',
		dataInicio: '',
		dataFim: '',
		ativa: true
	};
	let isAddingPromocao = false;
	let successMessage = '';
	let errorMessage = '';

	onMount(() => {
		fetchPromocoes();
	});
	const auth = getAuth();

	const userId = auth.currentUser?.uid; // Garantindo que o userId seja capturado

	async function fetchPromocoes() {
		if (!userId) {
			errorMessage = 'Usuário não autenticado.';
			return;
		}

		try {
			const token = await pegarTokenUsuario(); // Pega o token do usuário
			const response = await fetch(`http://localhost:3000/painel/promocao/promocoes`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}` // Passando o token de autenticação
				}
			});

			if (!response.ok) {
				throw new Error('Erro na resposta do servidor');
			}

			promocoes = await response.json(); // Atualizando a lista de promoções
		} catch (error) {
			console.error('Erro ao buscar promoções:', error);
			errorMessage = 'Erro ao carregar promoções.';
		}
	}
	// port certa
	async function adicionarPromocao() {
		const token = await pegarTokenUsuario();

		try {
			// Corrigindo a URL para enviar a requisição corretamente ao backend
			const response = await fetch('http://localhost:3000/painel/promocao/promocoes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(novaPromocao) // A promoção que você quer adicionar
			});

			if (!response.ok) {
				throw new Error('Erro ao adicionar promoção');
			}

			successMessage = 'Promoção adicionada com sucesso!';
			setTimeout(() => {
				successMessage = '';
			}, 3000);

			novaPromocao = {
				titulo: '',
				descricao: '',
				desconto: '',
				dataInicio: '',
				dataFim: '',
				ativa: true
			};
			isAddingPromocao = false;

			fetchPromocoes(); // Para atualizar a lista de promoções após a adição
		} catch (error) {
			console.error('Erro ao adicionar promoção:', error);
			errorMessage = 'Erro ao adicionar promoção.';
		}
	}

	// Função para alternar o status da promoção
	async function alternarStatusPromocao(id: any) {
		const promocao = promocoes.find((p) => p.id === id);
		if (!promocao) return;

		// Inverte o status 'ativa'
		const novoStatus = !promocao.ativa;

		try {
			const token = await pegarTokenUsuario(); // Token de autenticação (se necessário)

			// Fazendo a requisição PUT para atualizar o status da promoção
			const response = await fetch(`http://localhost:3000/painel/promocao/promocoes/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ ativa: novoStatus })
			});

			if (!response.ok) {
				throw new Error('Erro ao atualizar status da promoção');
			}

			// Atualiza a lista de promoções localmente
			promocoes = promocoes.map((p) => {
				if (p.id === id) {
					return { ...p, ativa: novoStatus };
				}
				return p;
			});

			successMessage = 'Status da promoção atualizado com sucesso!';
			setTimeout(() => {
				successMessage = '';
			}, 3000);
		} catch (error) {
			console.error('Erro ao atualizar status da promoção:', error);
			errorMessage = 'Erro ao atualizar status da promoção.';
		}
	}
</script>

<div>
	{#if activeTab === 'promocoes'}
		<div>
			<div class="flex items-center justify-between">
				<h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Promoções</h1>
				<button
					on:click={() => (isAddingPromocao = !isAddingPromocao)}
					class="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
				>
					<Plus class="mr-1 h-5 w-5" />
					Nova Promoção
				</button>
			</div>

			{#if isAddingPromocao}
				<div class="mt-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
					<h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Nova Promoção</h3>
					<form on:submit|preventDefault={adicionarPromocao} class="space-y-4">
						<div class="grid gap-4 sm:grid-cols-2">
							<div>
								<label
									for="titulo"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300">Título:</label
								>
								<input
									type="text"
									id="titulo"
									bind:value={novaPromocao.titulo}
									required
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
								/>
							</div>
							<div>
								<label
									for="desconto"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
									>Desconto:</label
								>
								<input
									type="text"
									id="desconto"
									bind:value={novaPromocao.desconto}
									required
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
								/>
							</div>
						</div>
						<div>
							<label
								for="descricao"
								class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição:</label
							>
							<textarea
								id="descricao"
								bind:value={novaPromocao.descricao}
								required
								rows="3"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
							></textarea>
						</div>
						<div class="grid gap-4 sm:grid-cols-2">
							<div>
								<label
									for="dataInicio"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
									>Data de Início:</label
								>
								<input
									type="date"
									id="dataInicio"
									bind:value={novaPromocao.dataInicio}
									required
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
								/>
							</div>
							<div>
								<label
									for="dataFim"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300"
									>Data de Fim:</label
								>
								<input
									type="date"
									id="dataFim"
									bind:value={novaPromocao.dataFim}
									required
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
								/>
							</div>
						</div>
						<div class="flex justify-end space-x-2">
							<button
								type="submit"
								class="inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
							>
								Adicionar Promoçãos
							</button>
							<button
								type="button"
								on:click={() => (isAddingPromocao = false)}
								class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
							>
								Cancelar
							</button>
						</div>
					</form>
				</div>
			{/if}

			<div class="mt-6">
				<h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Suas Promoções</h3>
				{#if promocoes.length === 0}
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Você ainda não cadastrou nenhuma promoção.
					</p>
				{:else}
					<ul class="divide-y divide-gray-200 dark:divide-gray-700">
						{#each promocoes as promocao}
							<li class="py-4">
								<div class="flex items-center justify-between">
									<div>
										<h4 class="text-sm font-medium text-gray-900 dark:text-white">
											{promocao.titulo}
										</h4>
										<p class="text-sm text-gray-500 dark:text-gray-400">{promocao.descricao}</p>
									</div>
									<button
										on:click={() => alternarStatusPromocao(promocao.id)}
										class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
									>
										{promocao.ativa ? 'Desativar' : 'Ativar'}
									</button>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
				{#if successMessage}
					<p class="text-sm text-green-500">{successMessage}</p>
				{/if}
				{#if errorMessage}
					<p class="text-sm text-red-500">{errorMessage}</p>
				{/if}
			</div>
		</div>
	{/if}
</div>
