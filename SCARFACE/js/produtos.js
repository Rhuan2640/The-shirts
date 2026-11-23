// Para trocar imagens: coloque o arquivo na pasta img/ e ajuste o campo "imagem".
// Se a imagem não existir, o site mostra automaticamente um quadro cinza com o nome do produto.
const PRODUTOS = [
  { id: 1, nome: "CAMISETA PRETA SCARFACE", preco: 55.00, imagem: "img/camiseta-preta-scarface.png", categoria: "camisetas", descricao: "Camiseta preta oficial SCARFACE, 100% algodão, modelagem oversized.", promocao: true, lancamento: true },
  { id: 2, nome: "CAMISETA PRETA SCAR FACE", preco: 100.00, imagem: "img/camiseta-preta-scar-face.png", categoria: "camisetas", descricao: "Camiseta preta com estampa clássica na parte inferior.", promocao: true, lancamento: false },
  { id: 3, nome: "CAMISETA SCAR FACE", preco: 100.00, imagem: "img/camiseta-branca-scar-face.png", categoria: "camisetas", descricao: "Camiseta branca com estampa lateral em preto.", promocao: true, lancamento: true },
  { id: 4, nome: "Calça baggy cinza", preco: 170.79, imagem: "img/calca-baggy-cinza.png", categoria: "calcas", descricao: "Calça jeans baggy cinza lavada, caimento largo.", promocao: true, lancamento: false },
  { id: 5, nome: "VANS KNU-SKOOL", preco: 499.99, imagem: "img/vans-knu-skool.png", categoria: "tenis", descricao: "Tênis skate preto e branco com cabedal volumoso.", promocao: true, lancamento: false },
  { id: 6, nome: "Tênis Nike Air Max", preco: 1329.99, imagem: "img/nike-air-max.png", categoria: "tenis", descricao: "Tênis Air Max azul com amortecimento visível.", promocao: true, lancamento: false },
  { id: 7, nome: "Bota preta", preco: 4309.48, imagem: "img/bota-preta.png", categoria: "tenis", descricao: "Bota de cano alto em couro preto com fecho de velcro.", promocao: true, lancamento: false },
  { id: 8, nome: "Dunk Black And White", preco: 699.23, imagem: "img/dunk-black-white.png", categoria: "tenis", descricao: "Dunk Low em preto e branco com sola gum.", promocao: true, lancamento: true },
  { id: 9, nome: "Boné SCARFACE Trucker", preco: 89.90, imagem: "img/bone-scarface.png", categoria: "acessorios", descricao: "Boné trucker preto com logo vermelho bordado.", promocao: false, lancamento: true },
  { id: 10, nome: "Óculos SCARFACE Clear", preco: 149.90, imagem: "img/oculos-scarface.png", categoria: "acessorios", descricao: "Óculos de armação transparente com lentes escuras.", promocao: false, lancamento: true }
];
