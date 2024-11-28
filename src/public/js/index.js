let SINTOMAS = ["Febre", "Dor de cabeca", "Nausea", "Fadiga", "Tosse", "Dor de garganta", "Nariz escorrendo", "Dores no corpo", "Diarreia", "Falta de ar", "Tontura", "Calafrios", "Suor excessivo", "Perda de olfato", "Perda paladar"]

$(async function ()
{
    var tag = tagger(document.querySelector('[name="sintomas"]'), {
        allow_duplicates: false, allow_spaces: true, add_on_blur: true, wrap: true, tag_limit: 5, completion: { list: SINTOMAS }
    });

    $(`[name=sintoma]`).autocomplete({
        source: SINTOMAS,
        select: function (event, ui) 
        {
            $(`[name=sintoma]`).val("");
            tag.add_tag(ui.item.value);
        },
    });

    $(`#diagnostico-modal .btn-close`).click(() => { $(`#diagnostico-modal`).modal('hide'); });

    $(`[name=nome]`).val("Joao");
    $(`[name=idade]`).val("18");
    $(`[name=sexo]`).val("masculino");
    $(`[name=peso]`).val("30");
    $(`[name=altura]`).val("210");
    $(`[name=sintoma]`).val("Febre");

    tag.add_tag("Dor de garganta");
    tag.add_tag("Dor de cabeca");
    tag.add_tag("Febre");
});

function getDiagnostic(event)
{
    event.preventDefault();

    let sintomas1 = $('[name=sintomas]').val().split(",")
    let sintomas2 = [];
    for (let i = 0; i < sintomas1.length; i++)
    {
        let sintoma = sintomas1[i];
        sintoma = sintoma.replaceAll(" ", "_").toLowerCase();
        sintomas2.push(sintoma);
    }

    let body = {
        nome: $('[name=nome]').val(),
        idade: $('[name=idade]').val(),
        sexo: $('[name=sexo]').val(),
        peso: $('[name=peso]').val(),
        altura: $('[name=altura]').val(),
        sintomas: sintomas2
    }

    let url = "http://127.0.0.1:5000/diagnostico";
    let req = {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }
    let res = fetch(url, req);
    console.log(body)

    //$('#diagnostico-modal').modal('show');
    //return;
}
