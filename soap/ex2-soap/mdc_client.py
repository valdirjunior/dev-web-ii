from zeep import Client

wsdl_url = 'http://localhost:3000/mdc?wsdl'
client = Client(wsdl_url)

x = 1920
y = 1080

mdc = client.service.CalculateMDC(x, y)

aspect_x = x // mdc
aspect_y = y // mdc

print(f"Imagem: {x}x{y}")
print(f"MDC: {mdc}")
print(f"Aspect Ratio: {aspect_x}:{aspect_y}")
