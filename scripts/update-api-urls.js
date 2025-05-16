/**
 * Script para atualizar todas as URLs de API de localhost para produção
 * 
 * Execute este script antes de fazer deploy para produção:
 * node scripts/update-api-urls.js
 * 
 * Isso irá substituir todas as ocorrências de localhost:3000 por api-backend-production-5b22.up.railway.app
 * e localhost:5173 por encontreluizantonio.com.br em todos os arquivos .svelte e .ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para obter o diretório atual com ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações
const sourceDir = path.join(__dirname, '../src');
const fileExtensions = ['.svelte', '.ts', '.js'];
const replacements = [
  { from: 'http://localhost:3000', to: 'https://api-backend-production-5b22.up.railway.app' },
  { from: 'http://localhost:5173', to: 'https://encontreluizantonio.com.br' }
];

// Contador para estatísticas
const stats = {
  filesProcessed: 0,
  filesModified: 0,
  replacementsCount: 0
};

// Função para processar um arquivo
function processFile(filePath) {
  try {
    // Ler o conteúdo do arquivo
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fileReplacementCount = 0;
    
    // Aplicar todas as substituições
    for (const replacement of replacements) {
      const regex = new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      
      if (matches) {
        fileReplacementCount += matches.length;
        content = content.replace(regex, replacement.to);
      }
    }
    
    // Apenas escrever de volta no arquivo se houve alterações
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      stats.filesModified++;
      stats.replacementsCount += fileReplacementCount;
      console.log(`✅ Atualizado: ${filePath} (${fileReplacementCount} substituições)`);
    }
    
    stats.filesProcessed++;
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
  }
}

// Função para percorrer diretórios recursivamente
function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Ignore node_modules e diretórios ocultos
      if (file !== 'node_modules' && !file.startsWith('.')) {
        walkDirectory(filePath);
      }
    } else if (stat.isFile() && 
              fileExtensions.includes(path.extname(filePath).toLowerCase())) {
      processFile(filePath);
    }
  }
}

// Início do script
console.log('🔄 Iniciando atualização de URLs...');
console.log(`📁 Processando diretório: ${sourceDir}`);

try {
  walkDirectory(sourceDir);
  
  console.log('\n📊 Resumo:');
  console.log(`   Arquivos processados: ${stats.filesProcessed}`);
  console.log(`   Arquivos modificados: ${stats.filesModified}`);
  console.log(`   Total de substituições: ${stats.replacementsCount}`);
  console.log('\n✅ Processo concluído com sucesso!');
  
  if (stats.replacementsCount > 0) {
    console.log(`\n⚠️  IMPORTANTE: Verifique as alterações antes de fazer o deploy.`);
    console.log(`   Os seguintes padrões foram substituídos:`);
    for (const replacement of replacements) {
      console.log(`   - "${replacement.from}" → "${replacement.to}"`);
    }
  } else {
    console.log(`\n🎉 Nenhuma substituição necessária. Seu código já está pronto para produção!`);
  }
} catch (error) {
  console.error(`\n❌ Erro durante o processamento:`, error.message);
  process.exit(1);
} 