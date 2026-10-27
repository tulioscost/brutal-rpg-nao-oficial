#!/usr/bin/env python3
"""Gera três acervos JSON originais para criação de compêndios de mundo em Foundry v14.
Todos os nomes, enredos e objetos são originais; somente combinações de Ameaças e
Arquétipos usam terminologia mecânica de BRUTAL RPG 0.3.
"""
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'data'/'compendios'
OUT.mkdir(parents=True,exist_ok=True)
# name | title or role | location | history seed | secret | signature | lore clue | threat1 | threat2 | 3 items
killers_txt="""
O Operador do Último Trem|ex-condutor|estação desativada|Foi responsabilizado por um descarrilamento que a companhia encobriu. Anos depois, passageiros recebem bilhetes de uma linha que não consta em mapa algum; as portas só se abrem para quem confessar por que embarcou.|O trem nunca existiu naquela noite: os relatos foram fabricados para apagar uma greve.|Apita três vezes antes de surgir entre os vagões.|Escala de turnos carimbada com o nome de uma vítima antes de seu nascimento.|estrategico|perseguidor|Lanterna ferroviária;Bilhete perfurado;Chave de manutenção
A Costureira das Fitas|figurinista desaparecida|teatro municipal|Uma figurinista que sustentava o teatro com consertos noturnos passou a ouvir vozes nos camarins vazios. Após o incêndio do depósito, vestidos começaram a aparecer em corpos de manequins com as medidas de moradores desaparecidos.|Ela não é a mulher desaparecida, mas alguém que usou seu nome para tomar o lugar no elenco.|Deixa uma fita vermelha presa à maçaneta.|Livro de medidas com duas caligrafias e datas incompatíveis.|desconhecido|mestre|Tesoura de alfaiate;Fita métrica vermelha;Máscara de ensaio
O Vigia do Reservatório|ex-fiscal de água|represa e túnel de drenagem|Sua última inspeção terminou com o fechamento de uma comporta enquanto moradores ainda procuravam um adolescente. Desde então uma figura encapuzada ronda as galerias quando a sirene da barragem deixa de funcionar.|O registro da comporta prova que ele tentou impedir o fechamento e foi trancado pelo superior.|Bate uma haste nos canos para escutar quem se esconde.|Caderno impermeável com sequência de válvulas e horários.|obstinado|brutamontes|Haste de sondagem;Cadeado de comporta;Caderno impermeável
A Matriarca do Pavilhão|ex-diretora escolar|internato abandonado|Impunha um código de silêncio às alunas e apagava os nomes de quem questionasse suas regras. O internato fechou depois da fuga de uma turma inteira; décadas mais tarde, a campainha volta a tocar dentro das salas lacradas.|Os nomes riscados eram uma tentativa de proteger as meninas de um perseguidor externo.|Apaga as luzes na ordem inversa da chamada.|Livro de ocorrências com páginas reordenadas.|mestre|estrategico|Régua de madeira;Livro de ocorrências;Sino escolar
O Boticário de Vidro|colecionador de frascos|farmácia histórica|O farmacêutico adorava ouvir pacientes contando sonhos e registrava cada pesadelo como se fosse uma receita. A reforma da farmácia revelou um depósito de frascos etiquetados com nomes de pessoas ainda vivas.|Suas anotações foram produzidas por pacientes em um experimento coletivo de sugestão.|Faz tilintar vidro no escuro antes de qualquer aparição.|Receituário com assinaturas idênticas em épocas diferentes.|inato|carniceiro|Estojo de frascos;Receituário antigo;Ampulheta quebrada
A Noiva do Farol|faroleira desaparecida|ilha rochosa|Numa noite de tempestade, o farol apagou e uma embarcação encalhou na costa. Desde então o feixe da luz gira ao contrário quando visitantes mentem sobre o que vieram buscar.|A lanterna foi desligada para impedir que contrabandistas localizassem refugiados.|Arrasta pela escada uma corrente enferrujada.|Diário de bordo sobre uma travessia omitida dos jornais.|assombracao|perseguidor|Corrente de ancoragem;Lanterna de sinalização;Diário de bordo
O Homem dos Cartazes|ex-projecionista|cinema de rua|Um projetista foi demitido quando a última sessão terminou em pânico e o bairro passou a acusá-lo de manipular imagens. Na reabertura clandestina da sala, cartazes exibem rostos do público onde antes havia atores.|A projeção revela uma fita de segurança adulterada pela empresa de vigilância.|Aparece sempre que os créditos estão prestes a subir.|Rolo de filme com cena gravada fora de ordem.|desconhecido|estrategico|Rolo de película;Estilete de montagem;Chave da cabine
A Caçadora da Geada|guia de montanha|hotel no alto da serra|A única guia que conhecia trilhas de resgate perdeu a licença depois de um acidente coletivo. Quando a nevasca fecha a estrada, sinais de botas idênticas aparecem diante de quartos que ninguém ocupou.|O acidente foi provocado por um alerta meteorológico suprimido para evitar cancelamentos.|Marca as janelas com um círculo feito de gelo.|Mapa de emergência assinado pelo gerente do hotel.|obstinado|perseguidor|Piolet de escalada;Apito de resgate;Mapa plastificado
O Técnico da Frequência|radialista noturno|torre de retransmissão|Um programa de pedidos musicais começou a receber ligações de telefones já desconectados. O técnico que apagou a gravação final da emissora volta a transmitir mensagens direcionadas a hóspedes de uma pousada vizinha.|A gravação intercepta conversas privadas da equipe que encobriu um desaparecimento.|As vozes chegam pelo rádio antes de seus passos.|Fita cassete cuja bobina roda ao contrário.|maquina|estrategico|Gravador portátil;Antena telescópica;Fita de áudio
A Senhora das Chaves|zeladora de condomínio|prédio interditado|Durante anos recebeu cartas destinadas a moradores que não figuravam no livro da portaria. Após o desabamento de um andar, as fechaduras se multiplicaram e a antiga zeladora passou a vigiar portas inexistentes.|A planta oficial foi adulterada para esconder um apartamento clandestino.|Devolve sempre as chaves à pessoa errada.|Chave numerada para um andar que não aparece no elevador.|mestre|obstinado|Molho de chaves;Prancheta da portaria;Lanterna de emergência
O Jardineiro das Cinzas|paisagista municipal|jardim botânico fechado|O zelador manteve estufas funcionando mesmo quando o parque ficou sem orçamento. Depois que uma coleção rara sumiu, ele começou a reconstruir canteiros com objetos pessoais de visitantes.|As plantas roubadas foram vendidas pela administração, não por ele.|Ouve-se sua pá tocar pedra antes que os caminhos mudem.|Livro de entrada das espécies com valores de leilão.|monstruosidade|inato|Pá de jardinagem;Caderno botânico;Tesoura de poda
A Viúva da Rodovia|socorrista voluntária|posto de parada isolado|Depois de atender uma colisão em massa, uma socorrista passou a exigir que viajantes refizessem as últimas decisões tomadas antes da viagem. Seu posto só aparece nos mapas quando a estrada está interditada.|Ela procura o verdadeiro responsável pela falha nos freios de um ônibus, não vingança aleatória.|Oferece água antes de perguntar o destino.|Cracha de socorro;Cones refletivos;Ficha de atendimento.|amaldicoado|assombracao|Colete refletivo;Maleta de primeiros socorros;Ficha de atendimento
O Zelador do Aquário|biólogo demitido|oceanário vazio|Um cuidador proibiu a retirada de animais durante uma reforma e desapareceu nos túneis de filtragem. Nas visitas noturnas, os vidros exibem reflexos de pessoas que não estão no recinto.|As gravações provam que a suposta fuga foi organizada para ocultar descarte irregular.|Bate no vidro do lado de dentro.|Cartão de acesso molhado e uma senha incompleta.|inato|descontrolado|Arpão de manutenção;Cartão magnético;Roupa de mergulho
A Médica do Quarto Treze|plantonista afastada|hospital de campanha|Numa noite de apagão, a médica perdeu a lista de pacientes e foi acusada de trocar identidades. Seu uniforme reaparece sempre que uma pessoa tenta sair do prédio antes da alta.|Os documentos foram falsificados por uma empresa contratada para reduzir custos.|Recita nomes completos que ninguém lhe contou.|Pulseira de identificação com três códigos.|carniceiro|estrategico|Prontuário lacrado;Lanterna clínica;Pulseira hospitalar
O Pastor da Antena|líder comunitário|acampamento de peregrinação|Atraía gente para vigílias sob uma velha antena, prometendo que as luzes do céu responderiam perguntas. Quando a transmissão parou, seus seguidores ouviram a própria voz pedir socorro.|A frequência está ligada a um sistema de aviso experimental abandonado.|Repete o último pedido de cada pessoa.|Caderno de hinos com anotações técnicas ocultas.|amaldicoado|mestre|Sino de mão;Caderno de hinos;Rádio de ondas curtas
A Mímico da Praça|artista de rua|feira noturna|Uma performer desapareceu na noite em que a feira perdeu suas licenças. Sua versão mascarada passou a repetir os gestos de visitantes e a bloquear saídas que deveriam estar abertas.|Há duas artistas; uma delas foi testemunha do caso e assumiu o papel para encontrar a irmã.|Só move o corpo quando alguém pisca.|Cartaz de espetáculo com assinaturas duplicadas.|descontrolado|perseguidor|Máscara de porcelana;Luvas brancas;Espelho compacto
O Cobrador de Pedágio|funcionário terceirizado|estrada particular|Após a instalação de cancelas automáticas, motoristas relataram cobranças por viagens que não realizaram. Um homem vestido com uniforme antigo guarda recibos e exige que sejam pagos em lembranças.|O sistema de placas foi usado para perseguir denunciantes de uma fraude empresarial.|Estampa cada recibo com uma hora diferente.|Caixa registradora com rolo de papel que não termina.|maquina|obstinado|Carimbo numérico;Livro de recibos;Bastão luminoso
O Cronista das Marés|historiador local|vila costeira vazia|Catalogou naufrágios até encontrar uma lista de sobreviventes que contrariava o monumento oficial. Os visitantes da vila passam a ouvir seus próprios nomes durante a leitura pública das vítimas.|O monumento celebra um resgate que nunca ocorreu: a comunidade encobriu os abandonados.|Lê nomes no exato instante em que a maré sobe.|Mapa de correntes com rota terrestre marcada à mão.|assombracao|mestre|Livro de registros;Bússola marítima;Sino náutico
O Palhaço do Retorno|animador de festas|parque de diversões fechado|Foi a última pessoa a operar um carrossel antes de uma pane durante a inauguração. Anos depois, convites anônimos prometem que todos terão uma segunda chance de terminar a festa.|Não houve pane mecânica: alguém alterou o sinal de emergência.|Entrega ingressos numerados a pessoas que já fugiram uma vez.|Relação de convidados com numeração repetida.|monstruosidade|descontrolado|Buzina de brinquedo;Ingresso perfurado;Chave do carrossel
A Restauradora dos Retratos|curadora de museu|mansão transformada em galeria|Uma restauradora recebia quadros anônimos de pessoas que nunca haviam posado. Depois da inauguração de uma sala secreta, visitantes começaram a reconhecer detalhes de seus próprios quartos nas pinturas.|A curadora não pinta os retratos; tenta apagar indicações deixadas por um fotógrafo clandestino.|Vira os quadros para a parede ao ouvir passos.|Negativo fotográfico com uma janela escondida.|desconhecido|inato|Espátula de restauro;Álbum de retratos;Chave da moldura
""".strip()
survivors_txt="""
Lia Azevedo|heroina|operadora de resgate|Deixou a equipe de busca após uma operação em que seguiu o protocolo e perdeu a chance de salvar o irmão. Ao receber uma chamada de rádio com a voz dele, vai investigar o reservatório interditado.|Ouvinte secreto da frequência de emergência|Bússola herdada|Proteger a sobrinha Júlia|Provar que os registros de resgate foram alterados|Reservatório|Lanterna de emergência;Corda de salvamento;Bússola marítima
Davi Uchoa|atleta|entregador ciclista|Conhece rotas que os aplicativos ignoram, mas sua pressa causou um acidente que ainda esconde. Uma entrega sem remetente conduz à estação onde o último trem deveria ter parado.|Testemunha de uma despedida na plataforma|Campainha da bicicleta|Voltar a conversar com a mãe|Encontrar o dono do pacote anônimo|Estação|Capacete de ciclista;Lanterna de bolso;Bilhete perfurado
Mina Okafor|nerd|estudante de áudio|Restaura gravações de rádio e descobriu vozes cortadas de uma transmissão pública. Trabalha na biblioteca durante o dia e sobe a torre à noite para comparar arquivos.|Foi ela quem enviou uma gravação ao jornal local|Fone de ouvido remendado|Cuidar da irmã pequena|Descobrir quem alterou a fita mestre|Torre|Gravador portátil;Pilhas sobressalentes;Cópia de gravação
Rafaela Sato|cetica|engenheira civil|Inspecionou um prédio condenado e assinou um relatório sob pressão para manter o emprego. Quando novas portas aparecem em apartamentos vazios, retorna para conferir a planta original.|Guarda uma cópia nunca protocolada do laudo|Lapiseira metálica|Reconquistar a confiança da equipe|Expor a fraude da obra|Condomínio|Planta arquitetônica;Multímetro;Lanterna de emergência
Teo Nascimento|relaxada|assistente de produção|O único membro de uma equipe audiovisual que não se impressiona com superstições passou a receber cortes de vídeo que ninguém filmou. Volta ao cinema fechado com uma filmadora emprestada.|O filme final revela uma discussão que ele apagou|Chaveiro de claquete|Proteger a amiga de infância|Montar o filme proibido|Cinema|Filmadora portátil;Rolo de película;Chave da cabine
Bruna Cavalcanti|valentona|segurança de eventos|Cansada de ser chamada de agressiva por impedir um tumulto, aceitou trabalhar no teatro municipal durante a reabertura. Reconhece a fita vermelha deixada na porta de serviço.|Sua irmã costurou os uniformes do teatro|Pulseira de metal|Encontrar a irmã|Descobrir quem abriu o depósito|Teatro|Apito de segurança;Lanterna de bolso;Fita métrica vermelha
Yara Freitas|inocente|voluntária de biblioteca|Chegou à vila costeira para catalogar arquivos históricos e encontrou nomes riscados em documentos públicos. Pensa que os moradores estão brincando com ela até ouvir sua história em um sino.|Sua avó consta entre os desaparecidos|Postal antigo|Visitar o lugar de origem da família|Restituir os nomes perdidos|Vila costeira|Caderno de campo;Bússola marítima;Postal de família
Íris Vieira|esbelta|estudante de moda|Quer ser figurinista e ganhou acesso aos arquivos do teatro após um concurso de figurinos. Os vestidos parecem mudar de tamanho durante a madrugada, mas as etiquetas apontam para seu antigo sobrenome.|Sua família comprou parte do acervo sem recibo|Colar de linha vermelha|Superar a rivalidade com a prima|Recuperar uma peça de roupa da infância|Teatro|Estojo de costura;Tesoura de alfaiate;Cartaz de espetáculo
Caio Menezes|heroina|guarda-parque|Fez do jardim botânico seu primeiro emprego e considera cada trilha uma memória. Reúne antigos voluntários quando uma estufa aparece trancada por dentro.|Sabe que o depósito de sementes foi esvaziado antes do fechamento|Canivete de cabo verde|Cuidar do antigo mentor|Descobrir quem vendeu as plantas|Jardim|Mapa botânico;Rádio de ondas curtas;Corda de salvamento
Nádia Rodrigues|atleta|nadadora de águas abertas|Preparava-se para sua primeira travessia oceânica quando o sinal do farol mudou de direção. O mar parece devolver objetos perdidos conforme a luz gira.|Seu treinador participou da travessia que sumiu|Touca azul desgastada|Reconciliar-se com o treinador|Terminar a travessia interrompida|Farol|Colete salva-vidas;Lanterna de sinalização;Apito de resgate
Elias Brandão|nerd|técnico de informática|Consertava o software de cancela do pedágio quando percebeu cobranças duplicadas em placas antigas. Perdeu o emprego ao tentar salvar o arquivo de logs.|Manteve uma cópia criptografada do banco|Pendrive de etiqueta laranja|Ajudar o pai caminhoneiro|Encontrar a origem da fraude|Pedágio|Pendrive criptografado;Multímetro;Bastão luminoso
Salma Haddad|cetica|jornalista investigativa|Chegou ao hospital para conferir uma lista de pacientes, porém encontrou duas fichas com o próprio nome. Prefere provas a boatos, mas evita falar da noite em que desapareceu por horas.|Seu crachá abre uma ala que deveria estar selada|Bloco com capa preta|Reaproximar-se da editora|Publicar o caso verdadeiro|Hospital|Prontuário lacrado;Gravador portátil;Lanterna clínica
Júlia Penha|relaxada|fotógrafa de festas|Acha que conseguiu um trabalho fácil no parque fechado: fotografar uma comemoração privada. Descobre que os convites trazem as mesmas pessoas em idades diferentes.|Uma foto sua aparece num aniversário anterior ao nascimento dela|Câmera descartável|Ajudar seu namorado|Encontrar a fotografia original|Parque|Câmera instantânea;Ingresso perfurado;Canivete pequeno
Vitor Amarante|valentona|mecânico de ônibus|Reparava veículos de excursão até identificar uma peça instalada fora das especificações. Sua denúncia sumiu na mesma noite de um acidente na estrada.|Ele foi pago para não reabrir a inspeção|Chave inglesa do avô|Cuidar de sua equipe|Fazer a verdade chegar às famílias|Rodovia|Jogo de ferramentas;Colete refletivo;Ficha de atendimento
Maíra Campos|inocente|estagiária de enfermagem|Durante um plantão voluntário, encontrou pulseiras de identificação trocadas e tentou corrigir o erro antes da chefia chegar. Agora retorna ao hospital a pedido de uma pessoa sem prontuário.|É portadora da única chave que abre o arquivo em papel|Broche de estrela|Preservar uma amizade no estágio|Encontrar o paciente sem registro|Hospital|Maleta de primeiros socorros;Pulseira hospitalar;Prontuário lacrado
Aurora Antunes|esbelta|cantora amadora|Um empresário prometeu gravar seu primeiro clipe no cinema restaurado, mas o cartaz de estreia a mostra com um rosto que não é o seu. Tem medo de revelar que roubou um trecho de música.|O refrão denuncia o local do microfone oculto|Anel de plástico cintilante|Não decepcionar o coral|Descobrir quem a filmou|Cinema|Microfone de mão;Filmadora portátil;Chave da cabine
Pedro Benício|heroina|bombeiro voluntário|Foi chamado para buscar um desaparecido na serra e encontrou o hotel fechado por uma frente fria. A planta de evacuação não corresponde aos corredores em que sua equipe anda.|Já esteve no hotel anos atrás e apagou sua assinatura do livro|Mosquetão azul|Encontrar o colega afastado|Corrigir um erro de resgate|Hotel|Corda de salvamento;Piolet de escalada;Apito de resgate
Keila Amorim|atleta|instrutora de dança|Ensaiava um espetáculo no salão do internato restaurado quando um sino interrompeu o som. Conhece a coreografia de uma turma antiga sem nunca tê-la estudado.|A gravação do ensaio revela passos fora da contagem|Sapatos vermelhos de aula|Proteger seu grupo|Entender quem enviou o convite|Internato|Rádio portátil;Sino escolar;Caderno de campo
Tainá Ribeiro|nerd|restauradora de documentos|Especializou-se em documentos frágeis e recebeu a encomenda de recuperar um álbum encontrado numa galeria. As fotos revelam cômodos que ainda não foram construídos.|Um negativo contém sua assinatura futura|Lupa de bolso|Trabalhar com seu pai|Descobrir quem fotografou o álbum|Galeria|Lupa de inspeção;Negativo fotográfico;Álbum de retratos
Samir Fernandes|cetica|técnico de saneamento|Foi designado para localizar um vazamento no aquário fechado. Ao analisar o fluxo da água, percebe que a drenagem funciona quando todos os motores estão desligados.|O sensor de pressão estava sendo falsificado manualmente|Caneta de medição|Voltar a estudar biologia|Expor irregularidades ambientais|Aquário|Multímetro;Roupa de mergulho;Cartão magnético
Luana Vieira|relaxada|motorista de aplicativo|Conhece os postos da rodovia e costuma dar carona a desconhecidos. Quando o GPS manda fazer retorno para uma estrada inexistente, decide acompanhar um passageiro até um posto sem funcionários.|O último passageiro deixou um telefone com chamada aberta|Chaveiro em forma de nuvem|Buscar o filho na escola|Sair da estrada com todos os passageiros|Rodovia|Mapa rodoviário;Colete refletivo;Maleta de primeiros socorros
Otávio Costa|valentona|ex-lutador de bairro|Virou vigia de eventos na praça após abandonar competições. Repara que a mímica noturna repete um gesto que só sua irmã conhece e insiste em falar com a artista.|Sua irmã participou do show que antecedeu a interdição|Bandagem de treino|Fazer as pazes com a irmã|Impedir o novo cancelamento da feira|Feira|Luvas de proteção;Espelho compacto;Apito de segurança
Cecília Moura|inocente|professora substituta|Aceitou dar aulas num internato que reabrirá para uma turma piloto. Encontra cartas escondidas sob carteiras e decide devolvê-las aos autores, embora nenhum nome exista no registro escolar.|Seu sobrenome aparece em uma lista de matrícula apagada|Carimbo de borboleta|Conseguir aprovação da escola|Proteger os alunos|Internato|Livro de ocorrências;Chave de arquivo;Lanterna de bolso
Bia Duarte|esbelta|influenciadora de viagens|Foi convidada a avaliar uma pousada na ilha, mas sua publicação de chegada mostra o farol aceso mesmo quando ele estava apagado. O patrocinador exige que ela não apague as imagens.|O contrato foi assinado por alguém da ilha anos antes|Óculos cor-de-rosa|Cuidar da mãe|Descobrir quem financia a visita|Farol|Câmera instantânea;Lanterna de sinalização;Diário de bordo
""".strip()
# Objects organized by scope. Standard Resources = 3 uses, Pistas = 5 shared uses, equipment = 0 uses.
resources_txt="""
Lanterna de emergência|Ilumina áreas sem energia e ajuda a localizar inscrições no escuro.|A bateria fica instável sob chuva.
Lanterna de bolso|Oferece luz móvel em corredores e passagens estreitas.|O feixe é visível à distância.
Corda de salvamento|Auxilia travessias e resgates em locais perigosos.|Precisa de ponto seguro de ancoragem.
Bússola marítima|Permite orientar-se em áreas sem referências visuais.|Sua agulha pode revelar anomalias narrativas.
Gravador portátil|Registra sons, pistas e ameaças sem depender de rede.|A gravação pode conter ruído.
Pilhas sobressalentes|Mantêm equipamentos simples em funcionamento.|É necessário aparelho compatível.
Planta arquitetônica|Revela saídas previstas e espaços ocultos de edifícios.|Reformas podem ter alterado o plano.
Multímetro|Auxilia na verificação de circuitos e painéis.|Não substitui ferramentas especializadas.
Filmadora portátil|Permite examinar detalhes que passaram despercebidos.|A bateria e a memória são limitadas.
Lanterna de sinalização|Emite sinais visíveis à distância.|Pode denunciar a posição do grupo.
Apito de resgate|Produz aviso audível em espaços amplos.|O som também atrai atenção.
Mapa botânico|Ajuda a localizar trilhas de serviço em áreas verdes.|O mapa é antigo.
Rádio de ondas curtas|Capta comunicação fora da cobertura de celulares.|Sujeito a interferência e chiados.
Colete salva-vidas|Ajuda uma pessoa em travessias aquáticas.|Não elimina riscos do ambiente.
Jogo de ferramentas|Permite intervenções simples em estruturas e mecanismos.|É volumoso e incompleto.
Maleta de primeiros socorros|Torna possível prestar cuidados narrativamente pertinentes.|O tratamento segue as regras de ferimentos do manual.
Lupa de inspeção|Ajuda a examinar detalhes de documentos e superfícies.|Exige tempo e iluminação.
Câmera instantânea|Registra imagens sem conexão com a internet.|O número de poses é limitado.
Mapa rodoviário|Oferece alternativa aos aplicativos de navegação.|Não reflete bloqueios recentes.
Caderno de campo|Organiza descobertas e desenhos de localização.|Anotações podem ser perdidas.
Chave de arquivo|Abre armários compatíveis quando obtida legitimamente na ficção.|Não funciona em toda fechadura.
Roupa de mergulho|Ajuda a suportar água fria em determinada cena.|Não fornece oxigênio.
Rádio portátil|Mantém contato a curta distância, se houver sinal.|Canal pode ser interceptado.
Canivete pequeno|Serve para reparos e soluções improvisadas.|Não concede dano mecânico adicional.
Lanterna clínica|Auxilia exames e leitura de documentos em pouca luz.|Foco estreito.
Luvas de proteção|Permitem tocar superfícies ásperas ou contaminadas com segurança limitada.|Não fornecem imunidade a efeitos.
Pendrive criptografado|Permite transportar provas digitais para análise.|O conteúdo requer acesso adequado.
Câmera térmica|Permite observar fontes de calor em ambientes difíceis.|Não identifica intenções ou seres sobrenaturais.
Fita adesiva reforçada|Serve a reparos improvisados e marcação de caminhos.|Adesão limitada em superfícies molhadas.
Kit de costura|Permite reparos temporários de vestimentas e acessórios.|Não substitui tratamento de ferimentos.
""".strip()
clues_txt="""
Bilhete perfurado|A sequência de furos indica uma plataforma fora do mapa público.|Estação
Rolo de película|O último fotograma mostra uma pessoa saindo pela cabine de projeção.|Cinema
Fita de áudio|O silêncio da gravação contém um pedido de ajuda em baixa frequência.|Torre
Prontuário lacrado|O número do leito contradiz o mapa da ala hospitalar.|Hospital
Pulseira hospitalar|O código identifica um paciente internado sob nome falso.|Hospital
Diário de bordo|A rota oficial foi corrigida após o desaparecimento da embarcação.|Farol
Negativo fotográfico|Uma janela reflete um corredor que não aparece nas plantas.|Galeria
Cartão magnético|Abre um acesso secundário da área técnica, se o leitor ainda funciona.|Aquário
Livro de ocorrências|Notas apagadas ligam uma turma a um fechamento antigo.|Internato
Caderno impermeável|O registro das válvulas mostra a ordem real de fechamento.|Reservatório
Fita métrica vermelha|Marcas de tinta ligam duas figuras aos figurinos antigos.|Teatro
Ingresso perfurado|A numeração identifica dois convites para o mesmo assento.|Parque
Ficha de atendimento|A assinatura aponta para alguém que esteve no posto antes da colisão.|Rodovia
Livro de recibos|Uma cobrança aparece para um veículo que estava apreendido.|Pedágio
Mapa de correntes|Há uma rota de fuga que só funciona na maré baixa.|Vila costeira
Planta de emergência|Indica um depósito escondido atrás de uma parede falsa.|Hotel
Álbum de retratos|A ordem das fotografias produz uma mensagem codificada.|Galeria
Cópia de gravação|Um segundo canal de áudio revela a voz do operador oculto.|Torre
Cartaz de espetáculo|O programa lista uma substituta nunca anunciada.|Teatro
Postal de família|A mensagem no verso registra um endereço suprimido do mapa.|Vila costeira
Mapa da administração|Mostra como alcançar um arquivo lacrado sem cruzar os corredores centrais.|Condomínio
""".strip()
gear_txt="""
Campainha da bicicleta|Lembrança de trabalho e de uma rota conhecida.
Capacete de ciclista|Protege a cabeça em cena; efeito mecânico depende da Diretora.
Fone de ouvido remendado|Objeto afetivo ligado às gravações de família.
Lapiseira metálica|Permite marcar plantas e anotar observações.
Chaveiro de claquete|Souvenir de uma equipe de filmagem.
Apito de segurança|Produz sinal agudo para reunir uma equipe.
Postal antigo|Lembrança da cidade de origem da família.
Estojo de costura|Contém agulhas, linhas e materiais comuns.
Tesoura de alfaiate|Ferramenta de corte pertencente ao ateliê.
Canivete de cabo verde|Lembrança do primeiro trabalho de férias.
Touca azul desgastada|Equipamento de natação com valor afetivo.
Bastão luminoso|Sinalizador de trânsito e emergência.
Bloco com capa preta|Caderno de entrevistas e rascunhos.
Filmadora antiga|Peça de coleção com uso narrativo.
Chave inglesa do avô|Objeto ligado à oficina familiar.
Broche de estrela|Presente recebido na primeira semana de estágio.
Anel de plástico cintilante|Adorno usado em apresentação musical.
Piolet de escalada|Ferramenta de montanha especializada.
Sapatos vermelhos de aula|Calçado de dança de valor sentimental.
Colar de linha vermelha|Lembrança da infância e de um antigo ateliê.
Buzina de brinquedo|Objeto cênico estridente.
Livro de registros|Coletânea de nomes e datas da vila.
Sino náutico|Peça retirada de uma antiga embarcação.
Máscara de porcelana|Adereço de espetáculo.
Luvas brancas|Peça do figurino de uma artista de rua.
Espelho compacto|Permite examinar um reflexo ou ponto cego.
Haste de sondagem|Ferramenta longa de manutenção.
Cadeado de comporta|Objeto de controle de manutenção.
Prancheta da portaria|Contém anotações de turno.
Ampulheta quebrada|Objeto decorativo de significado incerto.
Chave do carrossel|Aciona um painel compatível apenas no cenário.
Espátula de restauro|Ferramenta delicada para conservar pinturas.
Régua de madeira|Material escolar conservado desde o internato.
Sino escolar|Peça que sinaliza intervalos e horários.
Estojo de frascos|Pequenos recipientes vazios de laboratório.
Receituário antigo|Papel de receitas com datas de décadas passadas.
Corrente de ancoragem|Ferro marítimo pesado, de difícil transporte.
Estilete de montagem|Ferramenta para cortar película.
Pá de jardinagem|Ferramenta comum do jardim botânico.
Tesoura de poda|Ferramenta de jardinagem com trava.
Colete refletivo|Roupa de alta visibilidade rodoviária.
Molho de chaves|Chaves sem etiquetas confiáveis.
Cartão de acesso|Cartão corporativo com código gasto.
Caderno de hinos|Músicas e anotações pessoais.
Máscara de ensaio|Adereço de teatro usado para ocultar o rosto.
Microfone de mão|Equipamento de apresentação.
Carimbo numérico|Marca documentos com sequência manual.
Rádio de comunicação|Transceptor simples de alcance limitado.
""".strip()

