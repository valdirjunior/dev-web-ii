from spyne import Application, rpc, ServiceBase, Integer, Unicode
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication
import math

class MDCService(ServiceBase):
    @rpc(Integer(name='x'), Integer(name='y'), _returns=Integer(name='MDC'))
    def CalculateMDC(ctx, x, y):
        return math.gcd(x, y)

application = Application(
    [MDCService],
    tns='http://localhost:3000/mdc',
    name='MDCCalculator',
    in_protocol=Soap11(validator='lxml'),
    out_protocol=Soap11()
)

if __name__ == '__main__':
    from wsgiref.simple_server import make_server
    print("Servidor SOAP rodando em http://localhost:3000/mdc")
    wsgi_app = WsgiApplication(application)
    server = make_server('localhost', 3000, wsgi_app)
    server.serve_forever()
