from flask import Flask, request, jsonify
from pyswip import Prolog
import os

app = Flask(__name__)
prolog = Prolog()

def findString(src, toFind1 = None, toFind2 = None):
    index1 = 0
    if (toFind1 != None or toFind1 == ""):
        index1 = src.find(toFind1)
        if (index1 < 0):
            return ""
        index1 += len(toFind1)

    index2 = len(src)
    if (toFind2 != None or toFind2 == ""):
        index2 = src.find(toFind2, index1)
        if (index2 < 0):
            return ""
        
    if (index1 >= index2):
        return ""

    return src[index1:index2]

def inicializar_prolog():
    prolog_file = "medical_diagnosis.pl"
    prolog.consult(prolog_file)

@app.route('/sintomas', methods=['GET'])
def get_sintomas():
    try:
        sintomas = list(prolog.query("listar_sintomas(Sintomas)"))
        if sintomas:
            lista_sintomas = list(sintomas[0]['Sintomas'])
            return jsonify({
                "status": "success",
                "sintomas": lista_sintomas
            })
        return jsonify({
            "status": "error",
            "message": "Não foi possível obter a lista de sintomas"
        }), 500
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/diagnostico', methods=['POST'])
def get_diagnostico():
    try:
        dados = request.get_json()
        if not dados or 'sintomas' not in dados:
            return jsonify({
                "status": "error",
                "message": "E necessário fornecer uma lista de sintomas"
            }), 400
        sintomas = dados['sintomas']
        query = f"diagnosticar_todas({sintomas}, Diagnosticos)"
        resultados = list(prolog.query(query))

        if resultados:
            diagnosticos = []
            for resultado in resultados[0]['Diagnosticos']:
                doenca = str(findString(resultado, "(", ","))
                probabilidade = float(findString(resultado, ", ", ")"))
                diagnosticos.append({ "doenca": doenca, "probabilidade": probabilidade })
            diagnosticos.sort(key=lambda x: x['probabilidade'], reverse=True)
            return jsonify({
                "status": "success",
                "diagnosticos": diagnosticos
            })
        return jsonify({
            "status": "success",
            "diagnosticos": []
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/imc', methods=['POST'])
def calcular_imc():
    try:
        dados = request.get_json()
        if not dados or 'peso' not in dados or 'altura' not in dados:
            return jsonify({
                "status": "error",
                "message": "E necessário fornecer peso e altura"
            }), 400
        peso = float(dados['peso'])
        altura = float(dados['altura']) / 100
        query = f"analisar_imc({peso}, {altura}, ResultadoIMC)"
        resultados = list(prolog.query(query))
        
        if resultados:
            resultado = resultados[0]['ResultadoIMC']
            imc = None
            classificacao = None
            riscos = []
            for item in resultado:
                item0 = findString(item, "(", ")")
                name = findString(item, "", "(")
                if name == 'imc':
                    imc = float(item0)
                elif name == 'classificacao':
                    classificacao = str(item0)
                elif name == 'riscos':
                    item0 = findString(item0, "[", "]")
                    item0 = item0.split(", ")
                    for risco in item0:
                        print(f"r={item0}")
                        riscos.append(risco)
            return jsonify({
                "status": "success",
                "imc": imc,
                "classificacao": classificacao,
                "riscos": riscos
            })
        return jsonify({
            "status": "error",
            "message": "Nao foi possível calcular o IMC"
        }), 500
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    inicializar_prolog()
    app.run(debug=True)
