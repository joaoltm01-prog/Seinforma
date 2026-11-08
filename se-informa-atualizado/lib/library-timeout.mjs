export async function libraryTimeout(operation, milliseconds = 4000) {
  let timer;
  try {
    return await Promise.race([operation, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Índice digital indisponível.')), milliseconds);
    })]);
  } finally { clearTimeout(timer); }
}
