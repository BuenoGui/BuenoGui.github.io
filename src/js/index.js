const linguagens_dicionario = {
    "HTML":`<i class="bi bi-filetype-html"></i>`,
    "CSS":`<i class="bi bi-css"></i>`,
    "SCSS":`<i class="bi bi-filetype-scss"></i>`,
    "JavaScript":`<i class="bi bi-javascript"></i>`,
    "TypeScript":`<i class="bi bi-typescript"></i>`,
    "Java":`<i class="bi bi-filetype-java"></i>`
}

async function pegar_json(url) {
    const resposta = await fetch(url)

    if (!resposta.ok) {
        throw new Error(`Erro no link: ${url} \n status ---> ${resposta.status}`)
    }

    return resposta.json()
}

async function montar_html(repositorio) {
    const linguagens = await pegar_json(repositorio.languages_url)

    const texto_linguagens = Object.keys(linguagens).
    map(nome => linguagens_dicionario[nome] ?? nome).join(" ")

    const data_formatada = new Date(repositorio.pushed_at).toLocaleDateString("pt-BR")

    return `
            <div class="projeto" data-url="${repositorio.html_url}">
                <h2>${repositorio.name}</h2>
                <div class="linguagem">
                    <p>Utilizei:</p>
                        <p class="holder_logos">
                            ${texto_linguagens}
                        </p>
                </div>
                <p class="data_projeto">ultima atualização: ${data_formatada}</p>
            </div>       
    `
}

(async () => {
    const holder_projetos = document.querySelector(".git_container")

    const repositorios = await pegar_json("https://api.github.com/users/BuenoGui/repos?per_page=100&sort=pushed")

    const link_linguagens = await Promise.all(repositorios.map(montar_html))
    
    holder_projetos.innerHTML = link_linguagens.join(" ")

    holder_projetos.addEventListener('click', (evento) => {
        const projeto = evento.target.closest(".projeto")
        if (!projeto) return 

        window.open(projeto.dataset.url, "_blank")
    })

}) ();



