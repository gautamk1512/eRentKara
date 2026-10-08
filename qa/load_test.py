"""Repeatable HTTP load characterization against a separate, synthetic database."""
import os,sys,json,time,threading,statistics,urllib.request,urllib.error,logging
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from socketserver import ThreadingMixIn
from wsgiref.simple_server import make_server,WSGIServer,WSGIRequestHandler
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'backend'))
os.environ['DJANGO_SETTINGS_MODULE']='erentkarar.settings'
import django
from django.conf import settings
work=ROOT/'qa/.data'; work.mkdir(parents=True,exist_ok=True)
settings.DATABASES={'default':{'ENGINE':'django.db.backends.sqlite3','NAME':str(work/'load.sqlite3'),'OPTIONS':{'timeout':20,'transaction_mode':'IMMEDIATE'}}}
settings.MEDIA_ROOT=str(work/'media'); settings.DEBUG=False; settings.ALLOWED_HOSTS=['127.0.0.1','localhost','testserver']
settings.EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend'
django.setup()
from django.core.management import call_command
from django.core.wsgi import get_wsgi_application
from django.db import connection
from apps.accounts.models import User
from apps.organizations.models import Organization,OrganizationMember
from apps.properties.models import Property,Building,Floor,Room,Bed
from rest_framework_simplejwt.tokens import RefreshToken
call_command('migrate',verbosity=0,interactive=False)
owner,_=User.objects.get_or_create(email='load-owner@example.test',defaults={'role':'OWNER'})
org,_=Organization.objects.get_or_create(name='Synthetic load dataset',defaults={'contact_email':owner.email,'contact_phone':'9876543200'})
OrganizationMember.objects.get_or_create(organization=org,user=owner,defaults={'role':'OWNER'})
if not Property.objects.filter(organization=org).exists():
    Property.objects.bulk_create([Property(organization=org,title=f'Load stay {i}',slug=f'load-stay-{i}',description='Synthetic test fixture',address='Test street',locality='Center',city='Vadodara',state='Gujarat',pincode='390001',monthly_rent_starting=5000+i,is_published=True,verification_status='VERIFIED') for i in range(200)])
    Building.objects.bulk_create([Building(property=p,name='Main') for p in Property.objects.filter(organization=org)])
    Floor.objects.bulk_create([Floor(building=b,floor_number=1,name='Ground') for b in Building.objects.filter(property__organization=org)])
    Room.objects.bulk_create([Room(floor=f,room_number=str(j),base_rent=5000) for f in Floor.objects.filter(building__property__organization=org) for j in range(2)])
    Bed.objects.bulk_create([Bed(room=r,bed_identifier=str(j),rent_amount=5000,deposit_amount=10000) for r in Room.objects.filter(floor__building__property__organization=org) for j in range(2)])
token=str(RefreshToken.for_user(owner).access_token)
class Server(ThreadingMixIn,WSGIServer): daemon_threads=True
class Quiet(WSGIRequestHandler):
    def log_message(self,*args): pass
server=make_server('127.0.0.1',0,get_wsgi_application(),server_class=Server,handler_class=Quiet)
thread=threading.Thread(target=server.serve_forever,daemon=True); thread.start()
origin=f'http://127.0.0.1:{server.server_port}'
def hit(path):
    started=time.perf_counter(); status=0
    try:
        req=urllib.request.Request(origin+path,headers={'Authorization':'Bearer '+token})
        with urllib.request.urlopen(req,timeout=30) as r: r.read(); status=r.status
    except urllib.error.HTTPError as exc: status=exc.code
    except Exception: pass
    return status,(time.perf_counter()-started)*1000
results=[]
for name,path in [('marketplace','/api/v1/marketplace/search/?city=Vadodara&limit=60'),('dashboard','/api/v1/reports/dashboard-metrics/'),('inventory','/api/v1/properties/')]:
    hit(path)
    for concurrency in [1,5,15,30]:
        start=time.perf_counter()
        with ThreadPoolExecutor(max_workers=concurrency) as pool: rows=list(pool.map(lambda _:hit(path),range(90)))
        elapsed=time.perf_counter()-start; times=sorted(r[1] for r in rows)
        result={'workload':name,'concurrency':concurrency,'requests':len(rows),'errors':sum(s!=200 for s,_ in rows),'rps':round(len(rows)/elapsed,2),'p50_ms':round(statistics.median(times),2),'p95_ms':round(times[int((len(times)-1)*.95)],2),'max_ms':round(max(times),2)}
        results.append(result); print(json.dumps(result),flush=True)
server.shutdown(); server.server_close(); connection.close()
output=ROOT/'qa/results'; output.mkdir(exist_ok=True)
(output/'load-results.json').write_text(json.dumps({'environment':'Windows; threaded stdlib WSGI; isolated SQLite; 200 properties, 400 rooms, 800 beds; not production capacity certification','results':results},indent=2))
