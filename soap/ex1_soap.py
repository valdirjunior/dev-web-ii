from zeep import Client

wsdl_url = 'http://www.dneonline.com/calculator.asmx?WSDL'

client = Client(wsdl=wsdl_url)

a = 10

b = 5

print(f"Soma: {a} + {b} = {client.service.Add(a, b)}")
print(f"Subtração: {a} - {b} = {client.service.Subtract(a, b)}")
print(f"Multiplicação: {a} * {b} = {client.service.Multiply(a, b)}")
print(f"Divisão: {a} / {b} = {client.service.Divide(a, b)}")