def parse(txt,n):
    out=[]
    for i,l in enumerate(txt.splitlines(),1):
        a=[x.strip() for x in l.split('|')]
        if len(a)!=n: raise ValueError(f'linha {i} esperava {n}, possui {len(a)}: {l}')
        out.append(a)
    return out

def slug(s):
    import unicodedata
    return re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()).strip('-')

def item(name,kind,desc,notes='',scene=''):
    uses=5 if kind=='pista' else 3 if kind=='recurso' else 0
    return dict(name=name,type=kind,img=(f'systems/brutal-rpg/assets/{kind}.svg'),flags={'brutal-rpg':{'sourceId':f'item-{slug(name)}','edition':'0.2.0','original':True}},system=dict(description=desc,page=80 if kind=='recurso' else 81 if kind=='pista' else 0,notes=(f'{notes} '+('Pista compartilhada: 5 usos; a Diretora não pode reduzi-los.' if kind=='pista' else 'Objeto narrativo: sem bônus próprio; consulte a Diretora.' if kind=='equipamento' else 'Um Recurso por Sobrevivente; 3 usos.')).strip(),scene=scene,uses=dict(value=uses,max=uses)))
items=[]
for a in parse(resources_txt,3): items.append(item(a[0],'recurso',a[1],a[2]))
for a in parse(clues_txt,3): items.append(item(a[0],'pista',a[1],scene=a[2]))
for a in parse(gear_txt,2):
    if a[0] in {i['name'] for i in items}:continue
    items.append(item(a[0],'equipamento',a[1]))
