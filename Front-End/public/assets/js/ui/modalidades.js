const modalidades = {
  FORCA: { nome: 'Força', icone: 'forca.svg' },
  CARDIO: { nome: 'Cardio', icone: 'cardio.svg' },
  MOBILIDADE: { nome: 'Mobilidade', icone: 'mobilidade.svg' },
};

export function obterModalidade(tipo) {
  return modalidades[tipo] || { nome: 'Treino', icone: 'grupo.svg' };
}

export function criarEtiquetaModalidade(tipo) {
  const modalidade = obterModalidade(tipo);
  const etiqueta = document.createElement('span');
  etiqueta.className = 'etiqueta-modalidade';
  const icone = document.createElement('img');
  icone.src = `assets/images/icons/${modalidade.icone}`;
  icone.alt = '';
  etiqueta.append(icone, document.createTextNode(modalidade.nome));
  return etiqueta;
}
