% Base de conhecimento de doencas e sintomas
doenca(gripe, [febre, dor_de_cabeca, coriza, tosse, fadiga]).
doenca(covid19, [febre, tosse_seca, perda_de_olfato, perda_de_paladar, fadiga]).
doenca(dengue, [febre_alta, dor_muscular, dor_nas_articulacoes, fadiga, manchas_na_pele]).
doenca(pneumonia, [febre_alta, tosse_com_catarro, dificuldade_respiratoria, dor_no_peito]).
doenca(sinusite, [dor_facial, congestao_nasal, dor_de_cabeca, coriza]).
doenca(rinite, [espirros, coceira_nasal, coriza, congestao_nasal]).
doenca(bronquite, [tosse_persistente, chiado_no_peito, dificuldade_respiratoria, fadiga]).
doenca(amigdalite, [dor_de_garganta, febre, dificuldade_para_engolir, ganglios_inchados]).
doenca(asma, [falta_de_ar, chiado_no_peito, tosse_noturna, aperto_no_peito]).
doenca(tuberculose, [tosse_persistente, febre, perda_de_peso, suor_noturno, fadiga]).

% Regra para diagnosticar doencas com base nos sintomas
diagnosticar(Sintomas, Doenca, Probabilidade) :-
    doenca(Doenca, SintomasDoenca),
    intersection(Sintomas, SintomasDoenca, SintomasComuns),
    length(SintomasComuns, NumSintomasComuns),
    length(SintomasDoenca, NumSintomasDoenca),
    Probabilidade is (NumSintomasComuns / NumSintomasDoenca) * 100.

% Regra para obter todas as doencas possiveis com suas probabilidades
diagnosticar_todas(Sintomas, Diagnosticos) :-
    findall(
        doenca(Doenca, Prob),
        (diagnosticar(Sintomas, Doenca, Prob), Prob > 0),
        Diagnosticos
    ).

% Regra para listar todos os sintomas conhecidos
listar_sintomas(Sintomas) :-
    findall(
        S,
        (doenca(_, SintomasDoenca), member(S, SintomasDoenca)),
        ListaCompleta
    ),
    sort(ListaCompleta, Sintomas).

% Cálculo de IMC
calcular_imc(Peso, Altura, IMC) :-
    IMC is Peso / (Altura * Altura).

% Classificação de IMC
classificar_imc(IMC, Classificacao, Riscos) :-
    (   IMC < 18.5 ->
        Classificacao = 'Abaixo do peso',
        Riscos = ['Risco de desnutricao', 'Problemas de desenvolvimento', 'Sistema imunologico enfraquecido']
    ;   IMC =< 24.9 ->
        Classificacao = 'Peso normal',
        Riscos = ['Sem riscos significativos associados']
    ;   IMC =< 29.9 ->
        Classificacao = 'Sobrepeso',
        Riscos = [
            'Aumento do risco de doencas cardiacas', 
            'Maior probabilidade de diabetes tipo 2', 
            'Risco elevado de hipertensao', 
            'Problemas articulares'
        ]
    ;   IMC =< 34.9 ->
        Classificacao = 'Obesidade Grau I',
        Riscos = [
            'Alto risco de doencas cardiovasculares', 
            'Diabetes tipo 2', 
            'Apneia do sono', 
            'Problemas articulares graves', 
            'Colesterol alto'
        ]
    ;   IMC =< 39.9 ->
        Classificacao = 'Obesidade Grau II',
        Riscos = [
            'Risco muito alto de doencas cardiacas', 
            'Diabetes tipo 2 severo', 
            'Problemas respiratorios', 
            'Maior risco de certos tipos de cancer', 
            'Reducao significativa da expectativa de vida'
        ]
    ;   Classificacao = 'Obesidade Grau III (Obesidade Mórbida)',
        Riscos = [
            'Extremo risco de doencas cardiovasculares', 
            'Diabetes tipo 2 com complicacoes', 
            'Problemas respiratorios graves', 
            'Alto risco de morte prematura', 
            'Limitacoes significativas na mobilidade'
        ]
    ).

% Função completa de analise de IMC
analisar_imc(Peso, Altura, ResultadoIMC) :-
    calcular_imc(Peso, Altura, IMC),
    % Arredonda o IMC para 2 casas decimais
    IMCArredondado is round(IMC * 100) / 100,
    classificar_imc(IMC, Classificacao, Riscos),
    ResultadoIMC = [
        imc(IMCArredondado),
        classificacao(Classificacao),
        riscos(Riscos)
    ].
