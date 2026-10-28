# Universo Giovanna

Site estático de aniversário, com a experiência interativa **O Arquivo das Sete Estrelas**. As seções originais continuam disponíveis: constelação de lembranças, testemunhos do Sol e da Lua, carta original e música.

## Desenvolvimento local

Na pasta do projeto, inicie um servidor estático:

```sh
python3 -m http.server 8000
```

Abra `http://localhost:8000`. Também é possível abrir `index.html` diretamente, mas um servidor local se comporta melhor com `localStorage`.

## Estrutura da investigação

As missões são sequenciais. Respostas, pistas reveladas e anotações ficam no navegador, sob a chave `universo-giovanna:arquivo-sete-estrelas:v1`. A carta secreta só aparece após a confirmação do selo da sétima missão. A carta original permanece separada e continua acessível pelo botão existente.

O dado `17/07`, associado à primeira vez em que Pedro e Giovanna ficaram, veio do briefing, mas ainda não foi confirmado. A interface o identifica como hipótese pendente; confirme com Pedro antes de tratá-lo como uma memória factual.

### Verificação técnica dos enigmas

1. As três dedicatórias do site convergem para `GIOVANNA`.
2. Para a cifra de deslocamento, A=1...Z=26: `GIOVANNA` soma 83 e `83 mod 26 = 5`. Recue cinco letras em `RJRTWNF` para obter `MEMORIA`. Os botões originais do Sol e da Lua precisam ser consultados; o Sol representa avanço e a Lua, retorno.
3. O resultado `MEMORIA` da missão anterior identifica o envelope cronológico válido; o envelope `DESTINO` é um recorte de outro arquivo. O registro selecionado `07/17` usa mês-dia. O calendário local usa dia-mês, e 17 não pode ser mês; a leitura reconstruída é `17/07`, registrada como pendente, e a resposta é `1707`.
4. No poema, pontuação não conta: use as iniciais da 1ª palavra do verso 1, da 7ª palavra do verso 2 e da 7ª palavra do verso 3. O índice `1707` separa-se em `1`, `7` e `7` pelo zero, revelando `LUA`.
5. Vigenère usa A=0...Z=25. Para cifrar, repita `LUA` até obter `LUALU` e some os valores, módulo 26: `LACOS` torna-se `WUCZM`. Para decifrar, subtraia a chave: `Pᵢ = (Cᵢ - Kᵢ + 26) mod 26`. A normalização remove acentos antes da comparação, portanto `LAÇOS` também é aceito.
6. O primeiro fragmento declara ser a origem; cada fragmento seguinte exige imediatamente o anterior, e o último se declara imediatamente após os laços. Isso determina a única cadeia: identidade → astros → data → poema → cifra → laços → página final. As iniciais resultam em `ABRACOS`.
7. O selo reúne, na ordem, `GIOVANNA MEMORIA 1707 LUA LACOS ABRACOS`.

O código e o progresso são entregues ao navegador. Isso é um mistério recreativo, não controle de acesso: respostas e estado podem ser inspecionados ou alterados pelo visitante. Para reiniciar, remova `universo-giovanna:arquivo-sete-estrelas:v1` do armazenamento local do site nas ferramentas de desenvolvimento do navegador.

## Testes

Verificações executáveis disponíveis sem dependências:

```sh
node --check script.js
git diff --check
```

Durante a implementação, um harness DOM simulou o percurso completo: respostas erradas e corretas, acentos, três pistas, consulta obrigatória aos dois astros, ordem incorreta e correta dos fragmentos, carta bloqueada e restauração de progresso/anotações. Não havia navegador headless instalado para conferir console real ou capturas em telas físicas; faça essa checagem no navegador antes de publicar.

## Publicação no GitHub Pages

Os arquivos do site ficam na raiz. Envie as alterações para o repositório e, em **Settings → Pages**, selecione **Deploy from a branch**, a branch publicada (normalmente `main`) e a pasta `/ (root)`. Salve a configuração e aguarde a conclusão do deploy do Pages.
