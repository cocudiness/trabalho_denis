//let SINTOMAS = ["Febre", "Dor de cabeca", "Nausea", "Fadiga", "Tosse", "Dor de garganta", "Nariz escorrendo", "Dores no corpo", "Diarreia", "Falta de ar", "Tontura", "Calafrios", "Suor excessivo", "Perda de olfato", "Perda paladar"]
let BASEURL = "http://127.0.0.1:5000/";

$(async function ()
{
    $(`#diagnostico-modal .btn-close`).click(() => { $(`#diagnostico-modal`).modal('hide'); });

    let sintomas = await getSintomas();
    if (sintomas.length <= 0)
    {
        window.alert("Falha ao carregar sintomas");
        return;
    }
    let tag = tagger(document.querySelector('[name="sintomas"]'), {
        allow_duplicates: false, allow_spaces: true, add_on_blur: true, wrap: true, tag_limit: 9, completion: { list: sintomas }
    });
    $(`[name=sintoma]`).autocomplete({
        minLength: 0,
        source: sintomas,
        select: function (event, ui) 
        {
            let sintomas = $('[name=sintomas]').val().split(",")
            if (sintomas.length >= 9)
            {
                window.alert("Remova um sintoma para adicionar outro");
                return;
            }
            $(`[name=sintoma]`).val("");
            tag.add_tag(ui.item.value);
        }
    }).focus(function () { $(this).autocomplete("search"); });

    // TEMP
    $(`[name=nome]`).val("Joao");
    $(`[name=idade]`).val("18");
    $(`[name=sexo]`).val("masculino");
    $(`[name=peso]`).val("30");
    $(`[name=altura]`).val("210");
    $(`[name=sintoma]`).val("febre");

    tag.add_tag("febre");
    //tag.add_tag("tosse noturna");
    //tag.add_tag("falta de ar");
    // TEMP
});

async function postDiagnostic(event)
{
    event.preventDefault();

    let sintomas1 = $('[name=sintomas]').val().split(",")
    let sintomas = [];
    for (let i = 0; i < sintomas1.length; i++)
    {
        let sintoma = sintomas1[i];
        sintoma = sintoma.replaceAll(" ", "_").toLowerCase();
        sintomas.push(sintoma);
    }

    let body = {
        nome: $('[name=nome]').val(),
        idade: $('[name=idade]').val(),
        sexo: $('[name=sexo]').val(),
        peso: $('[name=peso]').val(),
        altura: $('[name=altura]').val(),
        sintomas: sintomas
    }

    let url = `${BASEURL}api/diagnostico`;
    let req = {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }
    let res = await fetch(url, req);
    let json = await res.json();
    let diagnostico = json;

    url = `${BASEURL}api/imc`;
    req = {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }
    res = await fetch(url, req);
    json = await res.json();
    let imc = json;

    let doencasArr = [];
    for (let i = 0; i < diagnostico.diagnosticos.length; i++)
    {
        let doenca = diagnostico.diagnosticos[i].doenca;
        doenca = String(doenca).charAt(0).toUpperCase() + String(doenca).slice(1)
        doencasArr.push(`<div class="row"><a>${doenca} (${diagnostico.diagnosticos[i].probabilidade}% de chance)</a></div>`);
    }
    let doencasStr = doencasArr.join().replaceAll(",", "");

    let riscosArr = [];
    for (let i = 0; i < imc.riscos.length; i++)
    {
        riscosArr.push(`<div class="row"><a>${imc.riscos[i]}</a></div>`);
    }
    let riscosStr = riscosArr.join().replaceAll(",", "").replaceAll("'", "");

    $('#diagnostico-modal [name=diagnostico]').html(`
        <h4 class="mb-2">Com base nos seus sintomas, voce pode possuir a(s) seguinte(s) doenca(s):</h4>
        ${doencasStr}
        <hr/>

        <h4>Com base no seu peso e altura:</h4>
        <div class="row">
            <h5>Seu IMC: 
                <a class="imc">${imc.imc}</a>
            </h5>
        </div>

        <div class="row">
            <h5>Sua classificacao: 
                <a class="imc">${imc.classificacao}</a>
            </h5>
        </div>

        <div class="row">
            <h5>Seus riscos:</h5>
        </div>
        ${riscosStr}
        <div class="row mb-3"></div>
        <hr/>

        <p class="text-danger">OBS: O diagnóstico fornecido por nós é apenas provisório e pode conter erros. Para maior confiabilidade, procure um médico especialista.</p>
        <hr/>
        <btn class="btn btn-success w-100" name="downloadBtn">
            Imprimir
        </btn>
        `);

    $('#diagnostico-modal [name=downloadBtn]').unbind('click');
    $('#diagnostico-modal [name=downloadBtn]').on('click', () => 
    {
        window.print();
    })

    $('#diagnostico-modal').modal('show');
}


async function getSintomas()
{
    let url = `${BASEURL}api/sintomas`;
    let req = {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    }
    let res = await fetch(url, req);
    let json = await res.json();

    if (json.status != "success")
    {
        return [];
    }

    let sintomas = json.sintomas;
    let sintomas2 = [];
    for (let i = 0; i < sintomas.length; i++)
    {
        let sintoma = sintomas[i];
        sintoma = sintoma.replaceAll("_", " ");
        sintomas2.push(sintoma);
    }

    return sintomas2;
}