items_by_name={i['name']:i for i in items}
# Ensure characters' inventory can use each requested object without silently omitting it.
killers=[]
for i,(name,role,place,history,secret,mark,clue,t1,t2,equip) in enumerate(parse(killers_txt,10)):
    gear=[x.strip() for x in equip.split(';')]
    embedded=[]
    for g in gear:
        if g not in items_by_name: # unknown scenic object -> make narratively useful, not mechanically empowered
            created=item(g,'equipamento',f'Objeto ligado à história de {name}; peça recorrente no cenário {place}.')
            items.append(created);items_by_name[g]=created
        entry={k:v for k,v in items_by_name[g].items() if k!='flags'}
        # Itens na posse do Assassino são elementos narrativos e não Recursos de Intérprete.
        entry=json.loads(json.dumps(entry))
        entry['type']='equipamento';entry['system']['uses']={'value':0,'max':0}
        entry['system']['notes']='Acessório do Assassino: uso e efeito definidos narrativamente pela Diretora.'
        embedded.append(entry)
    nb={'amaldicoado':2,'assombracao':2,'brutamontes':3,'carniceiro':3,'desconhecido':1,'descontrolado':3,'estrategico':1,'inato':2,'maquina':2,'mestre':1,'monstruosidade':3,'obstinado':2,'perseguidor':2}
    total=nb[t1]+nb[t2]
    biography=f'{name} — {role} que assombra {place}. {history} Sua presença não precisa resultar em confronto imediato: cada sinal de passagem convida o grupo a investigar, negociar ou fugir. A Diretora pode revelar a cronologia em cenas curtas e permitir que as Sobreviventes descubram contradições antes de expor o perigo.'
    killers.append(dict(name=name,type='assassino',img='systems/brutal-rpg/assets/killer.svg',flags={'brutal-rpg':{'sourceId':f'assassino-{i+1:02d}','original':True,'edition':'0.2.0'}},prototypeToken=dict(name=name,actorLink=False,texture={'src':'systems/brutal-rpg/assets/killer.svg'}),system=dict(bio=biography,notes=f'LOCAL: {place}\nSINAL CARACTERÍSTICO: {mark}\nPISTA DE INVESTIGAÇÃO: {clue}\nGANCHO: aparição inicial indireta; conduza a cena pela tensão, pistas e escolhas.',primary=t1,secondary=t2,initiative=9,pool=dict(value=total,max=total),escape=dict(value=0,max=max(nb[t1],nb[t2])+1),horror=nb[t1],freeScares=7-total,stigma=f'{mark} Seu comportamento espelha a antiga profissão de {role}.',intent=f'Fazer as pessoas confrontarem o episódio escondido em {place}.',secret=secret),items=embedded))

