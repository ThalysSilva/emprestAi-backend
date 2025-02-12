export function removeLoops(objeto: any, vistos = new WeakSet()): any {
  if (objeto === null || typeof objeto !== 'object') {
    return objeto;
  }

  if (vistos.has(objeto)) {
    return undefined;
  }

  vistos.add(objeto);

  if (Array.isArray(objeto)) {
    return objeto
      .map((item) => removeLoops(item, vistos))
      .filter((item) => item !== undefined);
  }

  return Object.entries(objeto).reduce((acumulador, [chave, valor]) => {
    const novoValor = removeLoops(valor, vistos);
    if (novoValor !== undefined) {
      return { ...acumulador, [chave]: novoValor };
    }
    return acumulador;
  }, {});
}

export function normalizeKeys(object: any): any {
  if (object === null || typeof object !== 'object') {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map((item) => normalizeKeys(item));
  }

  return Object.fromEntries(
    Object.entries(object).map(([chave, valor]) => [
      chave.replace(/[.$]/g, '_'),
      normalizeKeys(valor),
    ]),
  );
}
