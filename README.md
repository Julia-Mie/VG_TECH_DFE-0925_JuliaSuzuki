# VG_TECH_DFE-0925_JuliaSuzuki
Este projeto é a entrega do Teste Técnico para vaga de Desenvoldor Front-end junior na Sparta.

Dentro do projeto, optei por uma identidade mais limpa, prezando pela organização e mantendo a coesão com a identidade visual da empresa (similar à que doi apresentada como referência no enunciado do desafio).Além disso, por se tratar de uma empresa tradicional do ramo, acredito que seria a opção mais condizente.

Quando examinei os dados de resposta dos endpoints fornecidos, percebi que o alto volume de dados fazia com que fosse fácil se perder e confundir informações. Pensando nisso, achei que um sistema que organizasse esses dados e permitisse filtrá-los seria a melhor alternativa:

- Página Agregados: organiza os dados do endpoint 1 em uma tabela interativa, listando os agregados por índice
- Página IPCA: resgata dados do IPCA por grupos do endpoint 2, permitindo sua filtragem por mês, variável e grupo para uma busca mais otimizada (P.S.: seria interessante utilizar gráficos para melhor comparação dos dados, mas não consegui terminar a tempo)

# Como Executar o Projeto

## 1. Clone o repositório bash
Pode ser por "Clonar" no próprio GitHub 

ou pelo terminal:
<pre>
git clone https://github.com/Julia-Mie/VG_TECH_DFE-0925_JuliaSuzuki.git
cd VG_TECH_DFE-0925_JuliaSuzuki
</pre>

## 2. Instale as dependências bash
- O projeto usa React.js, então é necessário que o node.js esteja baixado, caso não posua, o download pode ser feito em https://nodejs.org/.
- Por ter sido criado com Vite, as dependências (bootstrap e font awesome) serão instaladas ao rodar:
<pre>
  cd [path_para_o_repositorio]
  npm install
</pre>

## 3. Executar
Na pasta em que o projeto foi clonado, execute a seguinte linha no prompt de comando/terminal:
<pre> npm run dev </pre>
Isso iniciará o Vite no endereço https://localhost:5173, você pode acessar a aplicação diretamente pelo navegador ou digitar a letra "o" no menu do Vite exibido no terminal

