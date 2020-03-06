const puppeteer = require('puppeteer');

(async () => {
  try {
    const navegador = await puppeteer.launch();
    const pagina = await navegador.newPage();
    await pagina.goto('https://resultados.as.com/resultados/futbol/primera/clasificacion/');

    let tabla = await pagina.evaluate(() => {
      const equipos = [...document.querySelectorAll('.nombre-equipo')].map((nodoEquipo) => nodoEquipo.innerText)
      const puntos = [...document.querySelectorAll("td.destacado")].map((nodoPuntos) => nodoPuntos.innerText)
      return equipos.map((equipo, index) => ({
        equipo: equipo,
        puntos: puntos[index]
      }))
    })

    const cmp = (x, y) => {
      // note when you use the function that the minus before -cmp, for descending order
      return (x > y) ? 1 : (x < y) ? -1 : 0;
    };

    const sortByScore = (table) => {
      return table.sort((a, b) => {
        return cmp(
          [-cmp(parseInt(a.puntos), parseInt(b.puntos)), cmp(a.equipo, b.equipo)],
          [-cmp(parseInt(b.puntos), parseInt(a.puntos)), cmp(b.equipo, a.equipo)]
        );
      });
    }

    let tablas = {
      total: sortByScore(tabla.slice(0, 20)),
      casa: sortByScore(tabla.slice(20, 40)),
      fuera: sortByScore(tabla.slice(40, 60))
    }

    Object.keys(tablas).forEach((key) => {
      console.log(`\n${key.toUpperCase()}`)
      console.table(tablas[key]);
    });

    await navegador.close();
  } catch (e) {
    console.log("ERROR", e)
  }
})();