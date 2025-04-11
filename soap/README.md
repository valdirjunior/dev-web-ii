# Atividades SOAP

## Como executar

É necessário utilizar ambiente virtual venv, então, certifique que você está na pasta soap (caso contrário não funcionará) execute no terminal:

```bash
python3 -m venv venv
```
No Linux:
```bash
source venv/bin/activate
```

No Windows:
```bash
venv\Scripts\activate
```

Em seguida, instale as dependências com:
```bash
pip install -r requirements.txt
```

### Exercício 1

No terminal, execute com:
```bash
python ex1_soap.py
```

### Exercício 2

Navegue até a pasta do exercício:
```bash
cd ex2_soap/
```

Inicie o servidor com:
```bash
python mdc_server.py
```

Abra um novo terminal, e certifique que está na pasta soap. Em seguida, precisamos iniciar o ambiente virtual novamente: 

No Linux:
```bash
source venv/bin/activate
```

No Windows:
```bash
venv\Scripts\activate
```

Navegue até a pasta do exercício:
```bash
cd ex2_soap/
```

Então, execute o cliente:
```bash
python mdc_server.py
```

Para encerrar o ambiente venv, digite no terminal em que está ativado:
```bash
deactivate
```