survivors=[]
initial_pool=6
for i,(name,archetype,role,history,secret,iconic,bond,desire,place,equip) in enumerate(parse(survivors_txt,10)):
    gear=[x.strip() for x in equip.split(';')]
    embedded=[]
    for g in gear:
        if g not in items_by_name:
            created=item(g,'equipamento',f'Objeto pessoal relacionado à jornada de {name}.')
            items.append(created);items_by_name[g]=created
        entry={k:v for k,v in items_by_name[g].items() if k!='flags'}
        entry=json.loads(json.dumps(entry))
        # Apenas UM Recurso efetivo inicial, conforme BRUTAL 0.3, p. 80.
        if entry['type']=='recurso' and any(x['type']=='recurso' for x in embedded):
            entry['type']='equipamento';entry['system']['uses']={'value':0,'max':0}
            entry['system']['notes']='Objeto de cenário, não é Recurso ativo até a Diretora autorizar.'
        if entry['type']=='pista':
            entry['type']='equipamento';entry['system']['uses']={'value':0,'max':0}
            entry['system']['notes']='Objeto narrativo. Pistas jogáveis são conquistadas durante Suspenses/Encontros.'
        embedded.append(entry)
    initiatives=dict(heroina=1,atleta=2,valentona=3,esbelta=4,inocente=5,nerd=6,relaxada=7,cetica=8)
    survivors.append(dict(name=name,type='sobrevivente',img='systems/brutal-rpg/assets/survivor.svg',flags={'brutal-rpg':{'sourceId':f'sobrevivente-{i+1:02d}','original':True,'edition':'0.2.0'}},prototypeToken=dict(name=name,actorLink=True,texture={'src':'systems/brutal-rpg/assets/survivor.svg'}),system=dict(bio=f'{name}, {role}. {history} Em uma história de BRUTAL, não é um herói invulnerável: precisa tomar decisões sob pressão, preservar vínculos e descobrir quando fugir. O que sabe pode ser mais valioso do que aquilo que carrega.',notes=f'CENÁRIO SUGERIDO: {place}\nSEGREDO (para a Diretora): {secret}\nMOTIVAÇÃO: {desire}',archetype=archetype,initiative=initiatives[archetype],pool=dict(value=initial_pool,max=6),escape=dict(value=0,max=6),tension=0,looks=f'{role}, com vestuário e marcas pessoais apropriados ao cenário.',iconic=iconic,bond=bond,darkDesire=desire),items=embedded))
for name,data in [('assassinos',killers),('sobreviventes',survivors),('itens',items)]:
    path=OUT/(name+'.json');path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(name,len(data),'arquivo',path.stat().st_size)
